"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { FaPen, FaCamera } from "react-icons/fa6";
import CustomTextarea from "@/components/input/CustomTextarea";
import { NewInputGroupType } from "@/types/groups";
import Image from "next/image";

const MoreGroupDetails: React.FC<{
  setValues: (key: string, value: string | string[] | File) => void;
  create: () => void;
  back: () => void;
  handleToggleModal: () => void;
  values: NewInputGroupType;
  isLoading: boolean;
}> = ({ setValues, create, back, handleToggleModal, values, isLoading }) => {
  const [icon, setIcon] = useState<File | string>("");
  const [coverImage, setCoverImage] = useState<File | string>("");

  const { modals } = useSettingModal();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    isCover: boolean
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      if (isCover) {
        setCoverImage(previewUrl);
        setValues("coverImage", file);
      } else {
        setIcon(previewUrl);
        setValues("iconImage", file);
      }
    }
  };

  const handleCreate = async () => {
    if (values.description.trim()) {
      create();
    } else {
      toast.error(
        "Description cannot be empty. Please enter a valid description."
      );
    }
  };

  useEffect(() => {
    if (!modals.newGroupModal) {
      setCoverImage("");
      setIcon("");
    }
  }, [modals.newGroupModal]);

  return (
    <>
      <div className=" max-h-[70vh] w-full overflow-x-auto">
        <div className=" relative ">
          <Image
            src={
              typeof coverImage === "string" && coverImage
                ? coverImage
                : "/essential/group-cover-image-placeholder.png"
            }
            height={120}
            width={120}
            className="h-[120px] w-full object-cover object-center"
            alt="Group Cover"
          />
          <div className="flex  p-6   flex-col   absolute top-0 right-0 w-full mb-4">
            <div className="justify-between flex w-full ">
              <label className="text-gray-500 hover:text-gray-700 w-[32px] h-[32px] flex items-center justify-center bg-white rounded-full cursor-pointer">
                <FaPen size={16} />
                <input
                  type="file"
                  disabled={isLoading}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, true)}
                />
              </label>
              <button
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700 w-[32px] h-[32px]  flex items-center justify-center bg-white rounded-full"
                onClick={() => handleToggleModal()}
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className=" text-center  text-[12px] text-divider-200 relative mt-[-20px]">
              <span> upload image</span>
            </div>
          </div>
        </div>
        <div className=" flex justify-center  relative mt-[-44px]">
          <label className="border border-black border-spacing-6 border-dashed bg-white w-[110px] h-[110px] rounded-full text-divider-200 uppercase flex-col flex items-center justify-center cursor-pointer">
            {icon && typeof icon === "string" ? (
              <Image
                src={icon}
                className="h-full rounded-full w-full object-cover object-center"
                alt="Group Cover"
                width={120}
                height={120}
              />
            ) : (
              <>
                <FaCamera size={44} />
                <span className="text-[14px]">Upload</span>
              </>
            )}
            <input
              disabled={isLoading}
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e, false)}
            />
          </label>
        </div>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">Customize your group</h2>
            <p className="text-[14px] text-divider-200 mb-6">
              Give your new group a personality
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <CustomTextarea
              id="group description"
              onChange={(e) => setValues("description", e.target.value)}
              value={values.description}
              label="Group Description"
              placeholder="Tell us about your group"
              className="mt-4 "
              textareaClassName="bg-divider-100"
            />

            <span className=" text-[12px]">
              By creating a group you agree to Twezimbe’s{" "}
              <a
                href="https://twezimbe.com/"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Group guidelines
              </a>
            </span>
          </div>
        </div>

        <div className="flex bg-primary justify-between bottom-0 sticky p-3">
          <button
            disabled={isLoading}
            className="px-4 py-2 text-gray-200 rounded-md"
            onClick={() => back()}
          >
            Back
          </button>
          <button
            disabled={isLoading}
            className="px-4 py-2 text-primary bg-white rounded-md"
            onClick={handleCreate}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </>
  );
};

export default MoreGroupDetails;
