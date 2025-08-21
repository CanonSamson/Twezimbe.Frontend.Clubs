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
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount } from "@/utils/functions/formatAmount";
import {
  BeneficiarySubscriptionFeeCalculationType,
} from "@/api/bereavement-fund/beneficiary";

const TableHeads = [
  { id: "category", name: "Beneficiary Category" },
  { id: "count", name: "Count" },
  { id: "riskProfile", name: "Risk Profile (%)" },
  { id: "amount", name: "Amount" },
  { id: "remark", name: "Remark" },
];

const LoadingRow = () => (
  <TableRow>
    {TableHeads.map((head) => (
      <TableCell key={head.id}>
        <Skeleton className="h-4 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

const BfSubscriptionCalculationTable = ({
  calculations,
}: {
  calculations: BeneficiarySubscriptionFeeCalculationType  | undefined;
}) => {
  const isLoading = false;



  const hasData = calculations && calculations.categories.length > 0;

  if (isLoading) {
    return (
      <Card className="p-6 mt-6 rounded-none bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {TableHeads.map((head) => (
                <TableHead key={head.id}>{head.name}</TableHead>
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

  return (
    <Card className="hidden tablet-lg:block mt-6 rounded-none bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {TableHeads.map((head) => (
              <TableHead key={head.id} className="text-gray-600 font-medium">
                {head.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasData ? (
            <TableRow>
              <TableCell
                colSpan={TableHeads.length}
                className="text-center px-6 py-8"
              >
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No calculation data found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {/* Category rows */}
              {calculations?.categories?.map((category, index) => (
                <TableRow key={index}>
                  <TableCell className="text-gray-700 px-6 py-4">
                    {category.category}
                  </TableCell>
                  <TableCell className="text-gray-700 text-center px-6 py-4">
                    {category.count}
                  </TableCell>
                  <TableCell className="text-gray-700 text-center px-6 py-4">
                    {category.riskProfile}
                  </TableCell>
                  <TableCell className="text-gray-700 px-6 py-4">
                    UGX {formatAmount(String(category.amount || 0))}
                  </TableCell>
                  <TableCell className="text-gray-500 px-6 py-4">
                    {category.remark}
                  </TableCell>
                </TableRow>
              ))}

              {/* Subtotal row */}
              <TableRow className="border-t-2">
                <TableCell
                  className="text-gray-700 font-medium px-6 py-4"
                  colSpan={3}
                >
                  Subtotal
                </TableCell>
                <TableCell className="text-gray-700 font-medium px-6 py-4">
                  UGX {formatAmount(String(calculations?.subtotal || 0))}
                </TableCell>
                <TableCell className="text-gray-500 px-6 py-4">-</TableCell>
              </TableRow>

              {/* Annual base fee row */}
              <TableRow>
                <TableCell
                  className="text-gray-700 font-medium px-6 py-4"
                  colSpan={3}
                >
                  Annual base fee
                </TableCell>
                <TableCell className="text-gray-700 font-medium px-6 py-4">
                  UGX {formatAmount(String(calculations?.annualBaseFee || 0))}
                </TableCell>
                <TableCell className="text-gray-500 px-6 py-4">-</TableCell>
              </TableRow>

              {/* Grand total row */}
              <TableRow className="border-t-2 bg-gray-50">
                <TableCell
                  className="text-gray-800 font-semibold px-6 py-4"
                  colSpan={3}
                >
                  Grand Total
                </TableCell>
                <TableCell className="text-gray-800 font-semibold px-6 py-4">
                  UGX {formatAmount(String(calculations?.grandTotal || 0))}
                </TableCell>
                <TableCell className="text-gray-500 px-6 py-4">-</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BfSubscriptionCalculationTable;
