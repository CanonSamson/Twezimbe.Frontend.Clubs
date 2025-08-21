"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
// import Image from "next/image";
import { BfRequest } from "@/api/bereavement-fund/fund";
import { Skeleton } from "@/components/ui/skeleton";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { useSettingModal } from "@/contexts/modal-setting";

const TableHeads = [
  { id: "user", name: "User" },
  { id: "name", name: "Name" },
  { id: "username", name: "Username" },
  { id: "status", name: "Status" },
  { id: "actions", name: "Actions" },
];

const getStatusClass = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "text-green-500";
    case "PENDING":
      return "text-orange-500";
    case "DECLINED":
      return "text-red-500";
    default:
      return "";
  }
};

const LoadingRow = () => (
  <TableRow className="border-b">
    <TableCell>
      <Skeleton className="h-10 w-10 rounded-full" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[150px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-9 w-[60px]" />
    </TableCell>
  </TableRow>
);

const NoRequests = () => (
  <TableRow>
    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
      No join requests found
    </TableCell>
  </TableRow>
);

const JoinRequestTable = ({
  requests,
  isLoading,
}: {
  requests: BfRequest[] | undefined;
  isLoading: boolean;
}) => {
  const { openModal } = useSettingModal();

  console.log(requests, "request");
  return (
    <Card className="mr-4 ml-0 tablet-lg:ml-2 mt-0 tablet-lg:mt-8">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="hidden tablet-lg:table-row">
            {TableHeads.map((head, index) => (
              <TableHead
                key={head.id}
                className={`text-gray-600 ${
                  index === 0
                    ? "text-left w-1/6"
                    : index === TableHeads.length - 1
                    ? "text-right w-1/6"
                    : "text-center w-1/6"
                }`}
              >
                {head.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, index) => <LoadingRow key={index} />)
          ) : !requests || requests.length === 0 ? (
            <NoRequests />
          ) : (
            requests.map((request) => (
              <TableRow key={request.id} className="border-b">
                {/* Profile Image */}
                <TableCell className="align-middle tablet-lg:w-1/6 tablet-lg:text-left">
                  {/* <Image
                    src={request.user.profile.profileImage}
                    alt={request.user.profile.userName}
                    width={60}
                    height={60}
                    className="
              rounded-lg ml-2 w-[60px] h-[60px] mb-2
              tablet-lg:w-[40px] tablet-lg:h-[40px]
              relative tablet-lg:top-1 tablet-lg:ml-2
            "
                  /> */}

                  <div className=" flex items-center justify-start"> 
                    <CustomAvatar
                      image={request.user.profile.profileImage}
                      userFullName={`${request.user.profile.firstName} ${request.user.profile.lastName}`}
                      className="
              rounded-lg ml-2 w-[60px] h-[40px] mb-2 mt-2
              tablet-lg:!w-[50px] tablet-lg:!h-[50px]
              relative text-center justify-center flex items-center tablet-lg:ml-2
            "
                      imageClassName="  rounded-[10px] border overflow-hidden object-top text-[32px] font-bold text-primary"
                      labelClassName="flex w-[50px] !h-[50px] items-center justify-center overflow-hidden rounded-[10px]"
                      alt="profile image"
                      showText={false}
                      disabled={true}
                      isCurrentUser={false}
                      iconClassName="size-[28px]"
                    />
                  </div>
                </TableCell>

                <TableCell
                  colSpan={2}
                  className="tablet-lg:hidden align-middle p-0 text-center"
                >
                  <div className="inline-flex flex-col gap-y-0 relative">
                    <span className="text-gray-800 text-[12px]">
                      {request.user.profile.firstName}{" "}
                      {request.user.profile.lastName}
                    </span>
                    <span className="text-gray-500 text-[10px]">
                      @{request.user.profile.userName}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="hidden tablet-lg:table-cell align-middle text-gray-800 font-medium text-[12px] tablet-lg:text-[16px] tablet-lg:w-1/6 tablet-lg:text-center">
                  {request.user.profile.firstName}{" "}
                  {request.user.profile.lastName}
                </TableCell>

                <TableCell className="hidden tablet-lg:table-cell align-middle text-gray-500 text-[10px] tablet-lg:text-[14px] tablet-lg:w-1/6 tablet-lg:text-center">
                  @{request.user.profile.userName}
                </TableCell>

                <TableCell
                  className={`
                          text-[12px] font-medium align-middle left-6 relative
                          tablet-lg:left-0 tablet-lg:text-[16px] tablet-lg:w-1/6
                          text-right tablet-lg:text-center
                          ${getStatusClass(request.status)}
                        `}
                >
                  {request.status}
                </TableCell>

                <TableCell className="align-middle flex justify-end tablet-lg:justify-end tablet-lg:w-full tablet-lg:pr-0">
                  <Button
                    onClick={() => openModal("viewBfRequestModal", request)}
                    variant="outline"
                    className="text-gray-700 text-xs mobile:text-sm tablet:text-base tablet-lg:text-base rounded-2xl px-4 mobile:px-6 py-1 relative tablet-lg:top-1 top-4"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default JoinRequestTable;
