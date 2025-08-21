"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextInput from "@/components/input/CustomTextInput";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchSocialsInfo } from "@/lib/features/profile/socialsSlice";
import { useEffect, useState } from "react";
import { updateSocialsInfo } from "@/api/user-profile/socials";
import { hasChanges } from "@/utils/functions/check";
import { toast } from "sonner";
import { useUser } from "@/contexts/user";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const validationSchema = Yup.object({
  linkedin: Yup.string()
    .url("Please enter a valid LinkedIn URL")
    .matches(
      /^https?:\/\/([\w-]+\.)?linkedin\.com/,
      "Please enter a valid LinkedIn URL"
    ),
  facebook: Yup.string()
    .url("Please enter a valid Facebook URL")
    .matches(
      /^https?:\/\/([\w-]+\.)?facebook\.com/,
      "Please enter a valid Facebook URL"
    ),
  x: Yup.string()
    .url("Please enter a valid X/Twitter URL")
    .matches(
      /^https?:\/\/([\w-]+\.)?twitter\.com|x\.com/,
      "Please enter a valid X/Twitter URL"
    ),
  youtube: Yup.string()
    .url("Please enter a valid YouTube URL")
    .matches(
      /^https?:\/\/([\w-]+\.)?youtube\.com/,
      "Please enter a valid YouTube URL"
    ),
  website: Yup.string().url("Please enter a valid website URL"),
  instagram: Yup.string()
    .url("Please enter a valid Instagram URL")
    .matches(
      /^https?:\/\/([\w-]+\.)?instagram\.com/,
      "Please enter a valid Instagram URL"
    ),
});

const SocialsSettingsForm = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const socials = useAppSelector((state) => state.socials.socials);
  const created = useAppSelector((state) => state.socials.created);
  const { fetchCurrentUser } = useUser({});
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      // Check if there are any changes when updating
      if (!created) {
        if (!hasChanges(socials, values)) {
          toast.info("No changes to update");
          return;
        }
      }
      await updateSocialsInfo({
        ...values,
      });
      toast.success("Social Information Updated Successfully");
      fetchCurrentUser({ load: false });
      
      // Exit edit mode after successful submission
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error(JSON.stringify(error));
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form values to original socials data
    if (socials) {
      setValues({
        linkedin: socials?.linkedin || "",
        facebook: socials?.facebook || "",
        twitter: socials?.twitter || "",
        youtube: socials?.youtube || "",
        website: socials?.website || "",
        instagram: socials?.instagram || "",
      });
    }
  };

  const { values, errors, setValues, handleSubmit, handleChange, touched } =
    useFormik({
      initialValues: {
        linkedin: socials?.linkedin || "",
        facebook: socials?.facebook || "",
        twitter: socials?.twitter || "",
        youtube: socials?.youtube || "",
        website: socials?.website || "",
        instagram: socials?.instagram || "",
      },
      validationSchema,
      onSubmit,
    });

  useEffect(() => {
    dispatch(fetchSocialsInfo());
  }, [dispatch]);

  useEffect(() => {
    setValues({
      linkedin: socials?.linkedin || "",
      facebook: socials?.facebook || "",
      twitter: socials?.twitter || "",
      youtube: socials?.youtube || "",
      website: socials?.website || "",
      instagram: socials?.instagram || "",
    });
  }, [socials]);

  // Determine if inputs should be disabled
  const inputsDisabled = disabled || !isEditing;

  return (
    <form onSubmit={handleSubmit} className="mt-7  max-tablet:mt-0">
      <div className="grid grid-cols-2 max-tablet:grid-cols-1 pb-10 items-start justify-start gap-5">
        <CustomTextInput
          type="text"
          id="linkedin"
          value={values.linkedin}
          label="LinkedIn Profile URL"
          placeholder="LinkedIn Profile URL"
          className="max-tablet:w-full"
          inputClassName="bg-divider-100 max-tablet:w-full"
          onChange={handleChange}
          error={touched.linkedin && errors.linkedin}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="facebook"
          value={values.facebook}
          label="Facebook Profile URL"
          placeholder="Facebook Profile URL"
          className="max-tablet:w-full"
          inputClassName="bg-divider-100 max-tablet:w-full"
          onChange={handleChange}
          error={touched.facebook && errors.facebook}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="twitter"
          value={values.twitter}
          error={touched.twitter && errors.twitter}
          label="X (formerly Twitter)"
          placeholder="X (formerly Twitter)"
          className="max-tablet:w-full"
          inputClassName="bg-divider-100 max-tablet:w-full"
          onChange={handleChange}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="youtube"
          value={values.youtube}
          label="YouTube Channel URL"
          placeholder="YouTube Channel URL"
          className="max-tablet:w-full"
          inputClassName="bg-divider-100 max-tablet:w-full"
          onChange={handleChange}
          error={touched.youtube && errors.youtube}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="website"
          value={values.website}
          label="Website"
          placeholder="Website"
          className="max-tablet:w-full"
          inputClassName="bg-divider-100 max-tablet:w-full"
          onChange={handleChange}
          error={touched.website && errors.website}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="instagram"
          value={values.instagram}
          label="Instagram Handle"
          placeholder="Instagram Handle"
          className="max-tablet:w-full"
          inputClassName="bg-divider-100 max-tablet:w-full"
          onChange={handleChange}
          error={touched.instagram && errors.instagram}
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

export default SocialsSettingsForm;