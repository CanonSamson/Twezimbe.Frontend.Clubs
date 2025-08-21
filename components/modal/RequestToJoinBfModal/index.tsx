"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import CustomDialog from "../../custom/CustomDialog";

import SendRequest from "./sections/SendRequest";
import AlReadyRequested from "./sections/AlReadyRequested";

const RequestToJoinBfModal = () => {
  const { modals, modalData } = useSettingModal();

  const state = modalData?.requestToJoinBfModal?.state;
  const hasRequest = !!modalData?.requestToJoinBfModal?.bf.request;

  return (
    <CustomDialog
      open={modals?.requestToJoinBfModal}
      close={() => {}}
      name="requestToJoinBfModal"
      contentClassName="sm:max-w-[525px] py-10 z-[55]  bg-white"
    >
      {!hasRequest && state === 1 ? <SendRequest /> : <AlReadyRequested />}
    </CustomDialog>
  );
};

export default RequestToJoinBfModal;
