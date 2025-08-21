"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import CustomCountrySelect from "@/components/input/CustomCountrySelect";
import CustomSelect from "@/components/input/CustomSelect";
import CustomTextInput from "@/components/input/CustomTextInput";
import { updateNextOfKinInfo } from "@/api/ekyc";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchNextOfKin,
  setNextOfKin,
} from "@/lib/features/kyc/nextOfKinSlice";
import { changedData, hasChanges } from "@/utils/functions/check";
import { useUser } from "@/contexts/user";
import { useSettingModal } from "@/contexts/modal-setting";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  phone1: Yup.string().required("Mobile Money Number is required"),
  phone2: Yup.string(),
  email1: Yup.string().email("Invalid email").required("Email 1 is required"),
  email2: Yup.string().email("Invalid email"),
  address: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  relationship: Yup.string().required("Relationship is required"),
});

const NextOfKinSettingsForm = ({
  disabled = false,
}: {
  loading?: boolean;
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { nextOfKin, created } = useAppSelector((state) => state.nextOfKin);
  const { toggleModal } = useSettingModal();
  const { fetchCurrentUser } = useUser({});
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useUser({});

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      // Check if there are any changes when updating
      if (!created) {
        if (!hasChanges(nextOfKin, values)) {
          toast.info("No changes to update");
          return;
        }
      }

      const response = await updateNextOfKinInfo(
        changedData(nextOfKin, values)
      );

      if (response?.data?.success) {
        dispatch(setNextOfKin(response.data.data));

        let modalData: any = {
          description: "Next Of Kin Information has been Updated Successfully",
          title: "Great",
        };
        if (response?.data.completed) {       
          toggleModal("detailsUpdatedModal", { completed: true });
        } else if (!currentUser?.isKyc) {
          modalData = {
            ...modalData,
            nextRoute: "/settings/kyc/documents",
          };
          toggleModal("detailsUpdatedModal", modalData);
        } else {
          toggleModal("detailsUpdatedModal", modalData);
        }

        fetchCurrentUser({ load: false });
        
        // Exit edit mode after successful submission
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form values to original nextOfKin data
    if (nextOfKin) {
      setValues(nextOfKin);
    }
  };

  const {
    values,
    handleChange,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: {
      fullName: "",
      phone1: "",
      phone2: "",
      email1: "",
      email2: "",
      address: "",
      gender: "",
      relationship: "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    dispatch(fetchNextOfKin());
  }, [dispatch]);

  useEffect(() => {
    setValues(nextOfKin);
  }, [nextOfKin]);

  // Determine if inputs should be disabled
  const inputsDisabled = disabled || !isEditing;

  return (
    <form onSubmit={handleSubmit} className="mt-7 ">
      <div className="grid max-tablet:grid-cols-1 tablet:grid-cols-2 pb-10 items-start justify-start  max-tablet:gap-6 gap-5">
        <CustomTextInput
          type="text"
          id="fullName"
          value={values.fullName}
          onChange={handleChange}
          error={touched?.fullName && errors.fullName}
          label="Full Name"
          placeholder="Enter your full Name"
          className="mt-4"
          inputClassName="bg-divider-100"
          showStar={true}
          disabled={inputsDisabled}
        />

        <CustomCountrySelect
          id="phone1"
          value={values.phone1}
          onChange={(value) => {
            setFieldValue("phone1", value);
          }}
          error={touched?.phone1 && errors.phone1}
          label="Telephone number 1 (Mobile Money Number)"
          className="mt-4"
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          showStar={true}
          disabled={inputsDisabled}
        />
        <CustomCountrySelect
          id="phone2"
          value={values.phone2}
          onChange={(value) => {
            setFieldValue("phone2", value);
          }}
          error={touched?.phone2 && errors.phone2}
          label="Telephone 2"
          className="mt-4"
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          showStar={true}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="email"
          id="email1"
          value={values.email1}
          onChange={handleChange}
          error={touched?.email1 && errors.email1}
          label="Email 1"
          placeholder="example@gmail.com"
          className="mt-4"
          inputClassName="bg-divider-100"
          showStar={true}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="email"
          id="email2"
          value={values.email2}
          onChange={handleChange}
          error={touched?.email2 && errors.email2}
          label="Email 2"
          placeholder="example@gmail.com"
          className="mt-4"
          inputClassName="bg-divider-100"
          showStar={false}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="address"
          value={values.address}
          onChange={handleChange}
          error={touched?.address && errors.address}
          label="Address"
          placeholder="e.g no. 23 Ali express"
          className="mt-4"
          inputClassName="bg-divider-100"
          showStar={false}
          disabled={inputsDisabled}
        />
        <CustomSelect
          label="Gender"
          value={values.gender}
          onChange={(value) => {
            setFieldValue("gender", value);
          }}
          error={touched?.gender && errors.gender}
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
          placeholder="Select gender"
          className="flex-1 mt-0"
          showStar={true}
          disabled={inputsDisabled}
        />
        <CustomSelect
          label="Relationship"
          value={values.relationship}
          onChange={(value) => {
            setFieldValue("relationship", value);
          }}
          error={touched?.relationship && errors.relationship}
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          options={[
            { label: "Son", value: "son" },
            { label: "Daughter", value: "daughter" },
            { label: "Spouse", value: "spouse" },
            { label: "Father", value: "father" },
            { label: "Mother", value: "mother" },
            { label: "Brother", value: "brother" },
            { label: "Sister", value: "sister" },
          ]}
          placeholder="Select relationship"
          className="flex-1 mt-0"
          showStar={true}
          disabled={inputsDisabled}
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

export default NextOfKinSettingsForm;