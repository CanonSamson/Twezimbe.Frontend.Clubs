"use client";

import { IoClose } from "react-icons/io5";
import FormSection from "./FormSection";
import CustomBfCurrencyInput from "@/components/input/CustomBfCurrencyInput";
import CustomTextInput from "@/components/input/CustomTextInput";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getBfFundRuleAsMember,
  updateBfFundRule,
} from "@/api/bereavement-fund/fund";
import { AiOutlineLoading } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BenefitType, SubscriptionType } from "@/types/bf/fund";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CustomSelect from "@/components/input/CustomSelect";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

const validationSchema = Yup.object().shape({
  maxBeneficiariesPerPrincipal: Yup.number()
    .transform((value, originalValue) => {
      // Handle empty string or null/undefined
      if (originalValue === "" || originalValue == null) return undefined;
      return Number(originalValue);
    })
    .min(0, "Must be 0 or greater")
    .required("Required"),

  membershipFee: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) return undefined;
      return Number(originalValue);
    })
    .min(1, "Must be at least 1")
    .required("Required"),

  cashContribution: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) return undefined;
      return Number(originalValue);
    })
    .min(0, "Must be 0 or greater")
    .required("Required"),

  inKindContribution: Yup.string().optional(),

  paymentInLieuOfFailure: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) return 0; // Default to 0 since it's optional
      return Number(originalValue);
    })
    .min(0, "Must be 0 or greater"),

  annualSubscription: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) return undefined;
      return Number(originalValue);
    })
    .min(0, "Must be 0 or greater")
    .required("Required"),

  waitingPeriod: Yup.string().required("Required"),

  subscription: Yup.object().shape({
    youngChildren: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),

    youth: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),

    adult: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),

    preSeniors: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),

    seniors: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),
  }),

  benefits: Yup.object().shape({
    reserveRatio: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),

    adminCostCap: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),

    payoutPool: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),

    mortalityRate: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) return undefined;
        return Number(originalValue);
      })
      .min(0, "Must be 0 or greater")
      .max(100, "Cannot exceed 100%")
      .required("Required"),
  }),
});
const FundRulesForm = () => {
  type SectionKey = "presence" | "service" | "Emotional";

  const [openSections, setOpenSections] = useState<{
    presence: boolean;
    service: boolean;
    Emotional: boolean;
  }>({
    presence: false,
    service: false,
    Emotional: false,
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const router = useRouter();
  const { groupId, bfId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [bfId, "fund-rule-as-member"],
    queryFn: () => getBfFundRuleAsMember(bfId as string),
  });
  const storedFundRule = data?.data?.fundRule;
  const [clickedButton, setClickedButton] = useState<
    "dashboard" | "next" | undefined
  >();

  interface FormValues {
    maxBeneficiariesPerPrincipal: number;
    membershipFee: number;
    annualSubscription: number;
    cashContribution: number;
    waitingPeriod: string;
    inKindContribution: string;
    paymentInLieuOfFailure: number;
    subscription: SubscriptionType;
    benefits: BenefitType;
    inKindContributions: {
      attendanceVigil: boolean;
      attendanceRequiemMass: boolean;
      attendanceBurial: boolean;
      attendancePostDeathVisit: boolean;
      escortBody: boolean;
      volunteerCook: boolean;
      coordinateTransport: boolean;
      helpVenueSetup: boolean;
      offerMusic: boolean;
      createTribute: boolean;
      helpCleanup: boolean;
      joinPrayerGroup: boolean;
      writeTribute: boolean;
      checkInBereaved: boolean;
    };
  }

  const defaultSubscription = {
    youngChildren: "0",
    youth: "0",
    adult: "0",
    preSeniors: "0",
    seniors: "0",
  };

  const defaultBenefits = {
    reserveRatio: 0,
    adminCostCap: 0,
    payoutPool: 0,
    mortalityRate: 0,
  };

  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    setFieldValue,
    touched,
    setValues,
  } = useFormik<FormValues>({
    initialValues: {
      maxBeneficiariesPerPrincipal:
        storedFundRule?.maxBeneficiariesPerPrincipal || 0,
      membershipFee: storedFundRule?.membershipFee || 0,
      cashContribution: storedFundRule?.cashContribution || 0,
      inKindContribution: storedFundRule?.inKindContribution || "",
      paymentInLieuOfFailure: storedFundRule?.paymentInLieuOfFailure || 0,
      subscription: storedFundRule?.subscription || defaultSubscription,
      benefits: storedFundRule?.benefits || defaultBenefits,
      waitingPeriod: storedFundRule?.waitingPeriod || "3 Weeks",
      annualSubscription: storedFundRule?.annualSubscription || 0,
      inKindContributions: {
        attendanceVigil:
          storedFundRule?.inKindContributions?.attendanceVigil || false,
        attendanceRequiemMass:
          storedFundRule?.inKindContributions?.attendanceRequiemMass || false,
        attendanceBurial:
          storedFundRule?.inKindContributions?.attendanceBurial || false,
        attendancePostDeathVisit:
          storedFundRule?.inKindContributions?.attendancePostDeathVisit ||
          false,
        escortBody: storedFundRule?.inKindContributions?.escortBody || false,

        volunteerCook:
          storedFundRule?.inKindContributions?.volunteerCook || false,
        coordinateTransport:
          storedFundRule?.inKindContributions?.coordinateTransport || false,
        helpVenueSetup:
          storedFundRule?.inKindContributions?.helpVenueSetup || false,
        offerMusic: storedFundRule?.inKindContributions?.offerMusic || false,
        createTribute:
          storedFundRule?.inKindContributions?.createTribute || false,
        helpCleanup: storedFundRule?.inKindContributions?.helpCleanup || false,

        joinPrayerGroup:
          storedFundRule?.inKindContributions?.joinPrayerGroup || false,
        writeTribute:
          storedFundRule?.inKindContributions?.writeTribute || false,
        checkInBereaved:
          storedFundRule?.inKindContributions?.checkInBereaved || false,
      },
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: () => {
      mutate();
    },
  });

  useEffect(() => {
    if (storedFundRule) {
      setValues({
        maxBeneficiariesPerPrincipal:
          storedFundRule?.maxBeneficiariesPerPrincipal || 0,
        membershipFee: storedFundRule?.membershipFee || 0,
        cashContribution: storedFundRule?.cashContribution || 0,
        inKindContribution: storedFundRule?.inKindContribution || "",
        paymentInLieuOfFailure: storedFundRule?.paymentInLieuOfFailure || 0,
        subscription: storedFundRule?.subscription || defaultSubscription,
        benefits: storedFundRule?.benefits || defaultBenefits,
        waitingPeriod: storedFundRule?.waitingPeriod || "3 Weeks",
        annualSubscription: storedFundRule?.annualSubscription || 0,
        inKindContributions: {
          attendanceVigil:
            storedFundRule?.inKindContributions?.attendanceVigil || false,
          attendanceRequiemMass:
            storedFundRule?.inKindContributions?.attendanceRequiemMass || false,
          attendanceBurial:
            storedFundRule?.inKindContributions?.attendanceBurial || false,
          attendancePostDeathVisit:
            storedFundRule?.inKindContributions?.attendancePostDeathVisit ||
            false,
          escortBody: storedFundRule?.inKindContributions?.escortBody || false,

          volunteerCook:
            storedFundRule?.inKindContributions?.volunteerCook || false,
          coordinateTransport:
            storedFundRule?.inKindContributions?.coordinateTransport || false,
          helpVenueSetup:
            storedFundRule?.inKindContributions?.helpVenueSetup || false,
          offerMusic: storedFundRule?.inKindContributions?.offerMusic || false,
          createTribute:
            storedFundRule?.inKindContributions?.createTribute || false,
          helpCleanup:
            storedFundRule?.inKindContributions?.helpCleanup || false,

          joinPrayerGroup:
            storedFundRule?.inKindContributions?.joinPrayerGroup || false,
          writeTribute:
            storedFundRule?.inKindContributions?.writeTribute || false,
          checkInBereaved:
            storedFundRule?.inKindContributions?.checkInBereaved || false,
        },
      });
    }
  }, [storedFundRule]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateBfFundRule(bfId as string, values),
    onSuccess: (data) => {
      if (clickedButton === "dashboard") {
        handleClick();
      } else {
        router.push(`/bf/settings/${groupId}/${bfId}/transition-wallet`);
      }
      toast.success(data.data.message || "Updated");
    },
    onError: (data) => {
      console.log(data);
      toast.error("Error");
    },
  });

  const handleClick = () => {
    router.replace(`/bf/${groupId}/${bfId}`);
  };

  useEffect(() => {
    if (errors) {
      console.log(errors, "errors");
    }
  }, [errors]);

  const handleCurrencyChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = Number(e.target.value.replace(/,/g, ""));
      setFieldValue(fieldName, numericValue);
    };

  const handleSubmitForm = ({
    dashboard,
  }: {
    dashboard?: boolean;
    next?: boolean;
  }) => {
    setClickedButton(dashboard ? "dashboard" : "next");
    handleSubmit();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AiOutlineLoading className="size-[24px] animate-spin" />
      </div>
    );
  }

  const fundRulesUpdated = storedFundRule?.updated || false;

  return (
    <div className="mb-0 overflow-x-hidden tablet-lg:mb-14 p-4 pb-20 md:p-20 tablet-lg:pb-0 flex-1 bg-[#F2F2F2] tablet-lg:bg-transparent w-full min-h-screen tablet-lg:min-h-[calc(100vh-40px)]">
      <div>
        <div className=" flex justify-between items-center">
          <h2 className=" text-[32px] font-semibold">Fund rules</h2>
          <button
            disabled={isPending}
            onClick={handleClick}
            className="hidden tablet-lg:block"
          >
            <IoClose size={32} />
          </button>
        </div>
        <p className=" text-divider-200 w-full tablet-lg:w-[50%] text-[18px]">
          Set some ground rules for how your Benevolent Fund works. This will
          only take minutes
        </p>

        {/* Banner for unupdated fund rules */}
        {!fundRulesUpdated && (
          <div className="mt-6 mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-amber-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Fund rules need to be updated
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    You need to update your fund rules before you can proceed to
                    adding beneficiaries and subscriptions or get full access to
                    user features.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      className="bg-amber-50 px-2 py-1.5 rounded-md text-sm font-medium text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-50 focus:ring-amber-600"
                      onClick={() => {
                        // Scroll to fund rules section
                        const fundRuleElement =
                          document.getElementById("fundRule");
                        if (fundRuleElement) {
                          fundRuleElement.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                    >
                      Update Fund Rules
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div id="fundRule" className=" mt-20">
        <div className=" flex flex-col gap-6 ">
          <div className="bg-white tablet-lg:bg-transparent px-4 py-6 sm:px-6 tablet-lg:p-0">
            <FormSection heading="Basic">
              <div className="flex flex-col gap-6">
                <CustomTextInput
                  type="number"
                  id="maxBeneficiariesPerPrincipal"
                  value={values.maxBeneficiariesPerPrincipal}
                  error={
                    touched?.maxBeneficiariesPerPrincipal &&
                    errors.maxBeneficiariesPerPrincipal
                  }
                  label="Maximum Beneficiaries Per Principal"
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  className="mt-4"
                  onChange={handleChange}
                />
                <CustomBfCurrencyInput
                  type="st"
                  id="membershipFee"
                  value={values.membershipFee}
                  error={touched?.membershipFee && errors.membershipFee}
                  label="Membership Fee (one -off)"
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  className="mt-4"
                  onChange={handleCurrencyChange("membershipFee")}
                  currency={data?.data?.fundRule?.baseCurrency}
                />
                <CustomBfCurrencyInput
                  type="st"
                  id="annualSubscription"
                  value={values.annualSubscription}
                  error={
                    touched?.annualSubscription && errors.annualSubscription
                  }
                  label="Annual subscription base fee"
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  className="mt-4"
                  onChange={handleCurrencyChange("annualSubscription")}
                  currency={data?.data?.fundRule?.baseCurrency}
                />

                <div>
                  <CustomSelect
                    value={
                      values.waitingPeriod === "3 weeks"
                        ? "3 months"
                        : values.waitingPeriod
                    }
                    error={
                      touched?.annualSubscription && errors.annualSubscription
                    }
                    options={[
                      { label: "3 months", value: "3 months" },
                      { label: "4 months", value: "4 months" },
                      { label: "5 months", value: "5 months" },
                      { label: "6 months", value: "6 months" },
                      { label: "7 months", value: "7 months" },
                    ]}
                    label="Waiting Period"
                    selectTriggerClassName="bg-divider-100 !border-divider flex-1 border w-full"
                    placeholder={"Select waiting period"}
                    onChange={(value) => {
                      setFieldValue("waitingPeriod", value);
                    }}
                  />
                  <p className="mt-10 text-[#575F6E]">
                    Waiting period applies to subscriptions and it is a
                    timeframe during which certain benefits aren’t available{" "}
                    <a
                      href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/learn-more/benevolent-fund-waiting-period`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>
            </FormSection>
          </div>

          <div className="bg-white tablet-lg:bg-transparent px-4 py-6 sm:px-6 tablet-lg:p-0">
            <FormSection heading="Risk Profile (%)">
              <div className="grid  grid-cols-1 items-start mt-5 gap-6 sm:grid-cols-2 tablet-lg:grid-cols-3">
                <CustomTextInput
                  type="number"
                  id="subscription.youngChildren"
                  label="Children & dependents (0 -17 years)"
                  value={values.subscription.youngChildren}
                  onChange={handleChange("subscription.youngChildren")}
                  error={errors?.subscription?.youngChildren}
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />

                <CustomTextInput
                  type="text"
                  id="subscription.youth"
                  label="Young Adults ( 18 - 30 years)"
                  value={values.subscription.youth}
                  onChange={handleChange("subscription.youth")}
                  error={errors?.subscription?.youth}
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />

                <CustomTextInput
                  type="number"
                  id="subscription.adult"
                  label="Adults (31 -50 years)"
                  value={values.subscription.adult}
                  onChange={handleChange("subscription.adult")}
                  error={errors?.subscription?.adult}
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />

                <CustomTextInput
                  type="number"
                  id="subscription.preSeniors"
                  label="Pre-Seniors ( 51 -64 years)"
                  value={values.subscription.preSeniors}
                  onChange={handleCurrencyChange("subscription.preSeniors")}
                  error={errors?.subscription?.preSeniors}
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />

                <CustomTextInput
                  type="number"
                  id="subscription.seniors"
                  label="Seniors ( 65+ years)"
                  value={values.subscription.seniors}
                  onChange={handleCurrencyChange("subscription.seniors")}
                  error={errors?.subscription?.seniors}
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />
              </div>
              <p className="mt-10 text-[#575F6E]">
                Estimated subscription rate based on age-related health risk and
                cost of care.
                <a
                  href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/learn-more/bf-risk-profile`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  {" "}
                  Learn more
                </a>
              </p>
            </FormSection>
          </div>

          <div className="bg-white tablet-lg:bg-transparent px-4 py-6 sm:px-6 tablet-lg:p-0">
            <FormSection heading="Benefits">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 tablet-lg:grid-cols-3">
                <CustomTextInput
                  type="string"
                  id="benefits.reserveRatio"
                  value={values.benefits.reserveRatio}
                  onChange={handleChange("benefits.reserveRatio")}
                  error={errors?.benefits?.reserveRatio}
                  label="Reserve Ratio"
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  className="mt-4"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />

                <CustomTextInput
                  type="string"
                  id="benefits.adminCostCap"
                  value={values.benefits.adminCostCap}
                  onChange={handleChange("benefits.adminCostCap")}
                  error={errors?.benefits?.adminCostCap}
                  label="Admin Cost Cap."
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  className="mt-4"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />

                <CustomTextInput
                  type="string"
                  id="benefits.payoutPool"
                  value={values.benefits.payoutPool}
                  onChange={handleChange("benefits.payoutPool")}
                  error={errors?.benefits?.payoutPool}
                  label="Payout Pool"
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  className="mt-4"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />

                <CustomTextInput
                  type="string"
                  id="benefits.mortalityRate"
                  value={values.benefits.mortalityRate}
                  onChange={handleChange("benefits.mortalityRate")}
                  error={errors?.benefits?.mortalityRate}
                  label="Mortality Rate"
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  className="mt-4"
                  rightChild={
                    <button
                      type="button"
                      className={`px-4 flex-col flex bg-gray-100 items-center justify-center transition-all duration-700`}
                    >
                      %
                    </button>
                  }
                />
              </div>
              <p className="mt-10 text-[#575F6E]">
                Benefits are calculated based on the parameters above.
                <a
                  href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/learn-more/benefits-calculation`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  {" "}
                  Learn more
                </a>
              </p>
            </FormSection>
          </div>

          <div className="bg-white tablet-lg:bg-transparent px-4 py-6 sm:px-6 tablet-lg:p-0">
            <FormSection heading="In-kind Contribution">
              {/* Presence-base support */}
              <button
                type="button"
                onClick={() => toggleSection("presence")}
                className="flex items-center gap-2 w-full px-0 py-2 transition-all"
              >
                <MdOutlineKeyboardArrowUp
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openSections.presence ? "rotate-0" : "rotate-180"
                  }`}
                />
                <span className="font-inter text-[#242731] text-[15px]">
                  Presence-base support
                </span>
              </button>

              {openSections.presence && (
                <div className="flex flex-col gap-6">
                  <div className="mt-1 ml-4 sm:ml-10 flex flex-col gap-2">
                    {/* Adjusted ml for small screens */}
                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.attendanceVigil}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.attendanceVigil",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Attendance at Vigil (Home of the deceased to comfort the
                        partners)
                      </label>
                    </div>

                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          values.inKindContributions.attendanceRequiemMass
                        }
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.attendanceRequiemMass",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Attendance at Requiem mass in Church or Mosque
                      </label>
                    </div>

                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.attendanceBurial}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.attendanceBurial",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Attendance at burial
                      </label>
                    </div>

                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          values.inKindContributions.attendancePostDeathVisit
                        }
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.attendancePostDeathVisit",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Post-death visit to surviving member
                      </label>
                    </div>
                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.escortBody}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.escortBody",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Escort body( if transport is involved)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Service-base support */}
              <button
                type="button"
                onClick={() => toggleSection("service")}
                className="flex items-center gap-2 w-full px-0 py-2 transition-all"
              >
                <MdOutlineKeyboardArrowUp
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openSections.service ? "rotate-0" : "rotate-180"
                  }`}
                />
                <span className="font-inter text-[#242731] text-[15px]">
                  Service-base support
                </span>
              </button>

              {openSections.service && (
                <div className="flex flex-col gap-6">
                  <div className="mt-1 ml-4 sm:ml-10 flex flex-col gap-2">
                    {/* Adjusted ml for small screens */}
                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.volunteerCook}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.volunteerCook",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Volunteer to cook or serve during vigil
                      </label>
                    </div>

                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.coordinateTransport}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.coordinateTransport",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Coordinate transport
                      </label>
                    </div>

                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.helpVenueSetup}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.helpVenueSetup",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Help with venue setup
                      </label>
                    </div>

                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.offerMusic}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.offerMusic",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Offer music or sound system
                      </label>
                    </div>
                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.createTribute}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.createTribute",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Create photo/ video tribute
                      </label>
                    </div>
                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.helpCleanup}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.helpCleanup",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Help with clean-up after burial
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Emotional support */}
              <button
                type="button"
                onClick={() => toggleSection("Emotional")}
                className="flex items-center gap-2 w-full px-0 py-2 transition-all"
              >
                <MdOutlineKeyboardArrowUp
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openSections.Emotional ? "rotate-0" : "rotate-180"
                  }`}
                />
                <span className="font-inter text-[#242731] text-[15px]">
                  Emotional support
                </span>
              </button>

              {openSections.Emotional && (
                <div className="flex flex-col gap-6">
                  <div className="mt-1 ml-4 sm:ml-10 flex flex-col gap-2">
                    {/* Adjusted ml for small screens */}
                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.joinPrayerGroup}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.joinPrayerGroup",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Join prayer or reflection group
                      </label>
                    </div>

                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.writeTribute}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.writeTribute",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Write a message or tribute
                      </label>
                    </div>

                    <div className="flex items-start tablet:items-center gap-2">
                      <input
                        type="checkbox"
                        checked={values.inKindContributions.checkInBereaved}
                        onChange={(e) =>
                          setFieldValue(
                            "inKindContributions.checkInBereaved",
                            e.target.checked
                          )
                        }
                        className="mt-2 tablet:mt-0 text-primary"
                      />
                      <label className="text-[#797979]">
                        Check-in with the bereaved weekly for a month
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10">
                <div>
                  <h4 className="text-[18px] font-medium">
                    Cash Contributions
                  </h4>
                  <p className="text-[#575F6E] text-[14px] font-normal">
                    This is the minimum contribution by members of a bereavement
                    fund for filed cases.
                  </p>
                </div>
                <CustomBfCurrencyInput
                  type="string"
                  id="cashContribution"
                  value={values.cashContribution}
                  error={touched?.cashContribution && errors.cashContribution}
                  label="Minimum Contribution"
                  inputClassName="bg-divider-100 flex-1 w-full"
                  placeholder="0"
                  className="mt-4"
                  currency={data?.data?.fundRule?.baseCurrency}
                  onChange={handleCurrencyChange(`cashContribution`)}
                />
              </div>
            </FormSection>
          </div>
        </div>

        <div className="tablet-lg:border rounded-[10px] mt-10 flex flex-col gap-4 flex-1 -mx-6 tablet-lg:-mx-0 tablet-lg:w-full tablet-lg:gap-4 p-5 sm:flex-row sm:justify-start">
          <button
            onClick={() => handleSubmitForm({ dashboard: true })}
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center sm:justify-start gap-2 border rounded-[5px] text-[14px] tablet-lg:text-[16px] px-4 py-2 bg-white tablet-lg:bg-transparent transition-colors duration-200 hover:bg-gray-50"
          >
            Save & Continue to dashboard
            {isPending && clickedButton === "dashboard" ? (
              <AiOutlineLoading className="size-[20px] animate-spin duration-300 transition-all" />
            ) : (
              <MdOutlineArrowRightAlt size={20} />
            )}
          </button>
          <button
            onClick={() => handleSubmitForm({ next: true })}
            disabled={isPending}
            className="flex items-center justify-center sm:justify-start bg-primary text-white gap-2 rounded-[5px] text-[14px] tablet-lg:text-[16px] px-4 py-2 transition-colors duration-200 hover:bg-primary-dark"
          >
            Save & next
            {isPending && clickedButton === "next" ? (
              <AiOutlineLoading className="size-[20px] animate-spin duration-300 transition-all" />
            ) : (
              <MdOutlineArrowRightAlt size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundRulesForm;
