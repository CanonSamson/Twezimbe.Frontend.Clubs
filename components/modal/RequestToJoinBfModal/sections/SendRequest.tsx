import { sendBfRequest } from "@/api/bereavement-fund/fund";
import AuthButton from "@/components/button/AuthButton";
import CustomTextarea from "@/components/input/CustomTextarea";
import { useSettingModal } from "@/contexts/modal-setting";
import { fetchGroup } from "@/lib/features/groups/groupSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SendRequest = () => {
  const { modalData, toggleModal, updateModalData } = useSettingModal();
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);

  const bf = modalData?.requestToJoinBfModal?.bf;

  const groupId = useParams()?.groupId as string;

  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sendBfRequest(
        {
          message: message,
        },
        bf.id
      ),
    onSuccess: () => {
      dispatch(fetchGroup({ groupId }));
      updateModalData("requestToJoinBfModal", {
        bf,
        state: 2,
      });
      toggleModal("requestToJoinBfModal", null);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to send request";

      if (
        errorMessage == "You need to complete your KYC to request for a fund"
      ) {
        toggleModal("bfKycRequiredModal");

        return ;
      }

      console.log(error?.message, "error?.message");
      if (errorMessage === "You have already requested this fund") {
        updateModalData("requestToJoinBfModal", {
          bf,
          state: 2,
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please write a message to the fund managers");
      return;
    }

    if (!agreed) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    mutate();
  };
  return (
    <>
      <div className="flex flex-col  items-start ">
        <h2 className="text-xl line-clamp-1 md:text-2xl font-extrabold text-[#1D1C1D]">
          Join {bf?.name}
        </h2>
        <p className="text-sm md:text-base line-clamp-2 font-medium text-[#49454FCC] mt-1">
          Send a request to join {bf?.name}.
        </p>
      </div>

      <div className="w-full mt-4 md:mt-6">
        <form className="rounded-[10px] space-y-4 md:space-y-6 w-full">
          <div className="w-full">
            <label
              htmlFor="message"
              className="block text-sm md:text-base font-medium"
            >
              Write A Message
            </label>
            <CustomTextarea
              id="message"
              placeholder="Introduce yourself to the fund managers and tell them why you want to join this fund"
              className="mt-2"
              textareaClassName="bg-divider-100   max-h-32 text-base align-top w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label
              htmlFor="terms"
              className="text-xs md:text-sm text-[#49454FCC] font-medium"
            >
              I agree to abide by the Terms and Conditions of this fund and the
              overall terms and conditions of the twezi platform
            </label>
          </div>
        </form>
      </div>

      <div className="mt-6 md:mt-8 w-full">
        <AuthButton
          handleClick={handleSubmit}
          disabled={!agreed}
          isLoading={isPending}
          text="Send Request"
        />
      </div>
    </>
  );
};

export default SendRequest;
