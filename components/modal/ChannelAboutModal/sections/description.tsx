"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomTextarea from "@/components/input/CustomTextarea";
import { ChannelType } from "@/types/groups";
import { updateChannelDetails } from "@/api/channel";
import { toast } from "sonner";
import { updateGroupDetails } from "@/api/group";
import { useParams } from "next/navigation";

const validationSchema = Yup.object().shape({
  description: Yup.string()
    .max(500, "Description must be at most 500 characters")
    .required("Description is required"),
});

const Description = ({
  setIsLoading,
  channel,
}: {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  channel: ChannelType | undefined;
}) => {
  const { closeModal, modalData, toggleModal } = useSettingModal();

  const isGroupDescription =
    (channel?.privacy === "PUBLIC" && channel?.name === "general") ||
    modalData?.channelAboutModal?.state === "group";
  const groupId = useParams().groupId as string;

  const {
    values,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    touched,
    isValid,
    errors,
  } = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!channel) return;

      setIsLoading(true);
      try {
     

        if (isGroupDescription) {
          await updateGroupDetails({
            groupId: groupId,
            description: values.description,
          });
        } else {
          await updateChannelDetails(channel.id as string, {
            description: values.description,
          });
        }

        // Handle success (optional: show a message, close modal, etc.)
        handleCancel();
      } catch (error) {
        toast.error(JSON.stringify(error));
        console.error("Failed to update channel:", error);
        // Handle error (optional: show an error message)
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCancel = () => {
    const previous = modalData?.channelAboutModal?.previous;
    closeModal("channelAboutModal");
    toggleModal(previous.name, previous.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[24px] font-black text-[#1D1C1D]">
          Edit description
        </h2>
      </div>

      <div className="flex-grow">
        <CustomTextarea
          id="description-input"
          label="Description"
          placeholder="Let everyone know how to use this channel"
          value={values.description}
          onChange={(e) => setFieldValue("description", e.target.value)}
          error={touched?.description && errors.description}
          textareaClassName="w-full bg-gray-50 rounded-lg p-4 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          inputClassName={`p-2`}
        />
        <p className="font-inter text-[14px] mt-1">
          Let people know what this {isGroupDescription ? "group" : "channel"}{" "}
          is for
        </p>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded text-primary bg-white border border-primary hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={!isValid || isSubmitting}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Description;
