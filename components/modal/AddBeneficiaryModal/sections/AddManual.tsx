"use client";

import React, { useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import CustomTextInput from "@/components/input/CustomTextInput";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomCountrySelect from "../../../input/CustomCountrySelect";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchBasicUserInfo } from "@/lib/features/kyc/basicUserInfoSlice";

const beneficiaryValidationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dataOfBirth: yup
    .date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .required("Date of Birth is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Mobile Number is required"),
});

const AddManual = () => {
  const { modalData, updateModalData } = useSettingModal();

  const dispatch = useAppDispatch();
  const basicUserInfo = useAppSelector(
    (state) => state.basicUserInfo.basicUserInfo
  );

  const modalD = modalData.addBeneficiaryModal;

  const { values, handleSubmit, handleChange, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        lastName: "",
        firstName: "",
        dataOfBirth: "",
        email: "",
        phoneNumber: "",
      },
      validationSchema: beneficiaryValidationSchema,
      onSubmit: () => {
        updateModalData("addBeneficiaryModal", {
          ...modalD,
          formValues: values,
          state: 2,
          manual: true,
        });
      },
    });

  useEffect(() => {
    dispatch(fetchBasicUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (basicUserInfo) {
      setFieldValue("phoneNumber", basicUserInfo?.mobileNumber || "");
      setFieldValue(
        "email",
        `${basicUserInfo?.email}` || ""
      );
    }
  }, [basicUserInfo]);

  return (
    <>
      <div className="flex max-tablet-lg:justify-center tablet-lg:justify-between items-center mb-4">
        <h2 className="text-xl font-extrabold">Add Beneficiary</h2>
      </div>

      <>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <CustomTextInput
              type="text"
              id="firstName"
              value={values.firstName}
              onChange={handleChange}
              error={touched.firstName && errors.firstName}
              label="First Name"
              showStar={true}
              placeholder="Enter first name"
              inputClassName="bg-divider-100 font-normal"
            />
            <CustomTextInput
              type="text"
              id="lastName"
              value={values.lastName}
              onChange={handleChange}
              error={touched.lastName && errors.lastName}
              label="Last Name"
              showStar={true}
              placeholder="Enter last name"
              inputClassName="bg-divider-100 font-normal"
            />

            <CustomTextInput
              type="date"
              id="dataOfBirth"
              value={values.dataOfBirth}
              showStar={true}
              label="  Date of Birth "
              placeholder=""
              inputClassName="bg-divider-100 font-normal"
              onChange={handleChange}
              error={touched?.dataOfBirth && errors?.dataOfBirth}
              max={moment().format("YYYY-MM-DD")}
            />

            <CustomTextInput
              type="email"
              id="email"
              value={values.email}
              showStar={true}
              label="Email"
              placeholder="example@gmail.com"
              inputClassName="bg-divider-100 font-normal"
              onChange={handleChange}
              error={touched.email && errors.email ? errors.email : undefined}
            />

            <CustomCountrySelect
              label="phone number (Mobile Money Number)"
              selectTriggerClassName="bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]"
              showStar={true}
              value={values.phoneNumber}
              onChange={(value) => setFieldValue("phoneNumber", value)}
              error={touched?.phoneNumber && errors.phoneNumber}
            />
          </div>

          <div className="flex justify-start mt-6">
            <button
              type="submit"
              className="font-medium text-[12px] w-[200px] px-4 py-2 text-lg text-black bg-white rounded-md border border-[#1D1C1D21] hover:bg-divider-100 transition-colors"
            >
              Next
            </button>
          </div>
        </form>
      </>
    </>
  );
};

export default AddManual;
