import React, { useState } from "react";
import * as yup from "yup";
import CustomTextInput from "@/components/input/CustomTextInput";
import CustomSelect from "@/components/input/CustomSelect";
import { fcMethodOptions, FcTypeTypes } from "@/utils/data/fc";
import CustomTextarea from "@/components/input/CustomTextarea";
import { useParams, useRouter } from "next/navigation";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomBfCurrencyInput from "@/components/input/CustomBfCurrencyInput";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import AuthButton from "@/components/button/AuthButton";
import { handleCurrencyChange } from "@/utils/functions/handleCurrencyChange";
import {
  fileNewAsBeneficiaryCase,
} from "@/api/bereavement-fund/file-case";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { uploadFiles } from "@/api/file-upload";
import { toast } from "sonner";
import moment from "moment";
import Link from "next/link";

const step1Schema = yup.object().shape({
  caseName: yup.string().required("Casename is required"),
  reason: yup.string().required("Status of the affected person is required"),
  targetAmount: yup
    .string()
    .required("Target amount is required")
    .matches(/^\d+$/, "Target amount must be a number"),
});

const step2Schema = yup.object().shape({
  timeLine: yup.date(),
  description: yup
    .string()
    .required("Support Request details are required")
    .min(20, "Details must be at least 20 characters")
    .max(500, "Details must not exceed 500 characters"),
});

