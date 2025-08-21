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
  getUserBeneficiarySubscriptionFeeCalculation,
  SubscriptionBeneficiary,
} from "@/api/bereavement-fund/beneficiary";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const TableHeads = [
  { id: "beneficiaryName", name: "Beneficiary Name" },
  { id: "age", name: "Age" },
  { id: "riskProfile", name: "Risk Profile (%)" },
  { id: "baseFeeUsed", name: "Base fee used" },
  { id: "addOnFee", name: "Add-on fee" },
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

const LoadingCard = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

type BeneficiaryCardProps = {
  beneficiary: SubscriptionBeneficiary;
  index: number;
};

const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
  beneficiary,
  index,
}) => {
  const subscription = beneficiary?.subscription;
  const annualBasedFee = subscription?.meta?.annualBasedFee || 0;
  const amount = subscription?.amount || 0;
  const age =
    beneficiary.age && beneficiary.age > 0
      ? beneficiary.age
      : beneficiary?.ageInText || "N/A";
  const riskProfile = beneficiary.riskProfile || "N/A";
  const status = subscription?.status || "Unpaid";

  return (
    <div key={index} className="border rounded-lg p-4 space-y-3 bg-white">
      {/* Header with name and status */}
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900 text-sm mobile:text-base">
          {beneficiary.firstName} {beneficiary.lastName}
        </h3>
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            status === "Paid"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
        <div>
          <span className="text-gray-500">Age:</span>
          <span className="ml-2 text-gray-700">{age}</span>
        </div>
        <div>
          <span className="text-gray-500">Risk Profile:</span>
          <span className="ml-2 text-gray-700">{riskProfile}</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Base fee used:</span>
          <div className="flex items-center mt-1">
            <span className="text-green-600 pr-1 text-sm">↑</span>
            <span className="text-gray-700">
              UGX {formatAmount(String(annualBasedFee || 0))}
            </span>
          </div>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Add-on fee:</span>
          <div className="mt-1 text-gray-700 font-medium">
            UGX {formatAmount(String(amount || 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BfBeneficiarySubscriptionCalculationTable = () => {
  const bfId = useParams().bfId as string;

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["getUserBeneficiarySubscriptionFeeCalculation", bfId],
    queryFn: async () => getUserBeneficiarySubscriptionFeeCalculation(bfId),
  });

  const beneficiaries = statsData?.data.beneficiaries || [];
  const hasData = statsData && statsData?.data.beneficiaries.length > 0;

  if (isLoading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="tablet-lg:hidden mt-6 space-y-4 max-tablet:px-4">
          {[...Array(3)].map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>

        {/* Desktop Loading */}
        <Card className="hidden tablet-lg:block p-6 mt-6 rounded-none bg-white">
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
      </>
    );
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="tablet-lg:hidden mt-6 w-full">
        {!hasData ? (
          <div className="border rounded-lg p-8 text-center bg-white">
            <p className="text-sm text-gray-500">No beneficiary data found</p>
          </div>
        ) : (
          <>
            {/* Beneficiary Cards */}
            <div className="space-y-4">
              {beneficiaries?.map((beneficiary, index) => (
                <BeneficiaryCard
                  key={index}
                  beneficiary={beneficiary}
                  index={index}
                />
              ))}
            </div>

            {/* Summary Cards */}
            <div className="mt-6 space-y-3">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total paid
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    UGX {formatAmount(String(statsData?.data?.totalPaid || 0))}
                  </span>
                </div>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total Add-on fees due
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    UGX {formatAmount(String(statsData?.data.total || 0))}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop Table Layout */}
      <Card className="hidden tablet-lg:block mt-6 rounded-none bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                {TableHeads.map((head) => (
                  <TableHead
                    key={head.id}
                    className="text-gray-600 font-medium whitespace-nowrap"
                  >
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
                    className="text-center py-8"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        No beneficiary data found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {/* Beneficiary rows */}
                  {beneficiaries?.map((beneficiary, index) => {
                    const subscription = beneficiary?.subscription;
                    const annualBasedFee =
                      subscription?.meta?.annualBasedFee || 0;
                    const amount = subscription?.amount || 0;
                    const age =
                      beneficiary.age > 0
                        ? beneficiary.age
                        : beneficiary?.ageInText || "N/A";
                    const riskProfile = beneficiary.riskProfile || "N/A";
                    const status = subscription?.status || "Unpaid";
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-gray-700 items-start px-2 py-4">
                          <div className="min-w-0">
                            {beneficiary.firstName} {beneficiary.lastName}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 text-start px-2 py-4">
                          {age}
                        </TableCell>
                        <TableCell className="text-gray-700 text-start px-2 py-4">
                          {riskProfile}
                        </TableCell>
                        <TableCell className="text-gray-700 px-2 py-4">
                          <div className="flex items-start">
                            <span className="text-green-600 pr-1 text-sm">
                              ↑
                            </span>
                            <span className="min-w-0">
                              UGX {formatAmount(String(annualBasedFee || 0))}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 px-2 py-4">
                          <div className="min-w-0">
                            UGX {formatAmount(String(amount || 0))}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                              status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Total paid row */}
                  <TableRow>
                    <TableCell
                      className="text-gray-700 font-medium px-2 py-4 text-right"
                      colSpan={4}
                    >
                      Total paid
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium px-2 py-4">
                      <div className="min-w-0">
                        UGX{" "}
                        {formatAmount(String(statsData?.data?.totalPaid || 0))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 px-2 py-4"></TableCell>
                  </TableRow>

                  {/* Total Add-on fees due row */}
                  <TableRow className="border-t-2">
                    <TableCell
                      className="text-gray-700 font-medium px-2 py-4 text-right"
                      colSpan={4}
                    >
                      Total Add-on fees due
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium px-2 py-4">
                      <div className="min-w-0">
                        UGX {formatAmount(String(statsData?.data.total || 0))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 px-2 py-4"></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default BfBeneficiarySubscriptionCalculationTable;
