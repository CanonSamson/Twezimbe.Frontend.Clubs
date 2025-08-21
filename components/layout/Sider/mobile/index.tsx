import React from "react";
import ListComponent from "../components/index";
import { useAppSelector } from "@/lib/hooks";
// import { UserContext, UserContextType } from "@/contexts/user";
// import { useContextSelector } from "use-context-selector";
// import { getNameInitials } from "@/utils/functions/getNameInitials";
import { useParams, usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { useSettingModal } from "@/contexts/modal-setting";

const MobileNavigation = () => {
  const pathname = usePathname();
  const groupList = useAppSelector((state) => state.group?.groupList);
  const { channelId } = useParams();
  // const currentUser = useContextSelector(
  //   UserContext,
  //   (state: UserContextType) => state.currentUser
  // );
  // const { toggleModal } = useSettingModal();

  // const router = useRouter();
  const hidden =
    !!channelId ||
    pathname.startsWith("/cases/") ||
    (pathname.startsWith("/bf/") && pathname.includes("settings"));
  return (
    <div className={`${hidden ? " hidden" : ""}`}>
      <div className="  tablet-lg:hidden justify-center items-center  fixed bottom-0 right-0 w-full  flex  z-[30]  bg-gray-50 rounded-t-[10px] border border-[#101828]/5">
        <ListComponent
          _name="Home"
          _icon="/icon/home.svg"
          _clickedIcon="/icon/home_blue.svg"
          _url="/home"
          pathname={pathname}
        />
        <ListComponent
          _name="Groups"
          _icon="/icon/community.svg"
          _clickedIcon="/icon/community_blue.svg"
          _url="/groups"
          pathname={pathname}
          groupList={groupList}
        />
        <ListComponent
          _name="Direct"
          _icon="/icon/chats.svg"
          _clickedIcon="/icon/chats_blue.svg"
          _url="/dms"
          pathname={pathname}
        />
        <ListComponent
          _name="Wallet"
          _icon="/icon/wallet.svg"
          _clickedIcon="/icon/wallet_blue.svg"
          _url="/global-wallet"
          pathname={pathname}
          // handleClick={() => {
          //   toggleModal("comingSoonModal");
          // }}
        />
        <ListComponent
          _name="More"
          _icon="/icon/more.svg"
          _clickedIcon="/icon/more_blue.svg"
          _url="/more"
          pathname={pathname}
          // handleClick={() => {
          //   toggleModal("comingSoonModal");
          // }}
        />
        {/* <ListComponent
          _name="Profile"
          _icon="/icon/friends.svg"
          _clickedIcon="/icon/community_blue.svg"
          _url="/settings/profile"
          pathname={pathname}
          icon={
            <div
              className={cn(
                "max-tablet-lg:h-[30px] tablet-lg:h-auto flex items-center justify-center px-1 rounded-[7px] overflow-hidden",
                pathname.includes("/profile") || pathname.includes("/kyc")
                  ? "max-tablet-lg:bg-primary"
                  : "max-tablet-lg:bg-primary/30"
              )}
            >
              <div
                className={` ${
                  pathname.includes("/profile") || pathname.includes("/kyc")
                    ? "text-white"
                    : "text-primary"
                } w-[24px]   text-center font-semibold text-[18px]`}
              >
                <span className="">
                  {getNameInitials(
                    `${currentUser?.profile.firstName} ${currentUser?.profile.lastName}`
                  )}
                </span>
              </div>
            </div>
          }
          handleClick={() => {
            router.push("/settings/profile");
          }}
        /> */}
      </div>
    </div>
  );
};

export default MobileNavigation;
