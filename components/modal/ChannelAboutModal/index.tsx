"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import Description from "./sections/description";
import Name from "./sections/name";
import Topic from "./sections/topic";
import { useState } from "react";
import { RootState } from "@/lib/store";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

const ChannelAboutModal = () => {
  const { modals, modalData, closeModal } = useSettingModal();
  const data = modalData?.channelAboutModal;
  const { channelId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const channel = useAppSelector((state: RootState) =>
    state.group.group?.channels?.find((item) => item.id === channelId)
  );

  const renderComponent = () => {
    switch (data?.type) {
      case "description":
        return (
          <Description
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            channel={channel}
          />
        );
      case "name":
        return (
          <Name
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            channel={channel}
          />
        );
      case "topic":
        return (
          <Topic
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            channel={channel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center tablet:justify-center ${
        modals.channelAboutModal ? "flex" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={() => closeModal("channelAboutModal")}
      />

      <div
        className="bg-white rounded-lg shadow-lg
                 w-full max-w-lg
                 mx-4 tablet:mx-8 
                 max-h-[90vh] overflow-hidden
                 z-50 rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-none"
      >
        <div className="p-5 flex flex-col">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default ChannelAboutModal;
