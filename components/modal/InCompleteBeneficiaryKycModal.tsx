"use client";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomDialog from "../custom/CustomDialog";
import Image from "next/image";
import AuthButton from "../button/AuthButton";
import { useParams, useRouter } from "next/navigation";

const InCompleteBeneficiaryKycModal = () => {
  const { modals } = useSettingModal();
  const groupId = useParams()?.groupId as string;
  const bfId = useParams()?.bfId as string;
  const { toggleModal, closeModal } = useSettingModal();

  const router = useRouter();

  return (
    <CustomDialog
      open={modals?.inCompleteBeneficiaryKycModal}
      close={() => {
        closeModal("inCompleteBeneficiaryKycModal");
      }}
      name="inCompleteBeneficiaryKycModal"
      contentClassName="sm:max-w-[525px] max-h-[70dvh]  overflow-y-auto py-10 z-[55] bg-white"
    >
      <div className="flex flex-col items-center  justify-center">
        <Image
          src={`/assets/images/icons/bell.svg`}
          className="h-[150px] w-auto"
          width={200}
          height={200}
          alt="bell logo"
        />
        <h1 className="mt-4 text-xl font-medium text-center">
          Oops! Beneficiary yet to complete Kyc
        </h1>

        <p className="text-center mb-6 px-10 mt-4">
          You {"can't"} add this user as a beneficiary because their KYC is
          incomplete. Please remind them to complete their verification before
          proceeding.
        </p>

        <div className=" w-full flex flex-col gap-2">
          <AuthButton
            text="Add Other Beneficiaries"
            handleClick={() => {
              closeModal("inCompleteBeneficiaryKycModal");
              toggleModal("addBeneficiaryModal", {
                fundId: bfId,
                manual: false,
                state: 1,
              });
            }}
          />
          <AuthButton
            text="Continue to Payments"
            handleClick={() => {
              router.push(
                `/bf/principal-settings/${groupId}/${bfId}/my-payments`
              );
              closeModal("inCompleteBeneficiaryKycModal");
            }}
            className=" bg-transparent text-primary border border-primary"
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default InCompleteBeneficiaryKycModal;
