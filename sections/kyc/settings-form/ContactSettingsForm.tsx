"use client";

import { createContactInfo, updateContactInfo } from "@/api/user-ekyc/contact";
import CustomSelect from "@/components/input/CustomSelect";
import CustomTextInput from "@/components/input/CustomTextInput";
import { useSettingModal } from "@/contexts/modal-setting";
import { useUser } from "@/contexts/user";
import { fetchContact, setContact } from "@/lib/features/kyc/contactSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import countries from "@/utils/data/countries";
import nationalities from "@/utils/data/nationalities";
import { changedData, hasChanges } from "@/utils/functions/check";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";

const ContactSettingsForm = ({
  disabled = false,
}: {
  loading?: boolean;
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { contact, created } = useAppSelector((state) => state.contact);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toggleModal } = useSettingModal();
  const { fetchCurrentUser, currentUser } = useUser({});

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      // Check if there are any changes when updating
      if (!created) {
        if (!hasChanges(contact, values)) {
          toast.info("No changes to update");
          return;
        }
      }

      const response = !created
        ? await createContactInfo(values)
        : await updateContactInfo(changedData(contact, values));

      if (response?.data?.success) {
        dispatch(setContact(response.data.data));

        let modalData: any = {
          description: "Contact Information has been Updated Successfully",
          title: "Great",
        };
        if (response?.data.completed) {
          modalData = {
            ...modalData,
            conpleted: true,
          };
        } else if (!currentUser?.isKyc) {
          modalData = {
            ...modalData,
            nextRoute: "/settings/kyc/education-employment",
          };
        }
        if (!!response?.data.completed) {
          toggleModal("detailsUpdatedModal", { completed: true });
        } else {
          toggleModal("detailsUpdatedModal", modalData);
        }
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
    // Reset form values to original contact data
    if (contact) {
      setValues({
        nationality: contact.nationality || "",
        countryOfResidence: contact.countryOfResidence || "",
        stateProvinceRegion: contact.stateProvinceRegion || "",
        city: contact.city || "",
        landmark: contact.landmark || "",
        zipPostalCode: contact.zipPostalCode || "",
        addressLine1: contact.addressLine1 || "",
        addressLine2: contact.addressLine2 || "",
      });
    }
  };

  const {
    touched,
    values,
    errors,
    handleChange,
    setFieldValue,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: {
      nationality: "ugandan",
      countryOfResidence: "uganda",
      stateProvinceRegion: "",
      city: "",
      landmark: "",
      zipPostalCode: "",
      addressLine1: "",
      addressLine2: "",
    },
    validationSchema: Yup.object({
      nationality: Yup.string().required("Nationality is required"),
      countryOfResidence: Yup.string().required(
        "Country of residence is required"
      ),
      stateProvinceRegion: Yup.string().required(
        "State/Province/Region is required"
      ),
      city: Yup.string().required("City is required"),
      zipPostalCode: Yup.string().required("ZIP/Postal Code is required"),
      addressLine1: Yup.string().required("Address Line 1 is required"),
      addressLine2: Yup.string(),
    }),
    onSubmit,
  });

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  useEffect(() => {
    if (contact) {
      setValues({
        nationality: contact.nationality || "",
        countryOfResidence: contact.countryOfResidence || "",
        stateProvinceRegion: contact.stateProvinceRegion || "",
        city: contact.city || "",
        landmark: contact.landmark || "",
        zipPostalCode: contact.zipPostalCode || "",
        addressLine1: contact.addressLine1 || "",
        addressLine2: contact.addressLine2 || "",
      });
    }
  }, [contact]);

  // Determine if inputs should be disabled
  const inputsDisabled = disabled || !isEditing;

  return (
    <form onSubmit={handleSubmit} className="mt-7 w-full 0">
      <div className="grid max-tablet:grid-cols-1 tablet:grid-cols-2 pb-10 items-start justify-start  max-tablet:gap-6 gap-5">
        <CustomSelect
          label="Nationality"
          options={nationalities}
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          placeholder="Select nationality"
          className="flex-1 mt-0"
          showStar={true}
          value={values.nationality}
          error={touched.nationality && errors.nationality}
          onChange={(value) => setFieldValue("nationality", value)}
          disabled={inputsDisabled}
        />

        <CustomSelect
          label="Country of Residence"
          options={[...countries]}
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
          placeholder="Select residence"
          className="flex-1 mt-0"
          showStar={true}
          value={values.countryOfResidence}
          error={touched.countryOfResidence && errors.countryOfResidence}
          onChange={(value) => setFieldValue("countryOfResidence", value)}
          isSearchable={false}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="stateProvinceRegion"
          value={values.stateProvinceRegion}
          error={touched.stateProvinceRegion && errors.stateProvinceRegion}
          label="State/Province/Region"
          inputClassName="bg-divider-100"
          placeholder="State province or region"
          onChange={handleChange}
          showStar={true}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="city"
          value={values.city}
          error={touched.city && errors.city}
          label="City"
          inputClassName="bg-divider-100"
          placeholder="Enter city"
          onChange={handleChange}
          showStar={true}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="landmark"
          value={values.landmark}
          error={touched.landmark && errors.landmark}
          label="Landmark"
          inputClassName="bg-divider-100"
          placeholder="Landmark"
          onChange={handleChange}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="zipPostalCode"
          value={values.zipPostalCode}
          error={touched.zipPostalCode && errors.zipPostalCode}
          label="ZIP/Postal Code"
          inputClassName="bg-divider-100"
          placeholder="ZIP/Postal Code"
          onChange={handleChange}
          showStar={true}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="addressLine1"
          value={values.addressLine1}
          error={touched.addressLine1 && errors.addressLine1}
          label="Address Line 1"
          inputClassName="bg-divider-100"
          placeholder="Address Line 1 *"
          onChange={handleChange}
          showStar={true}
          disabled={inputsDisabled}
        />

        <CustomTextInput
          type="text"
          id="addressLine2"
          value={values.addressLine2}
          error={touched.addressLine2 && errors.addressLine2}
          label="Address Line 2 (Optional)"
          inputClassName="bg-divider-100"
          placeholder="Address Line 2 (Optional)"
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
  );
};

export default ContactSettingsForm;