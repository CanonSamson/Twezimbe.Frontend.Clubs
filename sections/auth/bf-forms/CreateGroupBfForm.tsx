"use client";

import React, { useEffect, useState } from "react";

// assets
import CustomTextInput from "@/components/input/CustomTextInput";
import AuthButton from "@/components/button/AuthButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import CustomTextarea from "@/components/input/CustomTextarea";
import CustomSelect from "@/components/input/CustomSelect";
import BfCreatedModal from "@/components/modal/BfCreatedModal";
import { useSettingModal } from "@/contexts/modal-setting";
import { createBf } from "@/api/bereavement-fund";
import { getBanks } from "@/api/bank";
import { fetchBasicUserInfo } from "@/lib/features/kyc/basicUserInfoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import CustomCountrySelect from "@/components/input/CustomCountrySelect";

// ============================|| AWS CONNITO - LOGIN ||============================ //

const step1Schema = yup.object().shape({
  bfName: yup.string().required("Name is required"),
  details: yup
    .string()
    .required("Details name is required")
    .min(20, "Details must be at least 20 characters")
    .max(500, "Details must not exceed 500 characters")
    .matches(
      /^[a-zA-Z0-9\s.,!?()-]+$/,
      "Details can only contain letters, numbers, and basic punctuation"
    ),
  fundType: yup.string().required("Account Type is required"),
  country: yup.string().when("fundType", {
    is: "country-specific",
    then: (schema) => schema.required("Country is required"),
    otherwise: (schema) => schema.optional(),
  }),
  currency: yup.string().required("Currency is required"),
});

const step2Schema = yup.object().shape({
  accountType: yup.string().required("Account type is required"),
  bankName: yup.string().when("accountType", {
    is: "bank account",
    then: (schema) => schema.required("Bank name is required"),
  }),
  accountNumber: yup.string().when("accountType", {
    is: "bank account",
    then: (schema) =>
      schema
        .required("Account number is required")
        .matches(/^\d+$/, "Account number must only contain digits")
        .min(10, "Account number must be at least 10 digits")
        .max(16, "Account number must not exceed 16 digits"),
  }),
  accountName: yup.string().when("accountType", {
    is: (type: string) => type === "bank account" || type === "mobile money",
    then: (schema) =>
      schema
        .required("Account name is required")
        .min(3, "Account name must be at least 3 characters")
        .matches(
          /^[a-zA-Z\s]+$/,
          "Account name can only contain letters and spaces"
        ),
  }),
  mobileMoneyNumber: yup.string(),
});

