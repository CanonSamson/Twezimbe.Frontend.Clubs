"use client";
import { RootState } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  // DropdownMenuSeparator,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { getNameInitials } from "@/utils/functions/getNameInitials";
import Image from "next/image";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { UserContext } from "@/contexts/user";
import { useContextSelector } from "use-context-selector";

const ProfileSettingsPreview = ({
  children,
}: {
  children: React.ReactNode;
  siderWidth: number;
}) => {
  const onlineUsers = useAppSelector(
    (state: RootState) => state.socket.onlineUsers
  );

  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );
  const logout = useContextSelector(UserContext, (state: any) => state.logout);

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className=" w-full  text-start ring-0  duration-0 border-none  focus:outline-none"
        onBlur={() => {}}
        asChild
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{}}
        className={`w-56 bg-white  mb-[-40px] `}
        side={"right"}
        align={"end"}
      >
        <DropdownMenuItem className=" cursor-pointer border-b ">
          <div className=" flex items-center gap-2 ">
            <div className="w-[50px] ">
              {currentUser?.profile?.profileImage ? (
                <Image
                  src={currentUser?.profile?.profileImage || "/avatar/2.svg"}
                  className={`w-[50px]  rounded-xl
                  object-cover bg-white flex items-center justify-center `}
                  width={200}
                  height={200}
                  alt={"YC EC"}
                />
              ) : (
                <div
                  className="w-[50px] aspect-square rounded-xl
         bg-white flex items-center font-bold font-inter justify-center
          text-primary text-[22px]  uppercase"
                >
                  {getNameInitials(
                    `${currentUser?.profile.firstName} ${currentUser?.profile.lastName}`
                  )}
                </div>
              )}
            </div>
            <div className="text-[14px]">
              <h4 className="  font-semibold">
                {currentUser?.profile.firstName} {currentUser?.profile.lastName}
              </h4>
              <span className=" text-[12px]">
                {onlineUsers?.[currentUser?.id || ""] ? "Active" : "InActive"}
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push(`/settings/profile/basic`);
            // toast.info('Coming Soon')
          }}
          className="cursor-pointer flex  items-center  justify-between py-3 border-b"
        >
          <span>Profile</span>
          <GoChevronRight className="text-[12px]" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push(`/settings/kyc/general`);
          }}
          className=" flex  cursor-pointer items-center  justify-between py-3 border-b"
        >
          <span>Account KYC</span>
          <GoChevronRight className="text-[12px]" />
        </DropdownMenuItem>

        {/* <DropdownMenuItem className='cursor-pointer flex  items-center  justify-between py-3 border-b'>
          <span>Preferences</span>

          <GoChevronRight className='text-[12px]' />
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          onClick={() => {
            router.push(`/global-wallet`);
          }}
          className=" flex  cursor-pointer items-center  justify-between py-3 border-b"
        >
          <span>Your wallet</span>
          <GoChevronRight className="text-[12px]" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => logout()}
          className=" flex cursor-pointer items-center  justify-between "
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSettingsPreview;
