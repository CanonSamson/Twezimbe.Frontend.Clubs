"use client";
import React from "react";
import { useSettingModal } from "@/contexts/modal-setting";
import { useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import CustomSlideToggle from "../custom/CustomSlideToggle";
import { useMutation } from "@tanstack/react-query";
import { updateGroupMemberSettings } from "@/api/group";

const NotificationSettingModal = () => {
  const { channelId, groupId } = useParams();
  const { toggleModal, modals } = useSettingModal();

  const channel = useAppSelector((state) =>
    state.group?.group?.channels.find((item) => item.id === channelId)
  );

  const group = useAppSelector((state) => state.group?.group);

  const { mutate: mutateMute, isPending: muteIsPending } = useMutation({
    mutationFn: (data: { mute?: boolean }) =>
      updateGroupMemberSettings(groupId as string, {
        settings: {
          ...data,
        },
      }),
  });

  const memberSettings = group?.memberSettings;

  const {
    mutate: mutateNotificationOption,
    isPending: notificationOptionIsPending,
  } = useMutation({
    mutationFn: (data: {
      notifications: {
        option: string;
      };
    }) =>
      updateGroupMemberSettings(groupId as string, {
        settings: {
          ...data,
        },
      }),
  });

  const {
    mutate: mutateEmailNotification,
    isPending: emailNotificationIsPending,
  } = useMutation({
    mutationFn: (data: {
      notifications: {
        email: boolean;
      };
    }) =>
      updateGroupMemberSettings(groupId as string, {
        settings: {
          ...data,
        },
      }),
  });

  const messageOptions = [
    { label: "All messages", name: "all" },
    { label: "Only @mentions", name: "mentions" },
    { label: "Nothing", name: "none" },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        modals.notificationSettingModal ? "flex" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={() => toggleModal("notificationSettingModal")}
      />

      <div className="relative bg-white w-full max-w-xl rounded-md shadow-lg">
        <div className="px-6 py-4">
          <h2 className="flex items-center justify-between text-[22px] font-bold mb-1">
            <span>Notification settings</span>
            <button
              className="text-divider-200 hover:text-divider-300 duration-500 transition-colors"
              onClick={() => toggleModal("notificationSettingModal")}
            >
              <IoClose size={24} />
            </button>
          </h2>

          <p className="text-[15px] text-start font-inter mb-1">
            {group?.name}
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-sm mb-2">
                Mute {channel?.name}
              </h2>
              <CustomSlideToggle
                isOn={!!memberSettings?.mute}
                toggle={() =>
                  mutateMute({
                    mute: !memberSettings?.mute,
                  })
                }
                isLoading={muteIsPending}
                disabled={muteIsPending}
              />
            </div>
            <p className="text-gray-500 mt-1 text-sm">
              Muting a group prevents unread indicator and notifications from
              appearing unless you are mentioned
            </p>
          </div>

          <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm mb-2">
                Group Notifications
              </h2>
              <h1 className="text-gray-500 mt-1 text-sm mb-1">
                Only allow notifications for
              </h1>
              <p className="space-y-2">
                {messageOptions.map((option) => (
                  <label
                    key={option.name}
                    className="flex items-center space-x-2 font-inter text-[12px]"
                  >
                    <input
                      type="checkbox"
                      name={option.name}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/70"
                      checked={
                        option.name === memberSettings?.notifications?.option
                      }
                      onChange={() => {
                        mutateNotificationOption({
                          notifications: {
                            option: option.name,
                          },
                        });
                      }}
                      disabled={notificationOptionIsPending}
                    />
                    <span className="text-gray-800">{option.label}</span>
                  </label>
                ))}
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
            <div className="flex flex-col items-start w-full">
              <h2 className="font-semibold text-sm">Email notifications</h2>
            </div>

            <CustomSlideToggle
              isOn={!!memberSettings?.notifications?.email}
              toggle={() => {
                mutateEmailNotification({
                  notifications: {
                    email: !memberSettings?.notifications?.email,
                  },
                });
              }}
              disabled={emailNotificationIsPending}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => toggleModal("notificationSettingModal")}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingModal;
