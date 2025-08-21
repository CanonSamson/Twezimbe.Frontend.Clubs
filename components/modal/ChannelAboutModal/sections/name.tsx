"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSettingModal } from "@/contexts/modal-setting";
import { updateChannelDetails } from "@/api/channel";
import { useParams } from "next/navigation";
import CustomTextInput from "@/components/input/CustomTextInput";
import { ChannelType } from "@/types/groups";
import { toast } from "sonner";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, "Name must be at most 50 characters")
    .required("Channel name is required"),
});

const Name = ({
  isLoading,
  setIsLoading,
  channel,
}: {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  channel: ChannelType | undefined;
}) => {
  const { closeModal, modalData, toggleModal } = useSettingModal();
  const { channelId } = useParams();

  const {
    values,
    handleChange,
    handleSubmit,
    setValues,
    isSubmitting,
    isValid,

  } = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!channelId) return;

      setIsLoading(true);
      try {
        await updateChannelDetails(channelId as string, {
          name: values.name.trim().toLowerCase().replace(/\s+/g, "-"),
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

  useEffect(() => {
    if (channel?.name) {
      setValues({
        name: channel?.name,
      });
    }
  }, [channel?.name]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[24px] font-black text-[#1D1C1D]">Edit name</h2>
      </div>

      <div className="flex-grow">
        <CustomTextInput
          type="text"
          id="name"
          onChange={handleChange}
          value={values.name}
          LeftIcon={
            <div>
              <span className=" text-xl font-bold">#</span>
            </div>
          }
          placeholder="new-channel"
          className="py-4  text-[#444444]  font-bold"
          inputClassName=" items-center pl-4 border-2 border-[#9B9B9B] rounded-none "
        />

        <p className="font-inter text-[14px] mt-1">
          Give this channel a descriptive name
        </p>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting || isLoading}
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

export default Name;
