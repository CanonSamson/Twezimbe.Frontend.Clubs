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
import { useParams } from "next/navigation";
import { useSettingModal } from "@/contexts/modal-setting";
import { useQuery } from "@tanstack/react-query";
import { getFundBeneficiaries } from "@/api/bereavement-fund/beneficiary";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserNameInitials } from "@/utils/functions/getNameInitials";
import moment from "moment";
import Image from "next/image";
const LoadingRow = () => (
  <TableRow className="border-b">
    <TableCell className="p-2 flex items-center gap-3 max-tablet-lg:text-start max-tablet-lg:pt-4">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <Skeleton className="h-4 w-[120px]" />
    </TableCell>
    <TableCell className="p-2 max-tablet-lg:hidden">
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
    <TableCell className="p-2 max-tablet-lg:text-center max-tablet-lg:pt-4">
      <Skeleton className="h-4 w-[90px] mx-auto" />
    </TableCell>
    <TableCell className="p-2 max-tablet-lg:hidden">
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
  </TableRow>
);
const BeneficiaryTable = ({}: { fundId?: string }) => {
  const bfId = useParams()?.bfId as string;
  const { toggleModal } = useSettingModal();
  const { data, isLoading } = useQuery({
    queryKey: ["user-beneficiaries-table", bfId],
    queryFn: () => getFundBeneficiaries(bfId),
    enabled: bfId != "undefined",
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return (
      <Card className="p-2 tablet-lg:p-10 mt-6 rounded-none bg-white">
        <div className="flex justify-between items-start mb-4 mt-3 tablet-lg:mt-0">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-[#101828]">Beneficiaries</h2>
          </div>
          <Button
            className="text-white rounded-full p-1 size-[22px] tablet-lg:rounded-md tablet-lg:size-auto tablet-lg:px-4 tablet-lg:py-2"
            size="icon"
          >
            <GoPlusCircle className="size-[24px] tablet-lg:size-[40px]" />
            <span className="max-tablet-lg:hidden ml-2">Add Beneficiaries</span>
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="max-tablet-lg:text-start max-tablet-lg:pb-4">
                Name
              </TableHead>
              <TableHead className="max-tablet-lg:hidden">Username</TableHead>
              <TableHead className="max-tablet-lg:text-center max-tablet-lg:pb-4">
                Relationship
              </TableHead>
              <TableHead className="max-tablet-lg:hidden">
                Date of Birth
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, idx) => (
              <LoadingRow key={idx} />
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }
  const hasBeneficiaries =
    data?.data?.beneficiaries && data?.data.beneficiaries.length > 0;
  return (
    <Card className="p-2 tablet-lg:p-10 mt-6 rounded-none bg-white">
      <div className="flex justify-between items-start mb-4 mt-3 tablet-lg:mt-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-[#101828]">Beneficiaries</h2>
        </div>
        <Button
          className="text-white rounded-full p-1 size-[22px] tablet-lg:rounded-md tablet-lg:size-auto tablet-lg:px-4 tablet-lg:py-2"
          size="icon"
          onClick={() =>
            toggleModal("addBeneficiaryModal", {
              fundId: bfId,
              manual: false,
              state: 1,
            })
          }
        >
          <GoPlusCircle className="size-[24px] tablet-lg:size-[40px]" />
          <span className="max-tablet-lg:hidden ml-2">Add Beneficiaries</span>
        </Button>
      </div>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="max-tablet-lg:text-start max-tablet-lg:pb-4">
              Name
            </TableHead>
            <TableHead className="max-tablet-lg:hidden">Username</TableHead>
            <TableHead className="max-tablet-lg:text-center max-tablet-lg:pb-4">
              Relationship
            </TableHead>
            <TableHead className="max-tablet-lg:hidden">
              Date of Birth
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasBeneficiaries ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                <div className="flex justify-center items-center">
                  <p className="text-gray-500">No beneficiaries found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data?.data.beneficiaries.map((beneficiary) => {
              const birthDate = moment(beneficiary?.dateOfBirth).format(
                "MMM D, YYYY"
              );
              return (
                <TableRow key={beneficiary.id}>
                  <TableCell className="p-2 flex items-center gap-3 max-tablet-lg:text-start max-tablet-lg:pt-4">
                    {beneficiary?.profileImage ? (
                      <Image
                        className="w-10 h-10 rounded-full object-cover bg-primary/10"
                        src={beneficiary.profileImage}
                        alt={`${beneficiary.firstName} ${beneficiary.lastName}`}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {getUserNameInitials(
                          beneficiary.firstName,
                          beneficiary.lastName
                        )}
                      </div>
                    )}
                    <span>
                      {beneficiary.firstName} {beneficiary.lastName}
                    </span>
                  </TableCell>
                  <TableCell className="p-2 max-tablet-lg:hidden">
                    {beneficiary.userName || "N/A"}
                  </TableCell>
                  <TableCell className="p-2 max-tablet-lg:text-center max-tablet-lg:pt-4">
                    {beneficiary.relationship}
                  </TableCell>
                  <TableCell className="p-2 max-tablet-lg:hidden">
                    {birthDate}
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
export default BeneficiaryTable;
