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
import PaginationPage from "./PaginationPage";
import { useState } from "react";
import { useSettingModal } from "@/contexts/modal-setting";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { getBfCaseDisbursement } from "@/api/bereavement-fund/cases-disbursement";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "sonner";
import { formatAmount } from "@/utils/functions/formatAmount";

const TableHeads = [
  { id: "name", name: "Name" },
  { id: "affectedPerson", name: "Affected Person" },
  { id: "status", name: "Status" },
  { id: "benefitsPayable", name: "Benefits Payable" },
  { id: "totalContributions", name: "Total Contributions" },
  { id: "dateCreated", name: "Date Created" },
  { id: "claimStatus", name: "Claim Status" },
  { id: "actions", name: "Actions" },
];

  const LoadingRow = () => (
    <TableRow className="border-b">
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
        <div className="tablet-lg:hidden">
          <Skeleton className="h-4 w-[100px] mt-2" />
        </div>
      </TableCell>
      <TableCell className="hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell className="hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell className="hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell className="hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-9 w-[80px]" />
      </TableCell>
    </TableRow>
  );


const DisbursementTable = ({
  title,
  fundId,
  filters,
}: {
  title: string;
  fundId?: string;
  filters?: { [key: string]: any };
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const bfId = useParams()?.bfId as string;

  const { toggleModal } = useSettingModal();
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getBfCaseDisbursement", fundId || bfId],
    queryFn: () => getBfCaseDisbursement(fundId || bfId, filters),
    enabled: !!fundId || !!bfId,
  });

  const hasDisbursements =
    data?.data?.data?.disbursements &&
    data?.data?.data?.disbursements.length > 0;

  console.log(data, "data-data");


  return (
    <Card className="p-2 tablet-lg:p-10 mt-6 rounded-none bg-white">
      <div className="flex justify-between items-start mb-4 mt-3 tablet-lg:mt-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-[#101828]">{title}</h2>
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
            {TableHeads.map((head) => {
              const isVisibleOnSmall = [
                "name",
                "caseStatus",
                "actions",
              ].includes(head.id);
              let alignmentClass = "text-left";
              if (head.id === "caseStatus") {
                alignmentClass = "text-center tablet-lg:text-left";
              } else if (head.id === "actions") {
                alignmentClass = "text-end tablet-lg:text-left";
              }
              return (
                <TableHead
                  key={head.id}
                  className={`${
                    !isVisibleOnSmall ? "hidden tablet-lg:table-cell" : ""
                  } ${alignmentClass}`}
                >
                  {head.name}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(3)].map((_, index) => <LoadingRow key={index} />)
          ) : !hasDisbursements ? (
            <TableRow>
              <TableCell
                colSpan={TableHeads.length}
                className="text-center py-4"
              >
                <div className="flex justify-center items-center">
                  <p className="text-gray-500">No disbursements found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.data?.data.disbursements.map((disbursement) => {
              const caseItem = disbursement?.case;

              return (
                <TableRow key={caseItem.id} className="cursor-pointer">
                  <TableCell>
                    <div className=" py-3 tablet-lg:py-1">
                      {caseItem?.caseName}
                      <div className="tablet-lg:hidden text-sm text-gray-500 mt-1">
                        {new Date(disbursement.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="max-tablet-lg:hidden tablet-lg:table-cell">
                    {caseItem?.beneficiary?.firstName}{" "}
                    {caseItem?.beneficiary?.lastName }
                    
                  </TableCell>

                  <TableCell className="hidden capitalize tablet-lg:table-cell">
                    {caseItem.reason}
                  </TableCell>

                  <TableCell className="hidden tablet-lg:table-cell">
                    -
                  </TableCell>
                  <TableCell className="hidden tablet-lg:table-cell">
                    UGX {formatAmount(String(caseItem.totalcontributions || 0))}
                  </TableCell>

                  <TableCell className="hidden tablet-lg:table-cell">
                    {new Date(disbursement.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </TableCell>

                  <TableCell
                    className={`${
                      caseItem.status === "PENDING"
                        ? "text-orange-500"
                        : caseItem.status === "APPROVED"
                        ? "text-green-500"
                        : "text-red-500"
                    } text-center tablet-lg:text-left`}
                  >
                    {caseItem.status === "PENDING"
                      ? "Pending"
                      : caseItem.status === "APPROVED"
                      ? "Approved"
                      : caseItem.status === "REJECTED"
                      ? "Closed"
                      : caseItem.status}
                  </TableCell>

                  <TableCell className="relative">
                    <div className="w-full flex justify-end tablet-lg:justify-start">
                      <Button
                        onClick={() =>
                          toggleModal("caseDisbursementModal", {
                            case: caseItem,
                            disbursement,
                            state: 1,
                          })
                        }
                        variant="outline"
                        className="rounded-full py-3 mr-2 
                     tablet-lg:rounded-md tablet-lg:mr-0 tablet-lg:py-2"
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {hasDisbursements && (
        <div className="flex justify-end w-full pt-6">
          <PaginationPage
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            data={data.data?.data.disbursements}
            pageSize={10}
            className="flex justify-end"
          />
        </div>
      )}
    </Card>
  );
};

export default DisbursementTable;
