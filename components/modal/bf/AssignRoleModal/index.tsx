"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import AssignRole from "./AssignRole";
import RoleAssigned from "./RoleAssigned";

const AssignRoleModal = () => {
  const { closeModal, modals, modalData } = useSettingModal();

  const state = modalData?.assignRoleModal?.state || 1;
  const handleToggleModal = () => {
    closeModal("assignRoleModal");
  };
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center tablet:justify-center ${
        modals.assignRoleModal ? "flex" : "hidden"
      }`}
    >
      <button
        onClick={() => handleToggleModal()}
        className={`w-full  z-0 fixed items-center justify-center h-full bg-black bg-opacity-[75%] ${
          modals.assignRoleModal ? "flex" : "hidden"
        }`}
      />

      <div className="relative w-[487px] max-w-full rounded-[10px] py-10 px-6 bg-white font-inter">
        {state === 1 ? <AssignRole /> : <RoleAssigned />}
      </div>
    </div>
  );
};

export default AssignRoleModal;
