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
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getBeneficialPrincipals } from "@/api/bereavement-fund/dashboard";
import { useParams } from "next/navigation";

// Simplified table headers - removed financial data
const TableHeads = [
  { id: "firstName", name: "First Name", align: "text-left" },
  { id: "lastName", name: "Last Name", align: "text-left" },
  {
    id: "username",
    name: "Username",
    align: "hidden tablet-lg:table-cell text-left",
  },
  {
    id: "createdAt",
    name: "Date Joined",
    align: "hidden tablet-lg:table-cell text-left",
  },
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

const BeneficiaryPrincipalTable = () => {
  const bfId = useParams()?.bfId as string;

  const { data, isLoading } = useQuery({
    queryKey: ["beneficial-principals", bfId],
    queryFn: () => getBeneficialPrincipals(bfId),
    enabled: true,
  });

  const hasPrincipals = data && data.data.principals.length > 0;

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
        {/* Removed export button as beneficiaries likely don't need to export principal data */}
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
            data.data.principals?.map((principal) => (
              <TableRow key={principal?.id}>
                <TableCell className=" px-2 py-2 text-left">
                  {principal?.firstName}
                </TableCell>
                <TableCell className=" px-2 py-2 text-left">
                  {principal?.lastName}
                </TableCell>
                <TableCell className=" px-2 py-2 hidden tablet-lg:table-cell">
                  @{principal?.userName}
                </TableCell>
                <TableCell className=" px-2 py-2 hidden tablet-lg:table-cell">
                  {principal?.createdAt
                    ? new Date(principal?.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BeneficiaryPrincipalTable;
