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
import { IoCloudUploadOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount } from "@/utils/functions/formatAmount";
import { toast } from "sonner";
import { useSettingModal } from "@/contexts/modal-setting";
import { getGlobalWalletTransactions } from "@/api/global-wallet/index";

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
    id: "status",
    name: "Status",
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
    <TableCell className="hidden tablet-lg:table-cell">
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    <TableCell className="hidden tablet-lg:table-cell">
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
  </TableRow>
);

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status?.toLowerCase();

  const statusStyles = {
    successful: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const getStatusStyle = () => {
    switch (normalizedStatus) {
      case "successful":
        return statusStyles.successful;
      case "failed":
        return statusStyles.failed;
      case "pending":
      case "peding":
        return statusStyles.pending;
      case "cancelled":
        return statusStyles.cancelled;
      default:
        return statusStyles.pending;
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyle}`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() ||
        "Unknown"}
    </span>
  );
};

const getAmountColor = (transactionType: string, status: string) => {
  const normalizedStatus = status?.toLowerCase();
  if (transactionType === "DEBIT") return "text-red-500";
  if (transactionType === "CREDIT" && normalizedStatus === "successful")
    return "text-green-500";
  return "";
};

const GlobalTransactionsTable = () => {
  const { toggleModal, closeAllModals } = useSettingModal();

  const { data, isLoading } = useQuery({
    queryKey: ["global-wallet-transactions"],
    queryFn: () => getGlobalWalletTransactions(),
  });

  if (isLoading) {
    return (
      <Card className="p-10 mt-6 rounded-none bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#101828]">Transactions</h2>
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
          <h2 className="text-xl font-bold text-[#101828]">Transactions</h2>
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
              <TableCell colSpan={TableHeads.length} className="text-center">
                <div className="flex justify-center mt-4 items-center">
                  <p className="text-gray-500">No transactions found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data?.data.transactions.map((transaction: any) => {
              const status = transaction.status as
                | "PENDING"
                | "SUCCESSFUL"
                | "FAILED"
                | "CANCELLED";

              const amountColor = getAmountColor(
                transaction.transactionType,
                status
              );

              return (
                <TableRow
                  key={transaction.id}
                  className="cursor-pointer"
                  onClick={() => {
                    closeAllModals();
                    toggleModal("transactionDepositModal", {
                      transaction,
                      status,
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
                  <TableCell className="p-2 hidden tablet-lg:table-cell">
                    <StatusBadge status={status} />
                  </TableCell>
                  <TableCell
                    className={`text-right tablet-lg:text-left ${amountColor}`}
                  >
                    {transaction.transactionType === "DEBIT"
                      ? "-"
                      : transaction.transactionType === "CREDIT"
                      ? "+"
                      : ""}{" "}
                    {transaction.metadata?.currency || "UGX"}{" "}
                    {formatAmount(String(Math.abs(transaction.amount)))}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GlobalTransactionsTable;
