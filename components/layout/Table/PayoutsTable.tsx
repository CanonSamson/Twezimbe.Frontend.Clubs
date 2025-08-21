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
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const TableHeads = [
  { id: "caseName", name: "Case Name" },
  { id: "beneficiary", name: "Beneficiary" },
  { id: "assignedPrincipal", name: "Assigned Principal" },
  { id: "beneficiaryStatus", name: "Beneficiary Status" },
  { id: "amount", name: "Amount" },
  { id: "paid", name: "Paid" },
  { id: "actions", name: "Actions" },
];

const dummyData: {
  id: number;
  caseName: string;
  beneficiary: string;
  assignedPrincipal: string;
  beneficiaryStatus: string;
  amount: string;
  paid: string;
}[] = [];

const LoadingRow = () => (
  <TableRow>
    {TableHeads.map((head) => (
      <TableCell
        key={head.id}
        className={
          ["caseName", "beneficiary", "amount"].includes(head.id)
            ? ""
            : "max-tablet-lg:hidden"
        }
      >
        <Skeleton className="h-4 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

const PayoutsTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["payouts"],
    queryFn: () => dummyData,
    enabled: true,
  });

  return (
    <Card className="p-6 mt-6 rounded-none bg-white">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-[#101828]">Payouts</h2>
        <p className="block tablet-lg:hidden text-[12px] text-[#969696] underline cursor-pointer mt-1 mb-3">
          View all
        </p>
      </div>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {TableHeads.map((head) => (
              <TableHead
                key={head.id}
                className={
                  head.id === "caseName"
                    ? "max-tablet-lg:text-start"
                    : head.id === "beneficiary"
                    ? "max-tablet-lg:text-center"
                    : head.id === "amount"
                    ? "max-tablet-lg:text-end"
                    : "max-tablet-lg:hidden"
                }
              >
                {head.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              <LoadingRow />
              <LoadingRow />
              <LoadingRow />
            </>
          ) : !data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={TableHeads.length} className="text-center py-4">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No payout entries found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="max-tablet-lg:text-start">
                  {payout.caseName}
                </TableCell>
                <TableCell className="max-tablet-lg:text-center">
                  {payout.beneficiary}
                </TableCell>
                <TableCell className="max-tablet-lg:hidden">
                  {payout.assignedPrincipal}
                </TableCell>
                <TableCell
                  className={`max-tablet-lg:hidden ${
                    payout.beneficiaryStatus === "Sick"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {payout.beneficiaryStatus}
                </TableCell>

                <TableCell className="max-tablet-lg:text-end">
                  {payout.amount}
                </TableCell>
                <TableCell className="max-tablet-lg:hidden">
                  {payout.paid}
                </TableCell>
                <TableCell className="max-tablet-lg:hidden">
                  <Button variant="outline" className="flex items-center gap-1">
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

export default PayoutsTable;
