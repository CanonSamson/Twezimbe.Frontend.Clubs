import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import MoreActions from "./sections/members/MoreActions";

const MemberCard: FC<{
  firstName: string;
  lastName: string;
  profileImage: string;
  roles: { permission: string; handleClick?: () => void }[];
  isOnline: boolean;
  id: string;
  className?: string;
  refetch?: () => void;
  activeMemberActions: string | null;
  setActiveMemberAction: (memberId: string | null) => void;
}> = ({
  id,
  refetch,
  firstName,
  lastName,
  profileImage,
  roles,
  isOnline,
  className,
  activeMemberActions,
  setActiveMemberAction,
}) => {
  const isActive = activeMemberActions === id;

  return (
    <div
      className={cn(
        "flex duration-200  group tablet:pr-10  relative transition-all hover:bg-gray-50 justify-between items-center gap-2 tablet:gap-4 py-2 rounded-[5px] ",
        className,
        isActive ? " z-[55]" : " z-[20]"
      )}
    >
      <div className=" flex items-center gap-2 tablet:gap-5">
        <div className="  flex items-center gap-2">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={lastName}
              className=" w-[40px] h-[40px] rounded-[5px]"
              width={50}
              height={50}
            />
          ) : (
            <div>
              <div className="w-[40px] h-[40px] rounded-[5px] uppercase bg-primary flex items-center justify-center text-white font-bold text-[18px]">
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </div>
            </div>
          )}
          <div>
            {firstName} {lastName}{" "}
          </div>
        </div>
        <div
          className={`w-[10px] h-[10px] duration-500 transition-all rounded-full ${
            isOnline ? "bg-green-500" : " bg-divider-200"
          }`}
        />
      </div>

      <div className=" flex gap-2">
        {roles.map((role) => {
          if (role.permission !== "USER")
            return (
              <button
                onClick={() => {
                  role.handleClick?.();
                }}
                key={role.permission}
                className=" px-2 tablet:px-4 border border-divider text-[10px] tabket:text-[14px] lowercase rounded-full  tablet:py-2 "
              >
                {role.permission}
              </button>
            );
        })}
      </div>

      <MoreActions
        memberId={id}
        refetch={refetch}
        member={{
          id,
          fullName: `${firstName} ${lastName}`,
        }}
        activeMemberActions={activeMemberActions}
        setActiveMemberAction={setActiveMemberAction}
        roles={roles.map((role) => role.permission)}
      />
    </div>
  );
};

export default MemberCard;
