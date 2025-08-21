"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import CustomCountrySelect from "@/components/input/CustomCountrySelect";
import CustomSelect from "@/components/input/CustomSelect";
import CustomTextInput from "@/components/input/CustomTextInput";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchBasicUserInfo,
  setBasicUserInfo,
} from "@/lib/features/kyc/basicUserInfoSlice";
import { useEffect, useState } from "react";
import { updateBasicUserInfo } from "@/api/basic-profile";
import { changedData, hasChanges } from "@/utils/functions/check";
import { toast } from "sonner";
import { useUser } from "@/contexts/user";
import moment from "moment";
import { useSettingModal } from "@/contexts/modal-setting";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: Yup.string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  otherNames: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  dateOfBirth: Yup.date()
    .nullable()
    .transform((value, originalValue) => {
      // Handle empty string case
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return null;
      }
      return value;
    })
    .max(new Date(), "Date of Birth cannot be in the future")
    .required("Date of Birth is required"),
  mobileNumber: Yup.string().required("Mobile Number is required"),
  optionalNumber: Yup.string(),
  maritalStatus: Yup.string().required("Marital Status is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  userName: Yup.string().required("Username is required"),
});

const BasicInfoSettingsForm = ({
  disabled = false,
}: {
  loading?: boolean;
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { toggleModal } = useSettingModal();
  const { basicUserInfo, created } = useAppSelector(
    (state) => state.basicUserInfo
  );
  const { currentUser, fetchCurrentUser } = useUser({});
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (values: typeof initialValues) => {
    try {
      setIsSubmiting(true);
      // Check if there are any changes when updating
      if (!created) {
        if (!hasChanges(basicUserInfo, values)) {
          toast.info("No changes to update");
          return;
        }
      }

      // Validate and format date properly
      const formattedDate = values.dateOfBirth
        ? moment(values.dateOfBirth).toISOString()
        : null;

      const response = await updateBasicUserInfo(
        changedData(
          { ...basicUserInfo },
          { ...values, dateOfBirth: formattedDate }
        )
      );

      if (response?.data?.success) {
        dispatch(setBasicUserInfo(response.data.data));

        let modalData: any = {
          description: "User Profile Information has been Updated Successfully",
          title: "Great",
        };
        if (!currentUser?.isKyc) {
          modalData = {
            ...modalData,
            nextRoute: "/settings/kyc/contact",
          };
        }
        toggleModal("detailsUpdatedModal", modalData);
        fetchCurrentUser({ load: false });
        
        // Exit edit mode after successful submission
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      // toast.error('Something went wrong')
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form values to original basicUserInfo data
    if (basicUserInfo) {
      setValues({
        ...values,
        firstName: basicUserInfo?.firstName || "",
        lastName: basicUserInfo?.lastName || "",
        otherNames: basicUserInfo?.otherNames || "",
        gender: basicUserInfo?.gender || "",
        mobileNumber: basicUserInfo?.mobileNumber || "",
        dateOfBirth: basicUserInfo?.dateOfBirth
          ? moment(basicUserInfo.dateOfBirth).format("YYYY-MM-DD")
          : "",
        optionalNumber: basicUserInfo?.optionalNumber || "",
        maritalStatus: basicUserInfo?.maritalStatus || "",
      });
    }
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    otherNames: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    optionalNumber: "",
    maritalStatus: "",
    email: currentUser?.profile.email || "",
    userName: currentUser?.profile.userName || "",
  };

  const {
    values,
    errors,
    setValues,
    handleSubmit,
    handleChange,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    dispatch(fetchBasicUserInfo());
  }, [dispatch]);

  useEffect(() => {
    setValues({
      ...values,
      firstName: basicUserInfo?.firstName || "",
      lastName: basicUserInfo?.lastName || "",
      otherNames: basicUserInfo?.otherNames || "",
      gender: basicUserInfo?.gender || "",
      mobileNumber: basicUserInfo?.mobileNumber || "",
      dateOfBirth: basicUserInfo?.dateOfBirth
        ? moment(basicUserInfo.dateOfBirth).format("YYYY-MM-DD")
        : "",
      optionalNumber: basicUserInfo?.optionalNumber || "",
      maritalStatus: basicUserInfo?.maritalStatus || "",
    });
  }, [basicUserInfo]);

  // Determine if inputs should be disabled
  const inputsDisabled = disabled || !isEditing;

  return (
    <form onSubmit={handleSubmit} className="mt-7 w-full ">
      <div className="grid grid-cols-1 tablet:grid-cols-2 pb-10  w-full items-start justify-start gap-2 max-tablet:gap-5 tablet:gap-5   ">
        <CustomTextInput
          type="text"
          id="firstName"
          label="First Name"
          placeholder="Enter your first name"
          inputClassName="bg-divider-100"
          showStar={true}
          value={values.firstName}
          onChange={handleChange}
          error={touched.firstName && errors.firstName}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          inputClassName="bg-divider-100"
          showStar={true}
          value={values.lastName}
          onChange={handleChange}
          error={touched.lastName && errors.lastName}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="otherNames"
          label="Other Names"
          placeholder="Enter Other Names"
          inputClassName="bg-divider-100"
          value={values.otherNames}
          onChange={handleChange}
          disabled={inputsDisabled}
        />
        <CustomSelect
          label="Gender"
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
          placeholder="Select gender"
          className="flex-1 mt-0"
          showStar={true}
          value={values.gender}
          onChange={(value) => setFieldValue("gender", value)}
          error={touched.gender && errors.gender}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="date"
          id="dateOfBirth"
          label="Date of Birth"
          inputClassName="bg-divider-100"
          showStar={true}
          value={values.dateOfBirth}
          onChange={handleChange}
          error={touched.dateOfBirth && errors.dateOfBirth}
          placeholder={""}
          max={moment().format("YYYY-MM-DD")}
          disabled={inputsDisabled}
        />
        <CustomCountrySelect
          label="Telephone number 1 (Mobile Money Number)"
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          showStar={true}
          value={values.mobileNumber}
          onChange={(value) => setFieldValue("mobileNumber", value)}
          error={touched.mobileNumber && errors.mobileNumber}
          disabled={inputsDisabled}
        />
        <CustomCountrySelect
          label="Telephone number 2 (optional)"
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          value={values.optionalNumber}
          showStar={false}
          onChange={(value) => setFieldValue("optionalNumber", value)}
          disabled={inputsDisabled}
        />
        <CustomSelect
          label="Marital Status"
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          options={[
            { label: "Single", value: "single" },
            { label: "Married", value: "married" },
            { label: "Divorced", value: "divorced" },
            { label: "Widowed", value: "widowed" },
          ]}
          placeholder="Select marital status"
          className="flex-1 mt-0"
          showStar={true}
          value={values.maritalStatus}
          onChange={(value) => setFieldValue("maritalStatus", value)}
          error={touched.maritalStatus && errors.maritalStatus}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="email"
          id="email"
          label="Email"
          inputClassName="bg-divider-100"
          showStar={true}
          value={values.email}
          onChange={handleChange}
          error={touched.email && errors.email}
          disabled={true} // Email always disabled
          placeholder={""}
        />
        <CustomTextInput
          type="text"
          id="userName"
          label="Username"
          inputClassName="bg-divider-100"
          showStar={true}
          value={values.userName}
          onChange={handleChange}
          error={touched.userName && errors.userName}
          disabled={true} // Username always disabled
          placeholder={""}
        />
      </div>

      <div className="flex justify-start max-tablet:justify-between items-center gap-4">
        <button
          type="button"
          className="text-primary px-5 py-3 hidden max-tablet:flex items-center gap-2 duration-500 transition-all"
          onClick={() => window.history.back()}
        >
          Back
        </button>
        
        {!isEditing && !disabled ? (
          <button
            type="button"
            onClick={handleEdit}
            className="border-divider px-5 py-3 flex items-center gap-2 border rounded duration-500 transition-all max-tablet:ml-auto max-tablet:bg-primary max-tablet:text-white max-tablet:rounded-md max-tablet:border-none max-tablet:font-inter"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-gray-600 px-5 py-3 flex items-center gap-2 border border-gray-300 rounded duration-500 transition-all max-tablet:rounded-md max-tablet:font-inter"
              >
                Cancel
              </button>
            )}
            <button
              disabled={disabled || isSubmiting || !isEditing}
              type="submit"
              className="border-divider px-5 py-3 flex items-center gap-2 border rounded duration-500 transition-all max-tablet:ml-auto max-tablet:bg-primary max-tablet:text-white max-tablet:rounded-md max-tablet:border-none max-tablet:font-inter disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes{" "}
              {isSubmiting && (
                <AiOutlineLoading3Quarters
                  size={20}
                  className="animate-spin duration-500 transition-all"
                />
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default BasicInfoSettingsForm;