"use client";

import AuthButton from "@/components/button/AuthButton";

import CustomTextInput from "@/components/input/CustomTextInput";
import Image from "next/image";
import NextLink from "next/link";

import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/ekyc";
import { useState } from "react";
import { useRouter } from "next/navigation";

// types

// ============================|| Auth - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onError: (error: any) => {
      console.log(error);
      setFeedback(error.message);
      toast.error(error.message);
    },
    onSuccess: async () => {
      setFeedback(null);
      setValues({
        email: "",
      });
      toast("Link Sent", {
        description: "Check your email to reset your password.",
        action: {
          label: "Login",
          onClick: () => {
            router.push("/login");
          },
        },
      });
    },
  });

  const emailSchema = yup.object().shape({
    email: yup.string().email().required("Email address is required"),
  });

  const { errors, touched, handleChange, values, handleSubmit, setValues } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: emailSchema,
      onSubmit: (values) => {
        mutate(values);
      },
    });

  const verify = () => {
    if (touched.email && Object.values(errors)[0]) {
      toast.error(Object.values(errors)[0]);
    }
  };

  console.log(feedback);
  return (
    <>
      <div className=" hidden sm:flex text-center flex-1 bg-slate-500 justify-center items-center mt-10"></div>
      <div className=" flex flex-col font-inter px-4 sm:max-w-[450px] mx-auto w-full bg-white rounded-[10px] rounded-bl-none  flex-1 md:justify-center ">
        <div className="   flex flex-col items-center  justify-center">
          <Image
            src={`/assets/images/icons/lock.svg`}
            className=" h-[200px] w-auto"
            width={200}
            height={200}
            alt="twezi logo"
          />
          <h1 className="  mt-4 text-xl font-medium text-center">
            Please Enter Your Email Address to Receive Verification link{" "}
          </h1>
        </div>
        <CustomTextInput
          id="email"
          type="email"
          onChange={handleChange}
          value={values.email}
          label="Email"
          placeholder="Enter your email"
          className="mt-4"
        />
        <AuthButton
          handleClick={() => {
            verify();
            handleSubmit();
          }}
          text="Send link"
          isLoading={isPending}
          className=" mt-5"
        />
      </div>
      <div className=" text-center flex-1 justify-center items-center mt-10">
        <span className=" cursor-default text-divider-300">
          <NextLink href="/login" passHref legacyBehavior>
            <span className="text-primary sm:text-white font-semibold underline">
              Return to Login
            </span>
          </NextLink>
        </span>
      </div>
    </>
  );
};

export default AuthForgotPassword;
