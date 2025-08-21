"use client";
import React from "react";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomSlideToggle from "../custom/CustomSlideToggle";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
import { updateGroupDetails } from "@/api/group";
import { useMutation } from "@tanstack/react-query";

const GroupAccessModal = () => {
  const { closeModal, modals, toggleModal, modalData } = useSettingModal();

  const group = useAppSelector((state) => state.group?.group);

  const { mutate: handleUpdatePrivacy, isPending } = useMutation({
    mutationKey: ["toggle-group-status", group?.id as string],
    mutationFn: () =>
      updateGroupDetails({
        groupId: group?.id as string,
        status: group?.status === "PRIVATE" ? "PUBLIC" : "PRIVATE",
      }),
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        modals.groupAccessModal ? "flex" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={() => closeModal("groupAccessModal")}
      />

      <div className="relative bg-white w-full max-w-xl  shadow-lg  rounded-tr-lg rounded-tl-lg rounded-br-lg">
        <div className="px-6 py-2">
          <h2 className="flex items-center justify-between text-[22px] font-bold mt-4">
            <span>Access</span>
          </h2>

          <p className="text-[15px] text-start font-inter mb-1">
            Set the visibility of your group.
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Image
                  alt="private"
                  src="/icon/privategroup.svg"
                  width={25}
                  height={25}
                  className=" h-[24px] w-auto"
                />
                Private Group
              </h2>

              <CustomSlideToggle
                isOn={group?.status === "PRIVATE"}
                toggle={() => handleUpdatePrivacy()}
                disabled={isPending}
                isLoading={isPending}
              />
            </div>
            <p className="text-gray-500 mt-1 text-sm">
              If your group is set to private, only invited users can access
              your group.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                if (modalData.groupAccessModal?.previous) {
                  toggleModal(modalData.groupAccessModal?.previous.name, {
                    ...modalData?.groupAccessModal?.previous?.data,
                  });
                } else {
                  closeModal("groupAccessModal");
                }
              }}
              className="border border-gray-300  px-4 py-2 rounded-md text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => closeModal("groupAccessModal")}
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

export default GroupAccessModal;
