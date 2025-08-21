import { useSettingModal } from "@/contexts/modal-setting";
import { useParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { useAppSelector } from "@/lib/hooks";
import Requests from "./sections/requests";
import Settings from "./sections/settings";
import { Members } from "./sections/members";
import About from "./about";
import { useMemo } from "react";

const GroupDetailsModal = () => {
  const { modals, closeModal, modalData, updateModalData } = useSettingModal();
  const { channelId } = useParams();

  const group = useAppSelector((state) => state.group?.group);

  const channels = useAppSelector((state) => state.group?.group?.channels);

  const channel = useMemo(() => {
    return channels?.find((channel) => channel.id === channelId);
  }, [channels, channelId]);

  const groupDetailsModal = modals?.groupDetailsModal;

  const activeTab =
    modalData?.groupDetailsModal?.activeTab ||
    ("members" as
      | "members"
      | "about"
      | "settings"
      | "requests"
      | "channel-about");

  const setActiveTab = (tab: string) => {
    updateModalData("groupDetailsModal", {
      ...modalData?.groupDetailsModal,
      activeTab: tab,
    });
  };
  const handleToggleModal = () => {
    closeModal("groupDetailsModal");
    setActiveTab("members");
  };
  const isPending = false;

  const isFirstGeneralPublicChannel =
    channel?.name === "general" &&
    channel?.privacy === "PUBLIC" &&
    channels?.find((ch) => ch.name === "general" && ch.privacy === "PUBLIC")
      ?.id === channelId;

  const isGroupSettings =
    modalData?.groupDetailsModal?.isGroupSettings ||
    isFirstGeneralPublicChannel;

  const tabComponents = channel?.access
    ? [
        {
          key: "about",
          name: "About",
          component: (
            <About
              group={group}
              channel={channel}
              isFirstGeneralPublicChannel={isFirstGeneralPublicChannel}
            />
          ),
        },
        {
          key: "members",
          name: "Members",
          component: <Members channel={channel} group={group} />,
        },
        ...(channel?.role?.some((role) => role.permissions.includes("ADMIN"))
          ? [
              {
                key: "requests",
                name: "Requests",
                component: <Requests />,
              },
            ]
          : []),
        {
          key: "settings",
          name: "Settings",
          component: (
            <Settings
              group={group}
              channel={channel}
              isFirstGeneralPublicChannel={isFirstGeneralPublicChannel}
            />
          ),
        },
      ]
    : [
        {
          key: "about",
          name: "About",
          component: (
            <About
              group={group}
              channel={channel}
              isFirstGeneralPublicChannel={isFirstGeneralPublicChannel}
            />
          ),
        },
        {
          key: "members",
          name: "Members",
          component: <Members channel={channel} group={group} />,
        },
      ];

  const activeComponent = tabComponents.find(
    (tab) => tab.key === activeTab
  )?.component;

  return (
    <div
      className={` ${
        groupDetailsModal ? "flex" : "hidden"
      } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
    >
      <button
        onClick={() => handleToggleModal()}
        disabled={isPending}
        className={`w-full z-0 fixed items-center justify-center h-full bg-black bg-opacity-[75%] ${
          groupDetailsModal ? "flex" : "hidden"
        }`}
      />
      <div className="bg-white z-20 duration-500 transition-all relative w-full max-w-[600px] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg">
        <div className="relative  w-full">
          <div className="py-6">
            <div className="flex justify-between items-center px-6">
              {isGroupSettings ? (
                <>
                  <span className="flex items-center gap-1 text-[22px] font-bold">
                    <span>{group?.name}</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-[22px] font-bold">
                    <span>#</span>
                    <span>{channel?.name}</span>
                  </span>
                </>
              )}

              <button
                className="text-divider-200 hover:text-divider-300"
                onClick={handleToggleModal}
              >
                <IoClose size={34} />
              </button>
            </div>

            <div className="text-[14px] mt-6 relative">
              <ul className="flex space-x-4 relative z-10 font-medium px-6 w-full">
                {tabComponents?.map((tab, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`border-b-2 pt-1 h-[50px] w-full ${
                        activeTab === tab.key
                          ? "border-primary"
                          : "border-transparent"
                      } px-2 transition-colors`}
                    >
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
              <span className="border-b-2 border-gray-300 absolute bottom-0 left-0 right-0" />
            </div>
          </div>

          <div className="duration-300 transition-all relative">
            {activeComponent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;