const FileCaseAsBfBeneficiaryForm = () => {
  const bfId = useParams()?.bfId as string;
  const principalId = useParams()?.principalId as string;
  const { toggleModal } = useSettingModal();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [coverImage, setCoverImage] = useState("");

  const {
    errors,
    touched,
    handleChange,
    values: step1Values,
    handleSubmit,
    setFieldValue: step1SetFieldValue,
    setTouched: step1SetTouched,
  } = useFormik({
    initialValues: {
      caseName: "",
      reason: "",
      targetAmount: "",
    },
    validationSchema: step1Schema,
    onSubmit: () => setStep(2),
  });

  const {
    errors: step2Errors,
    handleChange: step2HandleChange,
    values: step2Values,
    touched: step2Touched,
    handleSubmit: step2HandleSubmit,
    setTouched: step2SetTouched,
  } = useFormik({
    initialValues: {
      timeLine: "",
      description: "",
    },
    validationSchema: step2Schema,
    onSubmit: () => setStep(3),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      fileNewAsBeneficiaryCase(bfId as string, {
        caseName: step1Values.caseName,
        reason: step1Values.reason,
        targetAmount: Number(step1Values.targetAmount),
        timeLine: step2Values.timeLine,
        description: step2Values.description,
        principalId: principalId,
        coverImage,
      }),
    onSuccess: (data) =>
      toggleModal("submittedModal", {
        ...data.data,
        isBeneficiary: true,
        link: `/bf/${data.data?.groupId}/${data.data?.fundId}/beneficiary`,
      }),
    onError: (error: any) => {
      toast.error(error?.message || JSON.stringify(error));
    },
  });

  const uploadFile = async (image: File) => {
    try {
      const response = await uploadFiles([image]);
      if (!response?.data?.success) {
        throw new Error("Failed to upload image");
      }
      return response.data.files[0].url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleBack = () => step > 1 && setStep((prev) => prev - 1);

  return (
    <form className="flex flex-col flex-1 mt-10 md:justify-center" noValidate>
      <div className="flex flex-col justify-center tablet:px-6 py-6">
        <div className="max-w-4xl">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="block bg-white tablet-lg:bg-white [@media_(min-width:_769px)]:bg-transparent max-tablet:p-4 rounded-md">
                <p className="font-inter text-[14px] text-[#969696]">
                  Let&apos;s go!
                </p>
                <h1 className="font-inter text-[26px] text-[#000000]">
                  One more thing!
                </h1>
              </div>
              {step1Values.reason === "dead" && (
                <div className="hidden tablet-lg:block bg-white tablet-lg:bg-white [@media_(min-width:_769px)]:bg-transparent max-tablet:p-4 rounded-md">
                  <h1 className="font-inter text-[16px] text-[#969696]">
                    Guaranteed Benefits Payable: UGX 100,000
                  </h1>
                  <p className="font-inter text-[12px] text-[#969696]">
                    Guaranteed Benefits are applicable only in cases of death.
                    <Link
                      href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/faqs#What-happens-during-a-bereavement-case`}
                      className="text-primary hover:text-blue-800 ml-1"
                    >
                      Learn more
                    </Link>
                  </p>
                </div>
              )}

              <div className="block  bg-white tablet-lg:bg-white [@media_(min-width:_769px)]:bg-transparent [&_label]:max-tablet-lg:mb-2 [&_label]:mb-2 max-tablet:p-4 rounded-md">
                <CustomTextInput
                  type="text"
                  id="caseName"
                  onChange={handleChange}
                  value={step1Values.caseName}
                  error={touched.caseName ? errors?.caseName : undefined}
                  label="Case name"
                  placeholder="enter as case name"
                  className="font-bold block mb-4 tablet-lg:mb-4"
                  inputClassName="bg-divider-100 font-normal"
                />

                <CustomSelect
                  selectTriggerClassName="bg-divider-100 font-normal"
                  label="Status of the affected person"
                  options={fcMethodOptions}
                  placeholder="select"
                  value={step1Values.reason}
                  onChange={(value) =>
                    step1SetFieldValue("reason", value as FcTypeTypes)
                  }
                  error={touched.reason ? errors?.reason : undefined}
                  className="font-bold block mb-4 tablet-lg:mb-4"
                  optionClassName="hover:border-2 hover:border-gray-300 [&_[data-check]]:hidden"
                />
                <CustomBfCurrencyInput
                  type="text"
                  id="targetAmount"
                  onChange={handleCurrencyChange((targetAmount) => {
                    step1SetFieldValue("targetAmount", targetAmount);
                  })}
                  value={step1Values.targetAmount}
                  error={
                    touched.targetAmount ? errors?.targetAmount : undefined
                  }
                  label="Target amount"
                  placeholder="0"
                  className="font-bold"
                  inputClassName="bg-divider-100 font-normal"
                />
              </div>

              <div className=" hidden tablet-lg:block flex justify-start mt-6">
                <AuthButton
                  isLoading={isPending}
                  text="Next"
                  handleClick={() => {
                    const isValidStep1 = step1Schema.isValidSync(step1Values);
                    if (isValidStep1) {
                      handleSubmit();
                    } else {
                      step1SetTouched({
                        caseName: true,
                        reason: true,
                        targetAmount: true,
                      });
                    }
                  }}
                  className="font-medium text-[12px] w-full px-4 py-2 text-lg text-white bg-primary rounded-md border hover:bg-gray-300 transition-colors"
                />
              </div>

              <div className="hidden tablet-lg:block flex text-center justify-center mt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="font-medium text-[12px] w-full px-4 py-2 text-lg text-primary underline"
                >
                  Go back
                </button>
              </div>

              <div className="block tablet-lg:hidden mt-4">
                <div className="w-full bg-primary p-2 flex justify-between items-center mt-0 rounded-md">
                  <button
                    onClick={() => router.back()}
                    type="button"
                    className="text-white font-bold h-8 px-4"
                  >
                    Back
                  </button>

                  <AuthButton
                    isLoading={isPending}
                    text="Next"
                    handleClick={() => {
                      const isValidStep1 = step1Schema.isValidSync(step1Values);
                      if (isValidStep1) {
                        handleSubmit();
                      } else {
                        step1SetTouched({
                          caseName: true,
                          reason: true,
                          targetAmount: true,
                        });
                      }
                    }}
                    className="h-8 w-1/8 pr-auto text-primary bg-white rounded-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="block bg-white tablet-lg:bg-white [@media_(min-width:_769px)]:bg-transparent max-tablet:p-4 rounded-md">
                <p className="font-inter text-[14px] text-[#969696]">
                  Let&apos;s go!
                </p>
                <h1 className="font-inter text-[26px] text-[#000000]">
                  Almost there!
                </h1>
              </div>

              <div className="block bg-white tablet-lg:bg-white [@media_(min-width:_769px)]:bg-transparent [&_label]:max-tablet-lg:mb-2 [&_label]:mb-2  max-tablet:p-4 rounded-md">
                <div className="relative font-inter ">
                  <CustomTextInput
                    type="date"
                    id="timeLine"
                    placeholder="1 week"
                    label="Timeline (optional)"
                    inputClassName="bg-divider-100"
                    showStar={false}
                    value={step2Values.timeLine}
                    onChange={step2HandleChange}
                    error={step2Touched.timeLine && step2Errors.timeLine}
                    className="font-bold block mb-4 tablet-lg:mb-4"
                    min={moment().format("YYYY-MM-DD")}
                  />
                </div>

                <CustomTextarea
                  id="description"
                  inputClassName="font-normal text-[14px] "
                  onChange={step2HandleChange}
                  value={step2Values.description}
                  error={
                    step2Touched.description
                      ? step2Errors?.description
                      : undefined
                  }
                  label="Support Request details"
                  placeholder="Write a brief description about this person's condition"
                  className="font-bold block mb-4 tablet-lg:mb-0"
                />
              </div>
              <div className="hidden tablet-lg:block flex justify-start mt-6">
                <AuthButton
                  isLoading={isPending}
                  text="Next"
                  handleClick={() => {
                    const isValidStep2 = step2Schema.isValidSync(step2Values);
                    if (isValidStep2) {
                      step2HandleSubmit();
                    } else {
                      step2SetTouched({
                        timeLine: true,
                        description: true,
                      });
                    }
                  }}
                  className="font-medium text-[12px] w-full px-4 py-2 text-lg text-white bg-primary rounded-md border hover:opacity-85 transition-colors"
                />
              </div>

              <div className="hidden tablet-lg:block flex text-center justify-center mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="font-medium text-[12px] w-full px-4 py-2 text-lg text-primary underline"
                >
                  Go back
                </button>
              </div>

              <div className="block tablet-lg:hidden mt-4">
                <div className="w-full bg-primary p-2 flex justify-between items-center mt-0 rounded-md">
                  <button
                    onClick={() => router.back()}
                    type="button"
                    className="text-white font-bold h-8 px-4"
                  >
                    Back
                  </button>

                  <AuthButton
                    isLoading={isPending}
                    text="Next"
                    handleClick={() => {
                      const isValidStep2 = step2Schema.isValidSync(step2Values);
                      if (isValidStep2) {
                        step2HandleSubmit();
                      } else {
                        step2SetTouched({
                          timeLine: true,
                          description: true,
                        });
                      }
                    }}
                    className="h-8 w-1/8 pr-auto text-primary bg-white rounded-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="block bg-white tablet-lg:bg-white [@media_(min-width:_769px)]:bg-transparent p-4 rounded-md">
                <p className="font-inter text-[14px] text-[#969696]">
                  Let’s go!
                </p>
                <h1 className="font-inter text-[26px] text-[#000000] tablet-lg:mb-4 mb-6">
                  Add a cover photo
                </h1>
                <p className=" font-inter text-[12px] tablet-lg:text-[14px] tablet-lg:-mb-6 text-[#969696]">
                  Add a bright and clear photo that helps people connect with
                  your case right away.
                </p>
              </div>
              <div className="block bg-white tablet-lg:bg-white [@media_(min-width:_769px)]:bg-transparent p-4 rounded-md flex flex-col items-center gap-2 ">
                <CustomAvatar
                  image={coverImage}
                  className="justify-start w-full tablet:w-[400px] tablet-lg:w-[550px] h-[150px] cursor-pointer"
                  imageClassName="h-[150px] w-[550px] object-top text-[16px] font-bold text-primary border-1 rounded-[24px] overflow-hidden flex items-center justify-center"
                  labelClassName="h-[150px] w-[550px] border-1 rounded-[18px] overflow-hidden flex items-center justify-center"
                  alt="profile image"
                  showText={true}
                  disabled={false}
                  iconClassName="w-[80px] h-[60px]"
                  isCurrentUser={false}
                  userFullName=""
                  onFileChange={async (file) => {
                    if (file) {
                      try {
                        const imageUrl = await uploadFile(file);
                        setCoverImage(imageUrl);
                      } catch (error) {
                        console.error("Failed to upload image:", error);
                      }
                    }
                  }}
                />
              </div>

              <div className="hidden tablet-lg:block flex justify-start mt-6">
                <AuthButton
                  isLoading={isPending}
                  text="Submit"
                  handleClick={() => mutate()}
                  className="font-medium text-[12px] w-full px-4 py-2 text-lg text-white bg-primary rounded-md border hover:opacity-85 transition-colors"
                />
              </div>

              <div className="hidden tablet-lg:block flex text-center justify-center mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="font-medium text-[12px] w-full px-4 py-2 text-lg text-primary underline"
                >
                  Go back
                </button>
              </div>

              <div className="block tablet-lg:hidden mt-4">
                <div className="w-full bg-primary p-2 flex justify-between items-center mt-0 rounded-md">
                  <button
                    onClick={() => router.back()}
                    type="button"
                    className="text-white font-bold h-8 px-4"
                  >
                    Back
                  </button>

                  <AuthButton
                    isLoading={isPending}
                    text="Next"
                    handleClick={() => mutate()}
                    className="h-8 w-1/8 pr-auto text-primary bg-white rounded-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default FileCaseAsBfBeneficiaryForm;
