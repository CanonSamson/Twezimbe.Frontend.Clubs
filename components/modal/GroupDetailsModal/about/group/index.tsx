"use client";

import {
  updateGroupDetails,
  uploadGroupIconCover,
  uploadGroupIconImage,
} from "@/api/group";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { GroupType } from "@/types/groups";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import Lottie from "react-lottie";
import loadingAnimationData from "@/public/assets/animations/loading.json";
import { IoMdClose } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { useSettingModal } from "@/contexts/modal-setting";
import { hasPermission } from "@/utils/permissions/auth-abac";

interface AboutProps {
  group: GroupType | undefined;
}

export const GroupAbout = ({ group }: AboutProps) => {
  const [coverImage, setCoverImage] = useState<{
    file: File | null;
    url: string | null;
  }>({
    file: null,
    url: group?.coverImage || null,
  });
  const [iconImage, setIconImage] = useState<{
    file: File | null;
    url: string | null;
  }>({
    file: null,
    url: group?.iconImage || null,
  });
  const [isUpdating, setIsUpdating] = useState<{
    iconUrl: boolean;
    coverUrl: boolean;
  }>({
    iconUrl: false,
    coverUrl: false,
  });

  const { modalData, toggleModal } = useSettingModal();
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<
      React.SetStateAction<{
        file: File | null;
        url: string | null;
      }>
    >,
    uploadFn: (file: File) => Promise<{ data: { url: string } }>,
    type: "iconUrl" | "coverUrl"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUpdating((prev) => ({ ...prev, [type]: true }));
        const res = await uploadFn(file);

        if (res.data.url) {
          const updateGroup = await updateGroupDetails({
            groupId: group?.id || "",
            [type]: res.data.url,
          });
          console.log("updateGroup", updateGroup);
          setImage({
            file,
            url: res.data.url,
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUpdating((prev) => ({ ...prev, [type]: false }));
      }
    }
  };

  useEffect(() => {
    setCoverImage({
      file: null,
      url: group?.coverImage || null,
    });
  }, [group?.coverImage]);

  useEffect(() => {
    setIconImage({
      file: null,
      url: group?.iconImage || null,
    });
  }, [group?.iconImage]);

  const canEditGroup = hasPermission(
    {
      blockedBy: [],
      roles: group?.roles || [],
      id: "" as string,
    },
    "group-details",
    "create",
    { groupId: group?.id as string }
  );

  return (
    <div className="relative   h-[400px] overflow-y-auto w-full p-0 pt-10">
      <div className="relative ">
        {coverImage.file || coverImage.url ? (
          <Image
            src={coverImage.url || ""}
            width={200}
            height={200}
            alt="cover-image"
            className="w-full h-[120px] bg-[#C3DBEC42] object-cover -mt-10"
          />
        ) : (
          <div className=" object-cover -mt-10 w-full h-[120px] bg-[#C3DBEC42] relative"></div>
        )}

        {canEditGroup && (
          <div className="absolute top-4 right-4 z-10">
            <button className="bg-white px-2  overflow-hidden py-1 rounded text-black text-sm font-medium cursor-pointer hover:opacity-85 duration-300 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleFileChange(
                    event,
                    setCoverImage,
                    uploadGroupIconCover,
                    "coverUrl"
                  )
                }
                disabled={isUpdating.iconUrl}
                className=" absolute w-full h-full top-0 right-0 opacity-0 cursor-pointer"
              />
              {isUpdating.coverUrl ? "Uploading..." : "Edit header image"}
            </button>
          </div>
        )}

        <div className=" relative w-[120px]  left-4 -mt-[60px] z-10">
          <CustomAvatar
            image={iconImage.url || undefined}
            labelClassName="h-[120px] w-[120px] rounded-full border-4 border-white"
            alt="group"
            disabled={true}
            className="rounded-full object-cover w-[120px]  h-[120px] cursor-pointer"
            imageClassName="h-full w-full object-cover text-[50px] font-black w-[120px] h-[120px] border text-primary flex  items-center justify-conter text-center"
            iconClassName="text-white size-6"
            textClassName="hidden"
            showText={false}
            userFullName={group?.name}
          />

          {canEditGroup && (
            <button className="absolute right-0 bottom-0 bg-primary h-[35px] w-[35px] rounded-full flex items-center justify-center">
              {isUpdating.iconUrl ? (
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: loadingAnimationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={40}
                  width={40}
                />
              ) : (
                <IoCameraOutline size={20} className="text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleFileChange(
                    event,
                    setIconImage,
                    uploadGroupIconImage,
                    "iconUrl"
                  )
                }
                disabled={isUpdating.iconUrl}
                className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
              />
            </button>
          )}
        </div>
      </div>

      <div className=" ml-4 my-4 flex justify-between items-center">
        <div className="text-[12px] text-[#A8A8A8] mr-4">
          Public group | {group?.type}
        </div>
      </div>

      <div className=" px-4 flex flex-col gap-2">
        <div className=" border border-gray-300 rounded-[5px] p-4">
          <div className="flex items-center justify-between">
            <span className=" font-semibold">Description</span>

            {canEditGroup && (
              <button
                onClick={() => {
                  toggleModal("channelAboutModal", {
                    ...modalData,
                    type: "description",
                    state: "group",
                    previous: {
                      name: "groupDetailsModal",
                      data: modalData?.groupDetailsModal,
                    },
                  });
                }}
                className=" text-primary font-semibold"
              >
                Edit
              </button>
            )}
          </div>
          <div className=" mt-3">
            <span className=" text-[14px]">
              {group?.description || "No Description"}
            </span>
          </div>
        </div>
        <button
          onClick={() => toggleModal("leaveGroupModal", { step: 2 })}
          className=" border text-start border-gray-300 rounded-[5px] p-4"
        >
          <span className=" font-semibold text-red-600">Leave Group</span>
        </button>

        {group?.tags && group?.tags?.length > 0 ? (
          <div className="p-4 pt-1 font-inter text-[12px] flex items-center gap-x-2">
            Tags:
            {group?.tags?.map((tag: string) => (
              <button
                key={tag}
                className=" bg-gray-300 flex  px-2 items-center gap-2"
              >
                <span>{tag}</span> <IoMdClose className=" size-[14px]" />
              </button>
            ))}
            <button className=" p-1">
              <AiOutlinePlus className=" size-[16px]" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
