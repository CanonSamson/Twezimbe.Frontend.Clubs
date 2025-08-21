"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import RemoveBfRole from "./RemoveBfRole";
import RoleRemoved from "./RoleRemoved";

const RemoveBfRoleModal = () => {
  const { closeModal, modals, modalData } = useSettingModal();

  const state = modalData?.removeBfRoleModal?.state || 1;
  const handleToggleModal = () => {
    closeModal("removeBfRoleModal");
  };
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center tablet:justify-center ${
        modals.removeBfRoleModal ? "flex" : "hidden"
      }`}
    >
      <button
        onClick={() => handleToggleModal()}
        className={`w-full  z-0 fixed items-center justify-center h-full bg-black bg-opacity-[75%] ${
          modals.removeBfRoleModal ? "flex" : "hidden"
        }`}
      />

      <div className="relative w-[487px] max-w-full rounded-[10px] py-10 px-6 bg-white font-inter">
        {state === 1 ? <RemoveBfRole /> : <RoleRemoved />}
      </div>
    </div>
  );
};

export default RemoveBfRoleModal;
