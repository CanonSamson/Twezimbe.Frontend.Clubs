"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextInput from "@/components/input/CustomTextInput";
import CustomTextarea from "@/components/input/CustomTextarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { updatePublicProfileInfo } from "@/api/profile/public-profile";
import { changedData, hasChanges } from "@/utils/functions/check";
import { toast } from "sonner";
import { useUser } from "@/contexts/user";
import {
  fetchPublicProfileInfo,
  setPublicProfileInfo,
} from "@/lib/features/profile/publicProfileInfoSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const validationSchema = Yup.object({
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  firstName: Yup.string()
    .required("First name is required")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  userName: Yup.string().required("User name is required"),
  bio: Yup.string(),
});

const PublicProfileSettingsForm = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { publicProfileInfo, created } = useAppSelector(
    (state) => state.publicProfileInfo
  );
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { fetchCurrentUser } = useUser({});

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      const prevData = {
        firstName: publicProfileInfo?.firstName,
        lastName: publicProfileInfo?.lastName,
        userName: publicProfileInfo?.userName,
        bio: publicProfileInfo?.bio,
      };
      // Check if there are any changes when updating
      if (!created) {
        if (!hasChanges(prevData, values)) {
          toast.info("No changes to update");
          return;
        }
      }

      const response = await updatePublicProfileInfo(
        changedData(prevData, { ...values })
      );
      
      if (response.data.success) {
        dispatch(setPublicProfileInfo(response.data.data));
        toast.success("Public Profile Information Updated Successfully");
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
    // Reset form values to original data
    if (publicProfileInfo) {
      setValues({
        lastName: publicProfileInfo.lastName || "",
        firstName: publicProfileInfo.firstName || "",
        userName: publicProfileInfo.userName || "",
        bio: publicProfileInfo.bio || "",
      });
    }
  };

  const { values, errors, setValues, handleSubmit, handleChange, touched } =
    useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        userName: "",
        bio: "",
      },
      validationSchema,
      onSubmit,
    });

  useEffect(() => {
    dispatch(fetchPublicProfileInfo());
  }, [dispatch]);

  useEffect(() => {
    setValues({
      ...values,
      lastName: publicProfileInfo.lastName || "",
      firstName: publicProfileInfo.firstName || "",
      userName: publicProfileInfo.userName || "",
      bio: publicProfileInfo.bio || "",
    });

    // Set edit mode based on whether profile has been created
    if (!created) {
      setIsEditing(true); // New profiles start in edit mode
    }
  }, [publicProfileInfo, created]);

  // Determine if inputs should be disabled
  const inputsDisabled = disabled || !isEditing;

  return (
    <div className="mt-7 max-tablet:mt-0">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 tablet-lg:grid-cols-2 pb-10 items-start justify-start gap-5">
          <CustomTextInput
            type="text"
            id="firstName"
            label="First Name"
            placeholder="Enter your first name"
            className="max-tablet:w-full"
            inputClassName="max-tablet:w-full bg-divider-100"
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
            className="max-tablet:w-full"
            inputClassName="max-tablet:w-full bg-divider-100"
            showStar={true}
            value={values.lastName}
            onChange={handleChange}
            error={touched.lastName && errors.lastName}
            disabled={inputsDisabled}
          />

          <CustomTextInput
            type="text"
            id="userName"
            label="Username"
            className="max-tablet:w-full"
            inputClassName="max-tablet:w-full bg-divider-100"
            showStar={true}
            value={values.userName}
            onChange={handleChange}
            error={touched.userName && errors.userName}
            placeholder=""
            disabled={true} // Username always disabled
          />
          <CustomTextarea
            id="bio"
            label="About me"
            placeholder="Write something brief about yourself"
            className="w-full max-tablet:w-full"
            textareaClassName="p-4 pt-2 h-32 text-lg align-top max-tablet:w-full bg-divider-100"
            value={values.bio}
            onChange={handleChange}
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
    </div>
  );
};

export default PublicProfileSettingsForm;