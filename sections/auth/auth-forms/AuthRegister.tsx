"use client";

import React, { useState } from "react";

// next
// import Image from 'next/image'
import NextLink from "next/link";

// assets
import CustomTextInput from "@/components/input/CustomTextInput";
import AuthButton from "@/components/button/AuthButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/api/signup";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { UserContext, UserContextType } from "@/contexts/user";
import { useSearchParams, useRouter } from "next/navigation";
import { useContextSelector } from "use-context-selector";
// import GoogleButtonSign from '@/components/button/GoogleButtonSign'

// const Google =  '/assets/images/icons/google.svg'
// const FaceBook = '/assets/images/icons/facebook.svg'

// ============================|| AWS CONNITO - LOGIN ||============================ //

const signupSchema = yup.object().shape({
  email: yup.string().email().required("Email address is required"),
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const AuthRegister = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const fetchCurrentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.fetchCurrentUser
  );
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("Id");
  const setAllowRedirect = useContextSelector(
    UserContext,
    (state: UserContextType) => state.setAllowRedirect
  );

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onError: (error: any) => {
      console.log(error);
      setFeedback(error.message);
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      const response = data.data;

      console.log(response, "response");
      if (response.success && response.token) {
        Cookies.set("access-token", response.token, { expires: 365 });
        await fetchCurrentUser({ load: false });
        router.replace("/register/check-mail");

        toast.success(response.message);
      }
    },
  });

  const { errors, touched, handleChange, values, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: (formValues) => {
      setAllowRedirect(false);

      mutate({
        email: formValues.email,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        password: formValues.password,
        ...(invitationId && { inviteId: invitationId }),
      });
    },
  });

  return (
    <form
      className=" pb-20  flex flex-col  flex-1 mt-10 md:justify-center "
      noValidate
      onSubmit={handleSubmit}
    >
      <div className=" mt-20 mb-10">
        <h1 className=" text-2xl font-semibold">Create an account</h1>
        <span className=" cursor-default text-divider-300">
          Already have an account?{" "}
          <NextLink
            href={invitationId ? `/login?Id=${invitationId}` : `/login`}
            passHref
            legacyBehavior
          >
            <span className="text-primary font-semibold">Sign In</span>
          </NextLink>
        </span>
      </div>
      <CustomTextInput
        type="text"
        id="firstName"
        onChange={handleChange}
        value={values.firstName}
        error={touched.firstName ? errors?.firstName : undefined}
        label="First Name"
        placeholder="Enter first name"
        className="mt-4"
      />
      <CustomTextInput
        type="text"
        id="lastName"
        onChange={handleChange}
        value={values.lastName}
        error={touched.lastName ? errors?.lastName : undefined}
        label="Last Name"
        placeholder="Enter last name"
        className="mt-4"
      />

      <CustomTextInput
        type="email"
        id="email"
        onChange={handleChange}
        value={values.email}
        error={touched.email ? errors?.email : undefined}
        label="Email"
        placeholder="Enter your email"
        className="mt-4"
      />
      <CustomTextInput
        type="password"
        id="password"
        onChange={handleChange}
        value={values.password}
        error={touched.password ? errors?.password : undefined}
        label="Password"
        placeholder="Enter password"
        className=" mt-4"
      />

      <CustomTextInput
        type="password"
        id="confirmPassword"
        onChange={handleChange}
        value={values.confirmPassword}
        error={touched.confirmPassword ? errors?.confirmPassword : undefined}
        label="Confirm Password"
        placeholder="Confirm password"
        className=" mt-4"
      />

      <div className=" mt-4">
        <span>
          By clicking the create account button below, you agree to the{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/terms`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="underline text-primary">Terms of Twezi</span>
          </a>{" "}
          and acknowledge the{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/privacy`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="underline text-primary">privacy policy</span>
          </a>
          ,
        </span>
      </div>
      <AuthButton
        handleClick={() => handleSubmit()}
        isLoading={isPending}
        text="Create my account"
        className="mt-5"
      />
      {feedback && (
        <div>
          <p className=" text-negative mt-2 capitalize">{feedback}</p>
        </div>
      )}

      {/* <div className=' flex  items-center gap-4 max-w-[70%] my-5 mx-auto w-full '>
        <span className=' h-[1px] flex-1  relative w bg-divider' />
        <span className='text-divider-200'>or sign up with</span>
        <div className=' h-[1px] flex-1 flex relative bg-divider' />
      </div> */}
      {/* <div className='  justify-center flex gap-2 mx-auto  pb-20'>
        <GoogleButtonSign>
          <button
            type='button'
            className=' inline-flex border border-divider rounded-full p-1'
          >
            <Image src={Google} alt='Google' width={40} height={40} />
          </button>
        </GoogleButtonSign>
        <div className=' inline-flex border border-divider rounded-full p-1'>
          <Image src={FaceBook} alt='Google' width={40} height={40} />
        </div>
      </div> */}
    </form>
  );
};

export default AuthRegister;
