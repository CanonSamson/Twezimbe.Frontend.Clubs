"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransitionMemberData } from "@/api/bereavement-fund/transition";
import { useQuery } from "@tanstack/react-query";
import { formatAmount } from "@/utils/functions/formatAmount";

const TransitionFundModal = () => {
  const groupId = useParams()?.groupId as string;
  const bfId = useParams().bfId as string;
  const { modals, closeModal, modalData } = useSettingModal();

  const bf = modalData?.transitionFundModal;
  const router = useRouter();

  const handleReview = () => {
    if (bf.id || bfId) {
      router.push(
        `/bf/principal-settings/${groupId}/${bf.id || bfId}/transition-wallet`
      );
    }
    closeModal("transitionFundModal");
  };

  const handleExit = () => {
    closeModal("transitionFundModal");
  };

  const { data: transitionData } = useQuery({
    queryKey: ["getTransitionMemberDataT", bfId],
    queryFn: () => (bf ? getTransitionMemberData(bfId) : null),
  });

  return (
    <div
      className={`${
        modals.transitionFundModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-30`}
      onClick={handleExit}
    >
      <div
        className="bg-white w-full max-w-[500px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleExit}
          className="absolute top-4 right-4 text-divider-200"
        >
          <IoMdClose size={24} />
        </button>

        <div className="flex flex-col mt-6">
          <h1 className="text-2xl font-bold mb-2">
            Opening Balance {bf?.name}
          </h1>
          <p className="mb-4 text-[12px] text-gray-600">
            Your Fund Admin has added your opening balance for My First Fund
          </p>

          <div className="w-full border mt-8 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-left w-1/2">Item</TableHead>
                  <TableHead className="text-right w-1/2">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b">
                  <TableCell className="text-left text-gray-700 font-medium p-4">
                    Opening Balance
                  </TableCell>
                  <TableCell className="text-right text-gray-500 p-4">
                    UGX{" "}
                    {formatAmount(
                      String(transitionData?.data.data.amount || 0)
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="w-full border mt-8 mb-6 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-left w-full">
                    Transition Comment
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b">
                  <TableCell className="text-left text-gray-500 font-medium p-4">
                    {transitionData?.data.data?.note || "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="w-full">
            <button
              onClick={handleReview}
              className="w-full flex items-center justify-center bg-primary text-white px-6 py-3 mb-4 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="relative left-2">Review</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitionFundModal;
