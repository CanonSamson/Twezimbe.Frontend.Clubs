"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomTextarea from "@/components/input/CustomTextarea";
import { updateChannelDetails } from "@/api/channel";
import { ChannelType } from "@/types/groups";
import { toast } from "sonner";

const validationSchema = Yup.object().shape({
  topic: Yup.string()
    .max(200, "Topic must be at most 200 characters")
    .required("Topic is required"),
});

const Topic = ({
  setIsLoading,
  channel,
}: {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  channel: ChannelType | undefined;
}) => {
  const { closeModal, modalData, toggleModal } = useSettingModal();

  const {
    values,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
    isSubmitting,
    isValid,
  } = useFormik({
    initialValues: {
      topic: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!channel) return;

      setIsLoading(true);
      try {
        await updateChannelDetails(channel.id as string, {
          topic: values.topic,
        });
        // Handle success (optional: show a message, close modal, etc.)
        handleCancel();
      } catch (error) {
        toast.error(JSON.stringify(error))

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
        <h2 className="text-[24px] font-black text-[#1D1C1D]">Edit topic</h2>
      </div>

      <div className="flex-grow">
        <CustomTextarea
          id="topic-input"
          label="Channel Topic"
          placeholder="general conversations"
          value={values.topic}
          onChange={(e) => setFieldValue("topic", e.target.value)}
          error={touched?.topic && errors.topic}
          textareaClassName="w-full bg-gray-50 rounded-lg p-2 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          inputClassName={`p-2`}
        />
        <p className="font-inter text-[14px] mt-1">
          Let people know what #approved-ux-designs is focused on right now (ex.
          a project milestone).
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

export default Topic;
