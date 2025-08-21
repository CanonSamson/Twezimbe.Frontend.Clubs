"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import CustomSelect from "@/components/input/CustomSelect";
import CustomTextInput from "@/components/input/CustomTextInput";
import qualifications from "@/utils/data/qualifications";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { changedData, hasChanges } from "@/utils/functions/check";
import {
  createEducationInfo,
  updateEducationInfo,
} from "@/api/user-ekyc/education";
import {
  fetchEducation,
  setEducation,
} from "@/lib/features/kyc/educationSlice";
import {
  createEmploymentInfo,
  updateEmploymentInfo,
} from "@/api/user-ekyc/employment";
import {
  fetchEmployment,
  setEmployment,
} from "@/lib/features/kyc/employmentSlice";
import { EducationInfoType } from "@/types/user-ekyc/education";
import { EmploymentInfoType } from "@/types/user-ekyc/employment";
import { useUser } from "@/contexts/user";
import { useSettingModal } from "@/contexts/modal-setting";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";

const validationSchema = Yup.object({
  highestEducationLevel: Yup.string().required("Required"),
  institution: Yup.string(),
  yearAttended: Yup.string()
    .matches(
      /^\d{4}-\d{4}$/,
      "Year format should be YYYY-YYYY (e.g., 2020-2024)"
    )
    .test(
      "year-range",
      "End year must be greater than start year",
      function (value) {
        if (!value) return true;
        const years = value.split("-");
        if (years.length === 2) {
          const startYear = parseInt(years[0]);
          const endYear = parseInt(years[1]);
          return endYear > startYear;
        }
        return true;
      }
    ),
  certifications: Yup.string(),
  employmentStatus: Yup.string().required("Required"),
  occupation: Yup.string().required("Required"),
  jobTitle: Yup.string(),
  employerName: Yup.string(),
  currentWorkAddress: Yup.string(),
  currentSalary: Yup.string().required("Required"),
  sideHustleIncome: Yup.string(),
});