const CreateGroupBfForm = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [steps, setSteps] = useState<number>(1);



  const basicUserInfo = useAppSelector(
    (state) => state.basicUserInfo.basicUserInfo
  );

  const { groupId } = useParams();
  const { toggleModal } = useSettingModal();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: () =>
      createBf(
        {
          name: step1Values.bfName,
          fundDetails: step1Values.details,
          type: step1Values?.fundType,
          accountNumber: step2Values?.accountNumber,
          accountName: step2Values?.accountName,
          bankName: step2Values?.bankName,
          accountType: step2Values?.accountType,
        },
        groupId as string
      ),
    onError: (error: any) => {
      console.log(error);
      setFeedback(error.message);
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      const response = data.data;
      toggleModal("bfCreatedModal", {
        fundId: response.fundId,
      });

      console.log(response.fundId, "response");
    },
  });

  const {
    errors,
    touched,
    handleChange,
    values: step1Values,
    handleSubmit,
    setFieldValue: step1SetFieldValue,
  } = useFormik({
    initialValues: {
      bfName: "",
      details: "",
      fundType: "country-specific",
      country: "uganda",
      currency: "UGX",
    },
    validationSchema: step1Schema,
    onSubmit: () => {
      setSteps(2);
    },
  });

  const {
    errors: step2Errors,
    handleChange: step2HandleChange,
    values: step2Values,
    touched: step2Touched,
    handleSubmit: step2HandleSubmit,
    setFieldValue: step2SetFieldValue,
  } = useFormik({
    initialValues: {
      accountNumber: "",
      accountType: "",
      accountName:
        `${basicUserInfo?.firstName} ${basicUserInfo?.lastName}` || "",
      bankName: "",
      mobileMoneyNumber: basicUserInfo?.mobileNumber || "",
    },
    validationSchema: step2Schema,
    onSubmit: () => {
      mutate();
    },
  });

  const { data: banksData } = useQuery({
    queryKey: [`banks`, "UG"],
    queryFn: () =>
      getBanks({
        mobileMoney: "false",
        countryCode: "UG",
      }),
    enabled: steps === 2,
  });

  const banks = banksData?.data?.data || [];

  useEffect(() => {
    dispatch(fetchBasicUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (basicUserInfo) {
      step2SetFieldValue(
        "mobileMoneyNumber",
        basicUserInfo?.mobileNumber || ""
      );
      step2SetFieldValue(
        "accountName",
        `${basicUserInfo?.firstName} ${basicUserInfo?.lastName}` || ""
      );
    }
  }, [basicUserInfo]);

  if (steps === 1)
    return (
      <>
        <div className="w-full  mx-auto tablet-xl:px-8 py-12 relative bottom-6 max-tablet:bottom-14">
          <form
            className="flex w-full flex-col flex-1 mt-10 justify-start "
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="bg-white p-4 rounded-md tablet:bg-transparent tablet:p-0 tablet:rounded-none mb-4">
              <span className="block  text-xs mobile:text-sm tablet:text-base cursor-default text-divider-300">
                {"Let's"} go!
              </span>
              <h1 className=" text-lg mobile:text-xl tablet:text-3xl font-semibold">
                Create a Benevolent Fund
              </h1>
            </div>

            <div className="bg-white p-4 rounded-md tablet:bg-transparent tablet:p-0 tablet:rounded-none mb-8 relative bottom-0">
              <CustomTextInput
                type="text"
                id="bfName"
                onChange={handleChange}
                value={step1Values.bfName}
                error={touched.bfName ? errors?.bfName : undefined}
                label="Name of Fund"
                placeholder="Give your fund a name"
                className="mt-5"
              />

              <CustomTextarea
                id="details"
                onChange={handleChange}
                value={step1Values.details}
                error={touched.details ? errors?.details : undefined}
                label="Fund Details"
                placeholder="Write a brief description about this fund"
                className="mt-5"
              />
              <>
                <CustomSelect
                  options={[
                    { value: "uganda", label: "Uganda" },
                    // { value: "kenya", label: "Kenya" },
                  ]}
                  onChange={(value) => step1SetFieldValue("country", value)}
                  value={step1Values.country}
                  error={touched.country ? errors?.country : undefined}
                  label="Country"
                  placeholder="Select country"
                  className="mt-5"
                  selectTriggerClassName="border-divider rounded-[10px]"
                />
                <CustomSelect
                  options={[
                    { value: "UGX", label: "UGX" },
                    { value: "USD", label: "USD" },
                  ]}
                  onChange={(value) => step1SetFieldValue("currency", value)}
                  value={step1Values.currency}
                  error={touched.currency ? errors?.currency : undefined}
                  label="Currency"
                  placeholder="Select currency"
                  className="mt-5"
                  selectTriggerClassName="border-divider rounded-[10px]"
                />
              </>
            </div>

            <div className="hidden tablet-lg:block">
              <AuthButton
                handleClick={() => handleSubmit()}
                isLoading={isPending}
                disabled={step1Values.fundType === 'global'}
                text="Next"
                className="mt-12"
              />

              {feedback && (
                <p className="text-negative mt-3 capitalize">{feedback}</p>
              )}

              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={() => router.back()}
                  type="button"
                  className="text-primary underline font-bold"
                >
                  Go back
                </button>
              </div>
            </div>
            <div className="block tablet-lg:hidden">
              <div className="w-full bg-primary p-2 flex justify-between items-center mt-0 rounded-md">
                <button
                  onClick={() => router.back()}
                  type="button"
                  className="text-white font-bold h-8 px-4"
                >
                  Back
                </button>

                <AuthButton
                  handleClick={() => handleSubmit()}
                  isLoading={isPending}
                  disabled={step1Values.fundType === 'global'}
                  text="Next"
                  className="h-8 w-1/8 pr-auto text-primary bg-white rounded-none"
                />
              </div>
            </div>
          </form>
        </div>
      </>
    );

  if (steps === 2)
    return (
      <>
        <BfCreatedModal />

        <div className="w-full  mx-auto tablet-xl:px-8  py-12 relative bottom-6 max-tablet:bottom-14">
          <form
            className="flex flex-col flex-1 mt-10 justify-start "
            noValidate
            onSubmit={step2HandleSubmit}
          >
            <div className="bg-white p-4 rounded-md tablet:bg-transparent tablet:p-0 w-full tablet:rounded-none mb-4">
              <span className="cursor-default text-divider-300">
                Almost there!
              </span>
              <h1 className="text-2xl font-semibold">Set up payment</h1>
            </div>

            <div className="bg-white p-4 rounded-md tablet:bg-transparent tablet:p-0 tablet:rounded-none mb-8 relative bottom-0">
              <CustomSelect
                options={[
                  { value: 'bank account', label: 'Bank account' },
                  { value: 'mobile money', label: 'Mobile money' }
                ]}
                onChange={value => {
                  step2SetFieldValue('accountType', value)
                }}
                value={step2Values.accountType}
                error={
                  step2Touched.accountType
                    ? step2Errors?.accountType
                    : undefined
                }
                label="Account Type"
                placeholder="Select account type"
                className="mt-4"
                selectTriggerClassName="border-divider rounded-[10px]"
              />

              {step2Values.accountType === 'bank account' && (
                <>
                  <CustomSelect
                    value={step2Values.bankName}
                    error={
                      step2Touched.bankName ? step2Errors?.bankName : undefined
                    }
                    options={banks?.map((bank: { name: string }) => ({
                      label: bank.name,
                      value: bank.name
                    }))}
                    label="Bank Name"
                    placeholder={
                      step2Values.bankName?.trim() || 'Search bank...'
                    }
                    className="mt-4"
                    onChange={(val: string) => {
                      step2SetFieldValue('bankName', val)
                    }}
                    isSearchable={true}
                  />
                  <CustomTextInput
                    type="text"
                    id="accountNumber"
                    onChange={step2HandleChange}
                    value={step2Values.accountNumber}
                    error={
                      step2Touched.accountNumber
                        ? step2Errors?.accountNumber
                        : undefined
                    }
                    label="Account Number"
                    placeholder="Enter account number"
                    className="mt-4"
                  />
                  <CustomTextInput
                    type="text"
                    id="accountName"
                    onChange={step2HandleChange}
                    value={step2Values.accountName}
                    error={
                      step2Touched.accountName
                        ? step2Errors?.accountName
                        : undefined
                    }
                    label="Account Name"
                    placeholder="Enter account name"
                    className="mt-4"
                  />
                </>
              )}

              {step2Values.accountType === 'mobile money' && (
                <>
                  {/* Info message about mobile money number from KYC */}
                  <div className="rounded-[5px] p-3 mt-4 bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Note:</span> The mobile
                      money number and account name are retrieved from your KYC
                      information. If you need to update these details, please
                      change them in your KYC profile first.
                    </p>
                  </div>

                  <CustomCountrySelect
                    label="Mobile Money Number"
                    selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
                    showStar={false}
                    value={step2Values.mobileMoneyNumber}
                    onChange={value =>
                      step2SetFieldValue('mobileMoneyNumber', value)
                    }
                    id="mobileMoneyNumber"
                    error={
                      step2Touched.mobileMoneyNumber
                        ? step2Errors?.mobileMoneyNumber
                        : undefined
                    }
                    className="mt-4"
                    disabled={true}
                  />
                  <CustomTextInput
                    type="text"
                    id="accountName"
                    onChange={step2HandleChange}
                    value={step2Values.accountName}
                    label="Mobile Money Name"
                    placeholder="Enter mobile money name"
                    className="mt-4"
                    disabled={true}
                  />
                </>
              )}
            </div>
            <div className="hidden tablet-lg:block">
              <AuthButton
                handleClick={() => step2HandleSubmit()}
                isLoading={isPending}
                text="Finish"
                className="mt-10"
              />
              {feedback && (
                <div>
                  <p className="text-negative mt-2 capitalize">{feedback}</p>
                </div>
              )}

              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={() => {
                    setSteps(1)
                  }}
                  type="button"
                  className="text-primary underline font-bold text-center"
                >
                  Go back
                </button>
              </div>
            </div>
            <div className="block tablet-lg:hidden">
              <div className="w-full bg-primary p-2 flex justify-between items-center mt-1 rounded-md">
                <button
                  onClick={() => {
                    setSteps(1)
                  }}
                  type="button"
                  className="text-white font-bold h-8 px-4"
                >
                  Back
                </button>

                <AuthButton
                  handleClick={() => step2HandleSubmit()}
                  isLoading={isPending}
                  disabled={step1Values.fundType === 'global'}
                  text="Finish"
                  className="h-8 w-1/8 pr-auto text-primary bg-white rounded-none"
                />
              </div>
            </div>
          </form>
        </div>
      </>
    );
};

export default CreateGroupBfForm;