"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getPrincipalMembership } from "@/api/bereavement-fund/dashboard";
import { useParams } from "next/navigation";
import { formatAmount } from "@/utils/functions/formatAmount";

const TableHeads = [
  { id: "name", name: "Name", align: "text-left" },
  {
    id: "username",
    name: "Username",
    align: "hidden tablet-lg:table-cell text-left",
  },
  {
    id: "membershipFee",
    name: "Membership Fee",
    align: "text-center tablet-lg:text-left",
  },
  {
    id: "annualSubscription",
    name: "Annual Subscription",
    align: "hidden tablet-lg:table-cell text-left",
  },
  {
    id: "totalContributions",
    name: "Total Contributions",
    align: "hidden tablet-lg:table-cell text-left",
  },
  {
    id: "totalPayout",
    name: "Total Payout",
    align: "hidden tablet-lg:table-cell text-left",
  },
  {
    id: "totalCases",
    name: "Total Supports",
    align: "hidden tablet-lg:table-cell text-left",
  },
  // { id: "actions", name: "Actions", align: "text-end tablet-lg:text-left" },
];

const LoadingRow = () => (
  <TableRow>
    {TableHeads.map((head) => (
      <TableCell key={head.id} className={head.align}>
        <Skeleton
          className={`h-4 w-full ${
            head.id === "actions" ? "max-w-[100px]" : ""
          }`}
        />
      </TableCell>
    ))}
  </TableRow>
);

const PrincipalsTable = () => {
  const bfId = useParams()?.bfId as string;

  const { data, isLoading } = useQuery({
    queryKey: ["principals", bfId],
    queryFn: () => getPrincipalMembership(bfId),
    enabled: true,
  });

  const hasPrincipals = data && data.data.data.data.length > 0;

  if (isLoading) {
    return (
      <Card className="p-6 mt-6 rounded-none bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#101828]">Principals</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {TableHeads.map((head) => (
                <TableHead key={head.id} className={head.align}>
                  {head.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <LoadingRow key={index} />
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <Card className="p-2 tablet-lg:p-10 mt-6 rounded-none bg-white">
      <div className="flex justify-between items-start mb-4 mt-3 tablet-lg:mt-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-[#101828]">Principals</h2>
          <p className="block tablet-lg:hidden text-[12px] text-[#969696] underline cursor-pointer mt-1">
            View all
          </p>
        </div>
        <Button
          onClick={() => toast.info("Not Implementated")}
          className="flex hover:bg-[#F3BF93] text-black items-center gap-2 bg-[#F3BF93] rounded-full p-1 
      size-[22px]
      tablet-lg:rounded-md tablet-lg:size-auto tablet-lg:px-4 tablet-lg:py-2"
          size="icon"
        >
          <IoCloudUploadOutline className="size-[24px] tablet-lg:size-[40px] text-white tablet-lg:text-black" />
          <span className="max-tablet-lg:hidden ml-2">Export report</span>
        </Button>
      </div>

      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {TableHeads.map((head) => (
              <TableHead key={head.id} className={head.align}>
                {head.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasPrincipals ? (
            <TableRow>
              <TableCell
                colSpan={TableHeads.length}
                className=" py-4 text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No principals found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.data.data.data?.map((principal) => (
              <TableRow key={principal?.id}>
                <TableCell className=" px-2 py-2 text-left">
                  {principal?.firstName} {principal?.lastName}
                </TableCell>
                <TableCell className=" px-2 py-2 hidden tablet-lg:table-cell">
                  @{principal?.userName}
                </TableCell>
                <TableCell
                  className={`text-center tablet-lg:text-left  ${
                    !principal?.membershipPaid
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {principal.membershipPaid ? "PAID" : "UNPAID"}
                </TableCell>
                <TableCell className=" px-2  uppercase py-2 hidden tablet-lg:table-cell">
                  <span
                    className={
                      principal?.annualSubscription?.[0]?.status === "PENDING"
                        ? "text-orange-500"
                        : "text-green-600"
                    }
                  >
                    {principal?.annualSubscription?.[0]?.status}
                  </span>
                </TableCell>
                <TableCell className=" px-2 py-2 hidden tablet-lg:table-cell">
                  UGX {formatAmount(String(principal?.totalContributions || 0))}
                </TableCell>
                <TableCell className=" px-2 py-2 hidden tablet-lg:table-cell">
                  UGX {formatAmount(String(principal?.totalPayout || 0))}
                </TableCell>
                <TableCell className=" px-2 py-2 hidden tablet-lg:table-cell">
                  {principal?.totalFiledCases}
                </TableCell>
                {/* <TableCell className="text-end tablet-lg:text-left">
                  <Button
                    variant="outline"
                    className="rounded-full py-3 mr-2 tablet-lg:rounded-md tablet-lg:mr-0 tablet-lg:py-2 text-gray-600 border-gray-300"
                  >
                    View
                  </Button>
                </TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default PrincipalsTable;
