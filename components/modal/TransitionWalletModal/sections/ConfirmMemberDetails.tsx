"use client";

import { createTransitionMember } from "@/api/bereavement-fund/transition";
import { useSettingModal } from "@/contexts/modal-setting";
import { queryClient } from "@/contexts/ProviderWrapper";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

const ConfirmMemberDetails: React.FC<{
  next: () => void;
  back: () => void;
  handleToggleModal: () => void;
}> = ({ back, handleToggleModal, next }) => {
  const { modalData } = useSettingModal();

  const bfId = useParams()?.bfId as string;
  const user = modalData?.transitionWalletModal?.user;
  const fileUrl = modalData?.transitionWalletModal?.fileUrl;
  const dateJoined = modalData?.transitionWalletModal?.dateJoined;
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createTransitionMember(bfId, {
        userId: user?.id as string,
        note: modalData?.transitionWalletModal?.note,
        amount: Number(modalData?.transitionWalletModal?.amount),
        documentUrl: fileUrl || "Null",
        dateJoined: dateJoined || "",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTransitionMember", bfId],
      });

      next();
    },
    onError: (data) => {
      toast.error(JSON.stringify(data));
    },
  });

  const disabled = isPending;

  return (
    <>
      <div className=" max-h-[70vh] w-full overflow-x-auto">
        <div className=" relative ">
          <div className="flex  p-6   flex-col   absolute top-0 right-0 w-full mb-4">
            <div className="justify-end flex w-full pb-6">
              <button
                className="text-gray-500 hover:text-gray-700 w-[32px] h-[32px]  flex items-center justify-center bg-white rounded-full"
                onClick={() => handleToggleModal()}
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-start">
            <h2 className="text-xl font-bold">Confirm Transition wallet</h2>
            <p className="text-[14px] text-divider-200 mb-6">
              Please note, once a transition wallet has been posted it has been
              automattically locked and cannot be edited. Kindly confirm below
              your submission.
            </p>
          </div>
          <div className="border border-gray-400 rounded-md p-4 mb-6 space-y-2">
            <p className="text-sm text-gray-800 font-medium">
              Member’s name:{" "}
              <span className="font-normal">
                {user?.firstName} {user?.lastName}
              </span>
            </p>

            <p className="text-sm text-gray-800 font-medium">
              Opening Balance: <span className="font-normal">UGX 4,000</span>
            </p>
            <p className="text-sm text-gray-800 font-medium">
              Transition Note:{" "}
              <span className="font-normal">
                {modalData?.transitionWalletModal?.note || "Null"}
              </span>
            </p>
            <p className="text-sm text-gray-800 font-medium">
              Date Joined:{" "}
              <span className="font-normal">
                {modalData?.transitionWalletModal?.dateJoined || "Null"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-end bg-white p-3 gap-3">
          <button
            className="px-8 py-2 text-primary bg-white rounded-md border border-gray-600"
            onClick={back}
            disabled={disabled}
          >
            Go Back
          </button>
          <button
            className="px-8 py-2 bg-primary text-white rounded-md"
            onClick={() => mutate()}
            disabled={disabled}
          >
            Confirm & Submit {isPending ? "..." : ""}
          </button>
        </div>
        <button
          className="flex justify-center text-center mx-auto mb-6"
          onClick={() => next()}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default ConfirmMemberDetails;