const EducationEmploymentSettingsForm = ({
  disabled = false,
}: {
  loading?: boolean;
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const {
    education: { education, created: educationCreated },
    employment: { employment, created: employmentCreated },
  } = useAppSelector((state) => state);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toggleModal } = useSettingModal();
  const { fetchCurrentUser, currentUser } = useUser({});

  const handleEducation = async (educationValues: EducationInfoType) => {
    try {
      const response = !educationCreated
        ? await createEducationInfo({ ...educationValues })
        : await updateEducationInfo(
            changedData({ ...education }, educationValues)
          );

      if (response?.data?.success) {
        dispatch(setEducation(response.data.data));
        return response?.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmployment = async (employmentValues: EmploymentInfoType) => {
    try {
      const response = !employmentCreated
        ? await createEmploymentInfo({ ...values })
        : await updateEmploymentInfo(
            changedData({ ...employment }, employmentValues)
          );

      if (response?.data?.success) {
        dispatch(setEmployment(response.data.data));
        fetchCurrentUser({ load: false });
        return response?.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      const educationValues = {
        highestEducationLevel: values.highestEducationLevel,
        institution: values.institution,
        yearAttended: values.yearAttended,
        certifications: values.certifications,
      };
      const employmentValues = {
        employmentStatus: values.employmentStatus,
        occupation: values.occupation,
        jobTitle: values.jobTitle,
        employerName: values.employerName,
        currentWorkAddress: values.currentWorkAddress,
        currentSalary: values.currentSalary,
        sideHustleIncome: values.sideHustleIncome,
      };

      const educationChanged = hasChanges(education, educationValues);
      const employmentChanged = hasChanges(employment, employmentValues);

      if (!educationChanged && !employmentChanged) {
        toast.info("No changes to update");
        return;
      }

      const [ed, em] = await Promise.all([
        handleEducation({
          ...educationValues,
          highestEducationLevel: values.highestEducationLevel || "",
          institution: values.institution || "",
          yearAttended: values.yearAttended || "",
          certifications: values.certifications || "",
        }),
        handleEmployment({
          ...employmentValues,
          jobTitle: values.jobTitle || "",
          employerName: values.employerName || "",
          currentWorkAddress: values.currentWorkAddress || "",
          currentSalary: values.currentSalary || "",
          sideHustleIncome: values.sideHustleIncome || "",
        }),
      ]);

      if (ed || em) {
        if (ed?.completed || em?.completed) {
          toggleModal("detailsUpdatedModal", { completed: true });
        } else {
          if (currentUser?.isKyc) {
            toggleModal("detailsUpdatedModal", {
              update: true,
              description:
                "Education and Employment Information Updated Successfully",
              title: "Great",
            });
          } else {
            toggleModal("detailsUpdatedModal", {
              nextRoute: "/settings/kyc/next-of-kin",
              description:
                "Education and Employment Information Updated Successfully",
              title: "Great",
            });
          }
        }
        fetchCurrentUser({ load: false });
        
        // Exit edit mode after successful submission
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form values to original data
    setValues({
      ...values,
      highestEducationLevel: education?.highestEducationLevel || "",
      institution: education?.institution || "",
      yearAttended: education?.yearAttended || "",
      certifications: education?.certifications || "",
      employmentStatus: employment?.employmentStatus || "",
      occupation: employment?.occupation || "",
      jobTitle: employment.jobTitle || "",
      employerName: employment.employerName || "",
      currentWorkAddress: employment.currentWorkAddress || "",
      currentSalary: employment.currentSalary || "",
      sideHustleIncome: employment.sideHustleIncome || "",
    });
  };

  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      highestEducationLevel: "",
      institution: "",
      yearAttended: "",
      certifications: "",
      employmentStatus: "",
      occupation: "",
      jobTitle: "",
      employerName: "",
      currentWorkAddress: "",
      currentSalary: "",
      sideHustleIncome: "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    dispatch(fetchEducation());
    dispatch(fetchEmployment());
  }, [dispatch]);

  useEffect(() => {
    setValues({
      ...values,
      highestEducationLevel: education?.highestEducationLevel || "",
      institution: education?.institution || "",
      yearAttended: education?.yearAttended || "",
      certifications: education?.certifications || "",
    });
  }, [education]);

  useEffect(() => {
    setValues({
      ...values,
      employmentStatus: employment?.employmentStatus || "",
      occupation: employment?.occupation || "",
      jobTitle: employment.jobTitle || "",
      employerName: employment.employerName || "",
      currentWorkAddress: employment.currentWorkAddress || "",
      currentSalary: employment.currentSalary || "",
      sideHustleIncome: employment.sideHustleIncome || "",
    });
  }, [employment]);

  // Determine if inputs should be disabled
  const inputsDisabled = disabled || !isEditing;

  return (
    <form onSubmit={handleSubmit} className="mt-7 ">
      <div className="grid max-tablet:grid-cols-1 tablet:grid-cols-2 pb-10 items-start justify-start  max-tablet:gap-6 gap-5">
        <CustomSelect
          label="Highest Qualification"
          options={qualifications}
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          placeholder="Select highest qualification"
          value={values.highestEducationLevel}
          onChange={(value) => {
            setFieldValue("highestEducationLevel", value);
          }}
          error={touched.highestEducationLevel && errors.highestEducationLevel}
          showStar={true}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="institution"
          label="Name of Institution Attended"
          inputClassName="bg-divider-100"
          placeholder="Enter name of institution"
          value={values.institution}
          onChange={handleChange}
          error={touched.institution && errors.institution}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="yearAttended"
          label="Year Attended"
          inputClassName="bg-divider-100"
          placeholder="e.g 2019-2024"
          value={values.yearAttended}
          onChange={handleChange}
          error={touched.yearAttended && errors.yearAttended}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="certifications"
          label="Other Certifications (optional)"
          inputClassName="bg-divider-100"
          placeholder="e.g Cert. in Healthcare Management, Institute of Health"
          value={values.certifications}
          onChange={handleChange}
          error={touched.certifications && errors.certifications}
          disabled={inputsDisabled}
        />

        <CustomSelect
          label="Employment Status"
          options={[
            { value: "employed", label: "Employed" },
            { value: "self-employed", label: "Self-Employed" },
            { value: "unemployed", label: "Unemployed" },
            { value: "student", label: "Student" },
            { value: "retired", label: "Retired" },
          ]}
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          placeholder="Select employment status"
          value={values.employmentStatus}
          error={touched.employmentStatus && errors.employmentStatus}
          onChange={(value) => {
            setFieldValue("employmentStatus", value);
          }}
          showStar={true}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="occupation"
          label="Occupation"
          inputClassName="bg-divider-100"
          placeholder="e.g doctor"
          value={values.occupation}
          onChange={handleChange}
          error={touched.occupation && errors.occupation}
          showStar={true}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="employerName"
          label="Employer Name"
          inputClassName="bg-divider-100"
          placeholder="Enter employer name"
          value={values.employerName}
          onChange={handleChange}
          error={touched.employerName && errors.employerName}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="jobTitle"
          label="Job Title"
          inputClassName="bg-divider-100"
          placeholder="Enter job title"
          value={values.jobTitle}
          onChange={handleChange}
          error={touched.jobTitle && errors.jobTitle}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="currentWorkAddress"
          label="Current Work Address"
          inputClassName="bg-divider-100"
          placeholder="e.g no. 23 Ali express"
          value={values.currentWorkAddress}
          onChange={handleChange}
          error={touched.currentWorkAddress && errors.currentWorkAddress}
          disabled={inputsDisabled}
        />

        <CustomSelect
          label="Monthly Income"
          options={[
            { value: "below-500", label: "Below $500" },
            { value: "500-1000", label: "$500 - $1000" },
            { value: "1000-2500", label: "$1000 - $2500" },
            { value: "2500-5000", label: "$2500 - $5000" },
            { value: "above-5000", label: "Above $5000" },
          ]}
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          placeholder="Select monthly income"
          value={values.currentSalary}
          onChange={(value) => {
            setFieldValue("currentSalary", value);
          }}
          error={touched.currentSalary && errors.currentSalary}
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

export default EducationEmploymentSettingsForm;