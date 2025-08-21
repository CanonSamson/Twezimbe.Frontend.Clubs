"use client";

import { useRouter } from "next/navigation";
import { DialogDescription, DialogHeader } from "../ui/dialog";
import { BsHash } from "react-icons/bs";
import { GoChevronRight } from "react-icons/go";
import Lottie from "react-lottie";
import * as loadingAnimationData from "../../public/assets/animations/loading.json";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomDialog from "../custom/CustomDialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

const DetailsUpdatedModal = () => {
  const router = useRouter();
  const { toggleModal, modalData } = useSettingModal();

  const data = modalData?.detailsUpdatedModal
  const isPending = !!data?.isPending 
  const conpleted = !!data?.completed 
  const nextRoute = data?.nextRoute

  const handleContinue = () => {
    if (data?.handleContinue) {
      data.handleContinue();
      return;
    } else {
      if (nextRoute) {
        router.push(nextRoute);
      }
      toggleModal("detailsUpdatedModal", null);
    }
  };

  return (
    <CustomDialog
      close={() => {}}
      name="detailsUpdatedModal"
      contentClassName="max-tablet:max-w-[calc(100%-32px)] max-tablet:mx-auto max-tablet:px-4 max-tablet:py-6 sm:max-w-[525px] py-10 bg-white max-tablet:rounded-t-xl max-tablet:rounded-br-xl max-tablet:fixed max-tablet:bottom-0"
    >
      <DialogHeader className="text-center mt-10">
        <div className="flex-1 w-full justify-center flex">
          <Image
            className="w-[30%] max-w-[150px] h-auto object-contain mx-auto rounded-[5px]"
            src="/assets/images/icons/check.svg"
            alt="Success icon"
            width={0}
            height={0}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 30vw, 150px"
          />
        </div>
        <div className="pt-4">
          <DialogTitle className="text-center text-xl font-bold">
            {conpleted
              ? "Congratulations 🎉"
              : data?.title
              ? data?.title
              : "Great"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center">
            {conpleted
              ? "Your KYC verification has been successfully completed. You now have full access to Twezimbe and can enjoy all our features seamlessly."
              : data?.description}
          </DialogDescription>
        </div>
      </DialogHeader>
      <div className="flex flex-col mt-5">
        <button
          onClick={handleContinue}
          className="flex items-center w-full p-4 py-6 justify-between bg-primary text-white hover:bg-primary-dark transition-colors"
          disabled={isPending}
        >
          <div className="flex items-center gap-4">
            <BsHash size={24} />
            <div className="flex flex-col">
              <span>
                {conpleted
                  ? "Finish"
                  : data?.buttonText
                  ? data?.buttonText
                  : nextRoute
                  ? "Continue"
                  : "Close"}
              </span>
            </div>
          </div>
          <div>
            {isPending ? (
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: loadingAnimationData,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
                height={44}
                width={44}
              />
            ) : (
              <>
                {nextRoute ? (
                  <GoChevronRight size={24} />
                ) : (
                  <IoMdClose size={24} />
                )}
              </>
            )}
          </div>
        </button>
      </div>
    </CustomDialog>
  );
};

export default DetailsUpdatedModal;
