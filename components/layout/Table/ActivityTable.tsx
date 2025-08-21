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
import { useParams } from "next/navigation";
import { getFundTransactions } from "@/api/bereavement-fund/wallet";
import { formatAmount } from "@/utils/functions/formatAmount";
import moment from "moment";
import { useSettingModal } from "@/contexts/modal-setting";

const TableHeads = [
  {
    id: "description",
    name: "Description",
    className: "text-left",
  },
  {
    id: "method",
    name: "Method",
    className: "text-center tablet-lg:text-left",
  },
  {
    id: "date",
    name: "Date",
    className: "hidden tablet-lg:table-cell",
  },
  {
    id: "amount",
    name: "Amount",
    className: "text-right tablet-lg:text-left",
  },
];

const LoadingRow = () => (
  <TableRow className="border-b">
    <TableCell>
      <Skeleton className="h-4 w-[150px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
  </TableRow>
);

const getTransactionStatus = (transaction: any) => {
  const amount = Number(transaction.amount);
  if (isNaN(amount) || amount <= 0) {
    return "failed";
  } else {
    return "success";
  }
};

const ActivityTable = () => {
  const fundId = useParams()?.bfId as string;
  const { toggleModal, closeAllModals } = useSettingModal();

  const { data, isLoading } = useQuery({
    queryKey: ["fund-transactions", fundId],
    queryFn: () => getFundTransactions(fundId),
  });

  if (isLoading) {
    return (
      <Card className="p-10 mt-6 rounded-none bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#101828]">Activity</h2>
          <Button
            onClick={() => toast.info("Not Implemented")}
            className="flex hover:bg-[#F3BF93] text-black items-center gap-2 bg-[#F3BF93]"
          >
            <IoCloudUploadOutline className="size-[24px]" />
            Export report
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {TableHeads.map((head) => (
                <TableHead key={head.id} className={head.className}>
                  {head.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <LoadingRow key={index} />
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  const hasTransactions =
    data?.data.transactions && data?.data.transactions.length > 0;

  return (
    <Card className="p-2 tablet-lg:p-10 mt-6 rounded-none bg-white">
      <div className="flex justify-between items-start mb-4 mt-3 tablet-lg:mt-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-[#101828]">Activity</h2>
          <p className="hidden tablet-lg:block text-gray-500">
            Check your last transactions
          </p>
          <p className="block tablet-lg:hidden text-[12px] text-[#969696] underline cursor-pointer mt-1">
            View all
          </p>
        </div>
        <Button
          onClick={() => toast.info("Not Implemented")}
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
              <TableHead key={head.id} className={head.className}>
                {head.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasTransactions ? (
            <TableRow>
              <TableCell
                colSpan={TableHeads.length}
                className="text-center py-4"
              >
                <div className="flex justify-center mt-4 items-center">
                  <p className="text-gray-500">No transactions found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data?.data.transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer"
                onClick={() => {
                  closeAllModals();
                  toggleModal("transactionDepositModal", {
                    transaction,
                    status: getTransactionStatus(transaction),
                  });
                }}
              >
                <TableCell className="p-2 text-left">
                  {transaction.description}
                </TableCell>
                <TableCell className="p-2 text-center tablet-lg:text-left">
                  {transaction?.paymentType || "N/A"}
                </TableCell>
                <TableCell className="p-2 hidden tablet-lg:table-cell">
                  {moment(transaction?.createdAt).format("MMM D, YYYY")}
                </TableCell>
                <TableCell
                  className={`text-right tablet-lg:text-left ${
                    Number(transaction.amount) < 0
                      ? "text-red-500"
                      : Number(transaction.amount) > 0
                      ? "text-green-500"
                      : ""
                  }`}
                >
                  {Number(transaction.amount) < 0
                    ? "-"
                    : Number(transaction.amount) > 0
                    ? "+"
                    : ""}{" "}
                  {transaction.metadata?.currency}{" "}
                  {formatAmount(String(Math.abs(Number(transaction.amount))))}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ActivityTable;
