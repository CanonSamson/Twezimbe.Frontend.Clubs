"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  updateGroupDetails,
  uploadGroupIconCover,
  uploadGroupIconImage,
} from "@/api/group";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { IoCameraOutline } from "react-icons/io5";
import Lottie from "react-lottie";
import loadingAnimationData from "@/public/assets/animations/loading.json";
import { useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";
import { RootState } from "@/lib/store";
import { useSettingModal } from "@/contexts/modal-setting";
import useGroup from "@/hooks/userGroup";

const ChannelAbout = ({
  channel,
}: {
  channel:
    | {
        type: string;
        id: string;
        name: string;
        privacy: "PUBLIC" | "PRIVATE";
        createdAt: Date;
        updatedAt: Date;
        access: boolean;
        role: Array<{
          permissions: Array<"VIEW" | "CHAT" | "ADMIN">;
        }>;
        request: {
          id: string;
          status: string;
        } | null;
        description?: string | null;
        topic?: string | null;
        canDelete?: boolean;
      }
    | undefined;
}) => {
  const { toggleModal, modalData } = useSettingModal();
  const { isChannelAdmin } = useGroup();
  const params = useParams();
  const groupId = params.groupId as string;
  const channelId = params.channelId as string;

  const canEdit = channel?.access && isChannelAdmin;

  return (
    <div className="rounded-lg p-4 space-y-4 ">
      <div className="border rounded-md p-4 flex items-center justify-between bg-white">
        <div>
          <h2 className="font-semibold text-sm">Name</h2>
          <p className="text-gray-500 mt-1 text-sm">
            {channel?.name || "general"}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() =>
              toggleModal("channelAboutModal", {
                type: "name",
                previous: {
                  route: `/groups/${groupId}/${channelId}/details/about`,
                },
              })
            }
            className="text-primary font-semibold text-sm"
          >
            Edit
          </button>
        )}
      </div>

      <div className="border rounded-md p-4 flex items-center justify-between bg-white">
        <div>
          <h2 className="font-semibold text-sm">Topic</h2>
          <p className="text-gray-500 mt-1 text-sm">
            {channel?.topic
              ? channel?.description
              : canEdit
              ? "Add topic"
              : "No channel topic"}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() =>
              toggleModal("channelAboutModal", {
                type: "topic",
                previous: {
                  route: `/groups/${groupId}/${channelId}/details/about`,
                },
              })
            }
            className="text-primary font-semibold text-sm"
          >
            Edit
          </button>
        )}
      </div>

      <div className="border rounded-md p-4 flex items-center justify-between bg-white">
        <div>
          <h2 className="font-semibold text-sm">Description</h2>
          <button>
            <p className="text-gray-500 mt-1 text-sm">
              {channel?.description
                ? channel?.description
                : canEdit
                ? "Add description"
                : "No channel description"}
            </p>
          </button>
        </div>
        {canEdit && (
          <button
            onClick={() =>
              toggleModal("channelAboutModal", {
                ...modalData,
                type: "description",
                previous: {
                  route: `/groups/${groupId}/${channelId}/details/about`,
                },
              })
            }
            className="text-primary font-semibold text-sm"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

const AboutChatView = () => {
  const { channelId } = useParams();

  const channel = useAppSelector((state) =>
    state.group?.group?.channels.find((group) => group.id === channelId)
  );

  const group = useAppSelector((state: RootState) => state.group.group);

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

  if (!channel) {
    return null;
  }

  if (channel.name === "general") {
    return (
      <div className="relative p-0 mt-10 bg-gray-100 w-screen max-tablet:w-screen -mx-4 tablet:mx-auto tablet:max-w-5xl">
        <div className="relative">
          {coverImage.file || coverImage.url ? (
            <Image
              src={coverImage.url || ""}
              width={200}
              height={200}
              alt="cover-image"
              className="w-full h-[80px] mobile:h-[100px] bg-[#C3DBEC42] object-cover -mt-10"
            />
          ) : (
            <div className="object-cover -mt-10 w-full h-[80px] mobile:h-[100px] bg-[#C3DBEC42] relative"></div>
          )}
          <div className="absolute top-2 mobile:top-4 right-2 mobile:right-4 z-10">
            <button className="bg-white px-1 mobile:px-2 py-1 rounded text-black text-xs mobile:text-sm font-medium cursor-pointer hover:opacity-85 duration-300 transition-all">
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
                className="absolute w-full h-full top-0 right-0 opacity-0 cursor-pointer"
              />
              {isUpdating.coverUrl ? "Uploading..." : "Edit header image"}
            </button>
          </div>
          <div className="relative w-[80px] mobile:w-[100px] left-2 mobile:left-4 -mt-[40px] mobile:-mt-[50px] z-10">
            <CustomAvatar
              image={iconImage.url || undefined}
              labelClassName="h-[80px] mobile:h-[100px] w-[80px] mobile:w-[100px] rounded-full border-4 border-white"
              alt="group"
              disabled={true}
              className="rounded-full object-cover w-[80px] mobile:w-[100px] h-[80px] mobile:h-[100px] cursor-pointer"
              imageClassName="h-full w-full object-cover text-[30px] mobile:text-[40px] font-black w-[80px] mobile:w-[100px] h-[80px] mobile:h-[100px] border text-primary flex items-center justify-center text-center"
              iconClassName="text-white size-4 mobile:size-5"
              textClassName="hidden"
              showText={false}
              userFullName={group?.name}
            />
            <button className="absolute right-0 bottom-0 bg-primary h-[25px] mobile:h-[30px] w-[25px] mobile:w-[30px] rounded-full flex items-center justify-center">
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
                  height={30}
                  width={30}
                />
              ) : (
                <IoCameraOutline className="text-white size-4 mobile:size-5" />
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
          </div>
        </div>
        <div className="ml-2 mobile:ml-4 mt-2 mobile:mt-4 flex justify-between items-center">
          <div className="text-[20px] mobile:text-[20px] font-bold">
            {group?.name}
          </div>
        </div>
        <p className="p-2 mobile:p-4 font-inter text-[12px] mobile:text-[12px]">
          {group?.description}
        </p>
        <div className="ml-4 mt-6 text-[12px] mobile:text-[12px] text-[#A8A8A8] mr-2 mobile:mr-4">
          Public group | {group?.type}
        </div>
        {group?.tags && group?.tags?.length > 0 ? (
          <p className="p-2 mobile:p-4 pt-1 font-inter text-[10px] mobile:text-[11px] flex items-center gap-x-1 mobile:gap-x-2">
            Tags:
            {group?.tags?.map((tag: string) => (
              <span
                key={tag}
                className="bg-[#C3DBEC42] text-primary border-2 border-primary rounded-full px-1 mobile:px-2 py-0.5 mobile:py-1"
              >
                {tag}
              </span>
            ))}
          </p>
        ) : null}
      </div>
    );
  } else {
    return <ChannelAbout channel={channel} />;
  }
};

export default AboutChatView;
