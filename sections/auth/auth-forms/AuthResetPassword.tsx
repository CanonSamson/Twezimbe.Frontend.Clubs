"use client";

import AuthButton from "@/components/button/AuthButton";
import Image from "next/image";
import NextLink from "next/link";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/ekyc";
import CustomTextInput from "@/components/input/CustomTextInput";

const AuthResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/forget-pass");
      return;
    }
  }, [token]);

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onError: (error: any) => {
      console.log(error);
      setFeedback(error.message);
      toast.error(JSON.stringify(error));
    },
    onSuccess: async (data) => {
      const response = data.data;
      toast.success(response.message);
      router.replace("/login");
    },
  });

  const passwordSchema = yup.object().shape({
    newPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Must contain a lowercase letter")
      .matches(/[A-Z]/, "Must contain an uppercase letter")
      .matches(/[0-9]/, "Must contain a number")
      .matches(/[\W_]/, "Must contain a special character")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const { errors, touched, handleChange, values, handleSubmit } = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      if (!token) {
        toast.error("Invalid token. Please request a new password reset.");
        return;
      }
      mutate({
        newPassword: values.newPassword,
        token,
      });
    },
  });

  console.log(feedback);
  return (
    <>
      <form
        className="flex flex-col font-inter px-4 sm:max-w-[450px] mx-auto w-full bg-white rounded-[10px] flex-1 md:justify-center"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center justify-center">
          <Image
            src={`/assets/images/icons/lock.svg`}
            className="h-[200px] w-auto"
            width={200}
            height={200}
            alt="lock icon"
          />
          <h1 className="mt-4 text-xl font-medium text-center">
            Enter a New Password
          </h1>
        </div>

        <CustomTextInput
          id="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter your password"
          className="mt-4"
          value={values.newPassword}
          onChange={handleChange}
          error={touched.newPassword && errors.newPassword}
        />

        <CustomTextInput
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          className="mt-4"
          value={values.confirmPassword}
          onChange={handleChange}
          error={touched.confirmPassword && errors.confirmPassword}
        />

        <AuthButton
          handleClick={() => handleSubmit()}
          text={isPending ? "Submitting..." : "Change Password"}
          className="mt-5"
          disabled={isPending}
        />
      </form>

      <div className="text-center flex-1 justify-center items-center mt-10">
        <NextLink href="/login" passHref legacyBehavior>
          <span className="text-primary sm:text-white font-semibold underline cursor-pointer">
            Return to Login
          </span>
        </NextLink>
      </div>
    </>
  );
};

export default AuthResetPassword;
