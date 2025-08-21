"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import CustomSelect from "@/components/input/CustomSelect";
import CustomTextInput from "@/components/input/CustomTextInput";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { changedData, hasChanges } from "@/utils/functions/check";
import { updateDocumentInfo } from "@/api/user-ekyc/document";
import { fetchDocument } from "@/lib/features/kyc/documentSlice";
import { UserContextType, UserContext, useUser } from "@/contexts/user";
import { useSettingModal } from "@/contexts/modal-setting";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { uploadFiles } from "@/api/file-upload";
import { useContextSelector } from "use-context-selector";

const validationSchema = Yup.object({
  documentType: Yup.string()
    .required("Document type is required")
    .oneOf(
      ["national_id", "passport", "drivers_license", "voters_card"],
      "Please select a valid document type"
    ),
  IdNumber: Yup.string()
    .required("ID number is required")
    .min(5, "ID number must be at least 5 characters")
    .max(20, "ID number must not exceed 20 characters"),
  frontImage: Yup.string().required("Front image of document is required"),
  backImage: Yup.string().when("documentType", {
    is: (val: string) => val !== "passport", // Passports typically don't have a back side with important info
    then: (schema) => schema.required("Back image of document is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});

const DocumentsSettingsForm = ({
  disabled = false,
}: {
  loading?: boolean;
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const document = useAppSelector((state) => state.document.document);
  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  );

  const { fetchCurrentUser } = useUser({});

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const { toggleModal } = useSettingModal();

  const uploadFile = async (image: File) => {
    try {
      const response = await uploadFiles([image]);
      if (!response?.data?.success) {
        throw new Error("Failed to upload image");
      }
      return response.data.files[0].url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);

      if (!hasChanges(document, values)) {
        toast.info("No changes to update");
        return;
      }
      const response = await updateDocumentInfo(changedData(document, values));

      if (response?.data?.success) {
        let modalData: any = {
          description: "Document Information has been Updated Successfully",
          title: "Great",
        };

        if (response?.data.completed) {
          toggleModal("detailsUpdatedModal", { completed: true });
        } else if (!currentUser?.isKyc) {
          modalData = {
            ...modalData,
            nextRoute: "/settings/kyc/declaration",
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
    // Reset form values to original document data
    if (document) {
      setValues({
        IdNumber: document?.IdNumber,
        documentType: document?.documentType,
        frontImage: document?.frontImage || "",
        backImage: document?.backImage || "",
      });
    }
  };

  const {
    setValues,
    handleSubmit,
    values,
    handleChange,
    touched,
    errors,
    setFieldValue,
  } = useFormik({
    initialValues: {
      IdNumber: "",
      documentType: "",
      frontImage: "",
      backImage: "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    dispatch(fetchDocument());
  }, [dispatch]);

  useEffect(() => {
    setValues({
      IdNumber: document?.IdNumber,
      documentType: document?.documentType,
      frontImage: document?.frontImage || "",
      backImage: document?.backImage || "",
    });
  }, [document]);

  // Check if back image is required for the selected document type
  const isBackImageRequired =
    values.documentType && values.documentType !== "passport";

  // Determine if inputs should be disabled
  const inputsDisabled = disabled || !isEditing;

  return (
    <form onSubmit={handleSubmit} className="mt-7 w-full">
      <div className="grid grid-cols-1 w-full tablet:max-w-[50%] mx-auto tablet:mx-0 pb-10 items-end gap-5 max-tablet:px-4">
        <CustomSelect
          label="Document Type"
          selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px] w-full"
          options={[
            { label: "National ID", value: "national_id" },
            { label: "Passport", value: "passport" },
            { label: "Driver's License", value: "drivers_license" },
            { label: "Voter's Card", value: "voters_card" },
          ]}
          placeholder="Select Document Type"
          className="flex-1 mt-0"
          showStar={true}
          value={values.documentType}
          onChange={(value) => {
            setFieldValue("documentType", value);
            // Clear back image if switching to passport
            if (value === "passport") {
              setFieldValue("backImage", "");
            }
          }}
          error={touched?.documentType && errors.documentType}
          disabled={inputsDisabled}
        />
        <CustomTextInput
          type="text"
          id="IdNumber"
          label="ID Number"
          placeholder="Enter your ID Number"
          className="mt-4 w-full"
          inputClassName="bg-divider-100 w-full"
          showStar={true}
          value={values.IdNumber}
          onChange={handleChange}
          error={touched?.IdNumber && errors.IdNumber}
          disabled={inputsDisabled}
        />
      </div>

      <div className="pb-4 w-full max-tablet:px-4 space-y-6">
        {/* Front Image Upload */}
        <div>
          <h3 className="text-[16px] font-medium mb-3 flex items-center gap-1">
            Upload Front Side
            <span className="text-red-500">*</span>
          </h3>
          <div className="flex items-center gap-4 w-full">
            <CustomAvatar
              image={values.frontImage}
              className="justify-start  p-1 rounded-none"
              labelClassName="h-[80px] w-[120px] rounded-none border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
              alt="document front"
              showText={false}
              imageClassName="rounded-none"
              disabled={inputsDisabled}
              onFileChange={async (file) => {
                if (file && isEditing) {
                  setUploadingFront(true);
                  toast.promise(uploadFile(file), {
                    loading: "Uploading front image...",
                    success: (response) => {
                      setFieldValue("frontImage", response);
                      setUploadingFront(false);
                      return "Front image uploaded successfully";
                    },
                    error: (error) => {
                      setUploadingFront(false);
                      return "Failed to upload front image";
                    },
                  });
                }
              }}
            />
            <div className="flex-1">
              <span className="flex text-[16px] text-gray-700">
                {uploadingFront
                  ? "Uploading..."
                  : inputsDisabled
                  ? "Front side of document"
                  : "Click to upload front side of your document"}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {inputsDisabled
                  ? "Document front side image"
                  : "Ensure the document is clear and all text is readable"}
              </p>
              {touched?.frontImage && errors.frontImage && (
                <p className="text-red-500 text-sm mt-1">{errors.frontImage}</p>
              )}
            </div>
          </div>
        </div>

        {/* Back Image Upload - Only show if required */}
        {isBackImageRequired && (
          <div>
            <h3 className="text-[16px] font-medium mb-3 flex items-center gap-1">
              Upload Back Side
              <span className="text-red-500">*</span>
            </h3>
            <div className="flex items-center gap-4 w-full">
              <CustomAvatar
                image={values.backImage}
                className="justify-start  p-1 rounded-none"
                labelClassName="h-[80px] w-[120px] rounded-none border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
                alt="document back"
                imageClassName="rounded-none"
                showText={false}
                disabled={inputsDisabled}
                onFileChange={async (file) => {
                  if (file && isEditing) {
                    setUploadingBack(true);
                    toast.promise(uploadFile(file), {
                      loading: "Uploading back image...",
                      success: (response) => {
                        setFieldValue("backImage", response);
                        setUploadingBack(false);
                        return "Back image uploaded successfully";
                      },
                      error: (error) => {
                        setUploadingBack(false);
                        return "Failed to upload back image";
                      },
                    });
                  }
                }}
              />
              <div className="flex-1">
                <span className="flex text-[16px] text-gray-700">
                  {uploadingBack
                    ? "Uploading..."
                    : inputsDisabled
                    ? "Back side of document"
                    : "Click to upload back side of your document"}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {inputsDisabled
                    ? "Document back side image"
                    : "Upload the back side containing additional information"}
                </p>
                {touched?.backImage && errors.backImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.backImage}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Passport Note */}
        {values.documentType === "passport" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Note:</span> For passports, only the
              front page with your photo and details is required.
            </p>
          </div>
        )}
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
              disabled={
                disabled ||
                isSubmiting ||
                uploadingFront ||
                uploadingBack ||
                !isEditing
              }
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

export default DocumentsSettingsForm;
