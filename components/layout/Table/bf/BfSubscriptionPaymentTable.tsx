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
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { formatAmount } from "@/utils/functions/formatAmount";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getBeneficiariesSubsriptionfees } from "@/api/bereavement-fund/beneficiary";

const TableHeads = [
  { id: "item", name: "Item" },
  { id: "year", name: "Year" },
  { id: "amount", name: "Amount" },
  { id: "status", name: "Status" },
  { id: "paymentDate", name: "Payment Date" },
  { id: "nextDue", name: "Next Due" },
  { id: "change", name: "Change" }, // Added 'Change' column
];

const LoadingRow = () => (
  <TableRow>
    {TableHeads.map((head) => (
      <TableCell key={head.id} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

const BfSubscriptionPaymentTable = () => {
  const bfId = useParams()?.bfId as string;

  const { data, isLoading } = useQuery({
    queryKey: ["getBeneficiariesSubsriptionfees", bfId],
    queryFn: async () => getBeneficiariesSubsriptionfees(bfId),
  });
  const hasSubscriptions = data?.data && data?.data.beneficiaries.length > 0;

  if (isLoading) {
    return (
      <Card className="p-6 mt-6 w-full  rounded-none bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {TableHeads.map((head) => (
                <TableHead key={head.id} className="px-6 py-4">
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
    <Card className=" w-full block mt-6 rounded-none bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {TableHeads.map((head) => (
              <TableHead key={head.id} className="px-6 py-4">
                {head.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasSubscriptions ? (
            <TableRow>
              <TableCell
                colSpan={TableHeads.length}
                className="text-center px-6 py-8"
              >
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm  mt-5 text-muted-foreground">
                    No subscriptions found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data?.data?.beneficiaries?.map((sub) => (
              <TableRow key={sub?.id}>
                <TableCell className="text-gray-600 lowercase px-6 py-4">
                  Annual Subscription
                </TableCell>
                <TableCell className="px-6 py-4">{sub?.year}</TableCell>
                <TableCell className="px-6 py-4">
                  UGX {formatAmount(String(sub.amount || 0))}
                </TableCell>
                <TableCell
                  className={cn(
                    "font-medium px-6 py-4",
                    sub.status === "Paid" ? "text-green-600" : "text-orange-500"
                  )}
                >
                  {sub.status}
                </TableCell>
                <TableCell className="text-gray-500 px-6 py-4">
                  {sub.paymentDate
                    ? moment(sub.paymentDate).format("DD/MM/YYYY")
                    : "-"}
                </TableCell>
                <TableCell className="text-gray-500 px-6 py-4">
                  {sub.nextPaymentDate
                    ? moment(sub.nextPaymentDate).format("DD/MM/YYYY")
                    : "-"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center text-red-500">
                    <span className="mr-1">&#9660;</span> {/* Down arrow */}
                    {Math.abs(0.0)}%
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BfSubscriptionPaymentTable;
