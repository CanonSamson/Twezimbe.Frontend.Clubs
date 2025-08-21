"use client";

import { BfRequest } from "@/api/bereavement-fund/fund";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettingModal } from "@/contexts/modal-setting";
// import Image from "next/image";
import CustomAvatar from "../custom/CustomAvatar";

const LoadingCard = () => (
  <Card className="flex items-center justify-between p-7 border rounded-md border-gray-200">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-10 w-20 rounded-full" />
  </Card>
);

const UserRequestCard = ({
  requests,
  isLoading,
}: {
  requests: BfRequest[] | undefined;
  isLoading: boolean;
}) => {
  const { toggleModal } = useSettingModal();
  return (
    <div className="border border-gray-200 rounded-xl">
      {isLoading ? (
        <LoadingCard />
      ) : requests && requests?.length > 0 ? (
        requests?.map((t, index) => (
          <Card
            key={index}
            className="flex items-center justify-between p-7 border rounded-md border-gray-200"
          >
            {/* Left Section - User Info */}
            <div className="flex items-center gap-4">
              <CustomAvatar
                image={t?.user.profile.profileImage}
                userFullName={`${t?.user.profile.firstName} ${t?.user.profile.lastName}`}
                className="relative top-0"
                imageClassName="w-[50px] h-[50px] rounded-[10px] border overflow-hidden object-top text-[32px] font-bold text-primary"
                labelClassName="flex w-[50px] h-[50px] items-center justify-center overflow-hidden rounded-[10px]"
                alt="profile image"
                showText={false}
                disabled={true}
                isCurrentUser={false}
                iconClassName="size-[28px]"
              />
              <div>
                <h3 className="text-gray-900 font-semibold">
                  {t?.user.profile.firstName} {t?.user.profile.lastName}
                </h3>
                <p className="text-gray-500 text-sm">
                  @{t?.user.profile.userName}
                </p>
              </div>
            </div>

            {/* Right Section - View Button */}
            <Button
              onClick={() => toggleModal("viewBfRequestModal", t)}
              variant="outline"
              className="rounded-full text-gray-700"
            >
              View
            </Button>
          </Card>
        ))
      ) : null}
    </div>
  );
};

export default UserRequestCard;
