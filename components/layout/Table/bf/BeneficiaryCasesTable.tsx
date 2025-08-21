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
import { GoPlusCircle } from "react-icons/go";
import PaginationPage from "../PaginationPage";
import { useEffect, useState } from "react";
import { useSettingModal } from "@/contexts/modal-setting";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getBfUserCases } from "@/api/bereavement-fund/file-case";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "@/contexts/user";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    setMatches(media.matches);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

const TableHeads = [
  { id: "name", name: "Name" },
  { id: "affectedPerson", name: "Affected Person" },
  { id: "status", name: "Status" },
  { id: "benefitsPayable", name: "Benefits Payable" },
  { id: "totalContributions", name: "Total Contributions" },
  { id: "dateCreated", name: "Date Created" },
  { id: "caseStatus", name: "Case Status" },
  { id: "actions", name: "Actions" },
];

const BeneficiaryCasesTable = ({
  title,
  filters,
}: {
  title: string;
  fundId?: string;
  filters?: { [key: string]: any };
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const bfId = useParams()?.bfId as string;
  const { groupId } = useParams();

  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );

  const { toggleModal } = useSettingModal();
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user-cases", bfId],
    queryFn: () =>
      getBfUserCases(bfId, { beneficiaryId: currentUser?.id, ...filters }),
    enabled: !!bfId,
  });

  const router = useRouter();

  const hasCases =
    data?.data?.data?.cases && data?.data?.data?.cases.length > 0;

  const getStatusColor = (reason: string) => {
    switch (reason?.toLowerCase()) {
      case "sick":
        return "text-green-600";
      case "dead":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };


  const getCaseStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "text-orange-600";
      case "approved":
        return "text-green-600";
      case "closed":
        return "text-gray-600";
      default:
        return "text-orange-600";
    }
  };

  const LoadingRow = () => (
    <TableRow className="border-b">
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
        <div className="tablet-lg:hidden">
          <Skeleton className="h-4 w-[100px] mt-2" />
        </div>
      </TableCell>
      <TableCell className="py-2 px-2 hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell className="py-2 px-2 hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell className="py-2 px-2 hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell className="py-2 px-2 hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell className="py-2 px-2 hidden tablet-lg:table-cell">
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell className="py-2 px-2 hidden tablet-lg:table-cell">
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
          className="
      text-white rounded-full p-1 bg-primary hover:bg-primary/90 focus:bg-primary/90
      focus:ring-2 focus:ring-primary focus:ring-offset-2
      focus:outline-none
      transition-colors duration-200
      size-[22px]
      tablet-lg:rounded-md tablet-lg:size-auto tablet-lg:px-4 tablet-lg:py-2
    "
          size="icon"
          onClick={() => toggleModal("filePrincipalCaseModal")}
        >
          <GoPlusCircle className="size-[24px] tablet-lg:size-[40px]" />
          <span className="max-tablet-lg:hidden ml-2">Request Support </span>
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
              let alignmentClass = "text-left font-medium text-gray-700";
              if (head.id === "caseStatus") {
                alignmentClass =
                  "text-center tablet-lg:text-left font-medium text-gray-700";
              } else if (head.id === "actions") {
                alignmentClass =
                  "text-end tablet-lg:text-left font-medium text-gray-700";
              }
              return (
                <TableHead
                  key={head.id}
                  className={`${
                    !isVisibleOnSmall ? "hidden tablet-lg:table-cell" : ""
                  } ${alignmentClass} py-3`}
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
          ) : !hasCases ? (
            <TableRow>
              <TableCell
                colSpan={TableHeads.length}
                className="text-center py-4"
              >
                <div className="flex justify-center items-center">
                  <p className="text-gray-500">No cases found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.data?.data.cases.map((caseItem) => (
              <TableRow
                key={caseItem.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>
                  <div className="py-3 tablet-lg:py-1">
                    <span className="text-gray-900 font-medium">
                      {caseItem?.caseName}
                    </span>
                    <div className="tablet-lg:hidden text-sm text-gray-500 mt-1">
                      {new Date(caseItem.createdAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-2 px-2 hidden tablet-lg:table-cell text-gray-700">
                  {caseItem.beneficiary.firstName}{" "}
                  {caseItem.beneficiary.lastName}
                </TableCell>

                <TableCell className="py-2 px-2 hidden tablet-lg:table-cell">
                  <span className={getStatusColor(caseItem.reason || "Sick")}>
                    {caseItem.beneficiaryStatus || "Sick"}
                  </span>
                </TableCell>

                <TableCell className="py-2 px-2 hidden tablet-lg:table-cell text-gray-700">
                  UGX {caseItem.benefitsPayable?.toLocaleString() || "0"}
                </TableCell>

                <TableCell className="py-2 px-2 hidden tablet-lg:table-cell text-gray-700">
                  UGX {caseItem.totalContributions?.toLocaleString() || "0"}
                </TableCell>

                <TableCell className="py-2 px-2 hidden tablet-lg:table-cell text-gray-500">
                  {new Date(caseItem.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell
                  className={`${getCaseStatusColor(
                    caseItem.status
                  )} text-center tablet-lg:text-left font-medium`}
                >
                  {caseItem.status === "PENDING"
                    ? "Pending"
                    : caseItem.status === "APPROVED"
                    ? "Approved"
                    : caseItem.status === "REJECTED"
                    ? "Closed"
                    : caseItem.status}
                </TableCell>

                <TableCell className="py-2 px-2 relative">
                  <div className="w-full flex justify-end tablet-lg:justify-start">
                    {isMobile ? (
                      <Button
                        variant="outline"
                        className="rounded-full py-3 mr-2 tablet-lg:rounded-md tablet-lg:mr-0 tablet-lg:py-2 text-gray-600 border-gray-300"
                        onClick={() =>
                          router.push(
                            `/bf/${groupId}/${bfId}/preview-case?caseId=${caseItem.id}`
                          )
                        }
                      >
                        View
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="rounded-full py-3 mr-2 tablet-lg:rounded-md tablet-lg:mr-0 tablet-lg:py-2 text-gray-600 border-gray-300 hover:bg-gray-50"
                          >
                            View
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white shadow-md border border-gray-200 rounded-md"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              toggleModal("fileCaseReviewModal", {
                                case: caseItem,
                                isBeneficiary: true,
                              })
                            }
                          >
                            Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {hasCases && (
        <div className="flex justify-end w-full pt-6">
          <PaginationPage
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            data={data.data?.data.cases}
            pageSize={10}
            className="flex justify-end"
          />
        </div>
      )}
    </Card>
  );
};

export default BeneficiaryCasesTable;
