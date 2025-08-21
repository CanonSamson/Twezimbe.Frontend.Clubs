"use client";

import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSettingModal } from "@/contexts/modal-setting";
import {
  beneficiaryMethodOptions,
  BeneficiaryTypeTypes,
} from "@/utils/data/beneficiary";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addManualBeneficiary,
  addUserBeneficiary,
  calculateBeneficiaryRiskProfile,
} from "@/api/bereavement-fund/beneficiary";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { queryClient } from "@/contexts/ProviderWrapper";
import NativeCustomSelect from "@/components/input/NativeCustomSelect";
import CustomAvatar from "@/components/custom/CustomAvatar";
import moment from "moment";

const relationshipValidationSchema = yup.object({
  relationship: yup.string().required("Relationship is required"),
});

const AddRelationship = () => {
  const { toggleModal, modalData, closeModal } = useSettingModal();
  const bfId = useParams()?.bfId as string;
  const modalD = modalData.addBeneficiaryModal;

  const formValues = modalData?.addBeneficiaryModal?.formValues;
  const isManual = modalData?.addBeneficiaryModal?.manual;
  const user = modalData?.addBeneficiaryModal?.user;

  const { values, setFieldValue, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      relationship: "",
    },
    validationSchema: relationshipValidationSchema,
    onSubmit: () => {
      if (!values.relationship) {
        toast.error("Please select a relationship");
        return;
      }
      if ((modalD?.user?.id as string) == "undefined" && !isManual) {
        toast.error("Please select a user");
        return;
      }
      beneficiaryMutate();
    },
  });

  const dataOfBirth = formValues?.dataOfBirth
    ? new Date(formValues?.dataOfBirth)?.toISOString()
    : null;

  const age =
    formValues?.dataOfBirth && moment(formValues.dataOfBirth).isValid()
      ? moment().diff(moment(formValues.dataOfBirth), "years")
      : null;

  const { mutate: beneficiaryMutate, isPending } = useMutation({
    mutationKey: ["addBeneficiary"],
    mutationFn: () => {
      const fundId = modalD?.fundId || bfId;
      if (isManual) {
        return addManualBeneficiary(fundId, {
          firstName: formValues?.firstName,
          lastName: formValues?.lastName,
          relationship: values.relationship,
          phoneNumber: formValues?.phoneNumber,
          email: formValues?.email,
          dateOfBirth: dataOfBirth as string,
        });
      }
      return addUserBeneficiary(fundId, {
        relationship: values.relationship,
        beneficiaryId: modalD?.user?.id as string,
      });
    },
    onSuccess: () => {
      toast.success("Beneficiary added successfully");

      queryClient.invalidateQueries({
        queryKey: ["user-beneficiaries", bfId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-beneficiaries-table", bfId],
      });

      queryClient.invalidateQueries({
        queryKey: ["bf-pending-subscription-stats", bfId],
      });

      closeModal("addBeneficiaryModal");
      setTimeout(() => {
        toggleModal("pendingPaymentModal", {force: true});
      }, 600);
    },
    onError: (data: any) => {
      // inCompleteBeneficiaryKycModal

      if (data?.askForKyc) {
        toggleModal("inCompleteBeneficiaryKycModal", {
          user: modalD?.user,
          fundId: modalD?.fundId || bfId,
        });
        return;
      } else {
        toast.error(
          data.message || JSON.stringify(data) || "Failed to add beneficiary"
        );
      }
    },
  });

  const { data: riskProfileData } = useQuery({
    queryKey: [
      "calculateBeneficiaryRiskProfile",
      bfId,
      dataOfBirth,
      modalD?.user?.id as string,
    ],

    queryFn: () => {
      if (!bfId || ((modalD?.user?.id as string) === "undefined" && !age)) {
        return null;
      }
      return calculateBeneficiaryRiskProfile(bfId, {
        beneficiaryUserId: modalD?.user?.id ? modalD?.user?.id : "dataOfBirth",
        age: age ? age : null,
      });
    },
    enabled: Boolean(modalD?.user?.id || formValues?.dataOfBirth),
  });

  const handleToggleModal = () => {
    closeModal("addBeneficiaryModal");
  };
  const riskProfile = riskProfileData?.data;

  return (
    <>
      <div className="flex max-tablet-lg:justify-center tablet-lg:justify-between items-center mb-4">
        <h2 className="text-xl font-extrabold">Beneficiary details</h2>
      </div>

      <div className=" pb-4">
        <div className="mt-5 py-2 px-2 rounded-[10px] bg-[#f5f5f5] flex justify-start items-center gap-4">
          <div className="flex w-full justify-between gap-4">
            <div className=" flex-1 flex items-center gap-2">
              <div className="pt-1">
                <CustomAvatar
                  image={formValues?.profileImage || user?.profileImage}
                  userFullName={`${formValues?.firstName || user?.firstName} ${
                    formValues?.lastName || user?.lastName
                  }`}
                  className="relative top-0"
                  imageClassName="w-[50px] h-[50px] rounded-[10px] border overflow-hidden object-top text-[32px] font-bold text-primary"
                  labelClassName="flex w-[50px] h-[50px] items-center justify-center overflow-hidden rounded-[10px]"
                  alt="profile image"
                  showText={false}
                  disabled={true}
                  isCurrentUser={false}
                  iconClassName="size-[28px]"
                />
              </div>
              <div className="flex flex-col justify-start items-start">
                <p className="font-medium text-base leading-[150%] tracking-[0.03px] text-[#1d1c1d]">
                  {formValues?.firstName || user?.firstName}{" "}
                  {formValues?.lastName ||
                    user?.lastName ||
                    "name not available"}
                </p>
                <p className="font-normal text-[13px] leading-[150%] tracking-[0.03px] text-[#1d1c1d]">
                  {formValues?.userName || user?.userName
                    ? `@${formValues?.userName || user?.userName}`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className=" text-[12px] font-normal text-[#1d1c1d] flex flex-col items-start justify-center">
              <p>
                {riskProfile?.data?.age && riskProfile?.data?.age <= 0
                  ? "less then a year"
                  : `${riskProfile?.data?.age || age} years`}
              </p>
              <p className=" text-[#185F34] font-medium">
                {riskProfile?.data?.ageCategory} ( Risk:{" "}
                {riskProfile?.data?.riskProfile}%)
              </p>
            </div>
          </div>
        </div>
      </div>
      <>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <NativeCustomSelect
                selectTriggerClassName="bg-divider-100 "
                label="Relationship"
                options={beneficiaryMethodOptions}
                placeholder="Select relationship"
                showStar={true}
                value={values.relationship}
                onChange={(value) =>
                  setFieldValue("relationship", value as BeneficiaryTypeTypes)
                }
                error={touched?.relationship && errors?.relationship}
              />
            </div>
          </div>

          <div className="mt-9 w-full flex justify-end items-center gap-4">
            <button
              onClick={() => handleToggleModal()}
              type="button"
              className="py-3 px-6 border duration-500 transition-all border-[#969696] rounded-md text-primary hover:border-primary  "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`py-3 px-6 bg-primary rounded-md text-white duration-500 transition-all filter hover:brightness-125 `}
            >
              {isPending ? "Add ..." : "Add"}
            </button>
          </div>
        </form>
      </>
    </>
  );
};

export default AddRelationship;
