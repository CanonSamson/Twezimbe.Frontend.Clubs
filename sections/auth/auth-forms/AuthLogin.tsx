"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

// next
import Image from "next/image";
import NextLink from "next/link";

// assets
import CustomTextInput from "@/components/input/CustomTextInput";
import AuthButton from "@/components/button/AuthButton";
import * as yup from "yup";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/signin";
import { toast } from "sonner";
import { UserContext, UserContextType } from "@/contexts/user";
import { Context, useContextSelector } from "use-context-selector";
import { useSearchParams, useRouter } from "next/navigation";

// ============================|| AWS CONNITO - LOGIN ||============================ //

const signinSchema = yup.object().shape({
  email: yup.string().email().required("Email address is required"),
  password: yup.string().required(),
});

const AuthLogin = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const fetchCurrentUser = useContextSelector(
    UserContext as Context<UserContextType>,
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
    mutationFn: signIn,
    onError: (error: any) => {
      console.log(error, feedback);
      setFeedback(error.message);
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      const response = data.data;
      console.log(response);
      const user = response?.user;
      if (response.success && response.token) {
        Cookies.set("access-token", response.token, { expires: 365 });

        await fetchCurrentUser({ load: false });
        if (invitationId && user && user.profile.userName) {
          router.replace(`/g/${invitationId}`);
          setAllowRedirect(false);
        } else {
          router.replace("/home");
          setAllowRedirect(true);
        }
        toast.success(response.message);
      }
    },
  });

  const { errors, touched, handleChange, values, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signinSchema,
    onSubmit: (values) =>
      mutate({ ...values, ...(invitationId && { inviteId: invitationId }) }),
  });

  useEffect(() => {
    if (invitationId) {
      setAllowRedirect(false);
      console.log(invitationId, "testing");
    }
    return () => {
      setAllowRedirect(true);
    };
  }, [invitationId]);

  
  return (
    <form
      className=" flex flex-col flex-1 mt-10 md:justify-center"
      onSubmit={handleSubmit}
    >
      <div className=" mt-20 mb-10">
        <Image
          src={`/assets/images/logo/v1.svg`}
          className=" h-[50px] w-auto"
          width={40}
          height={40}
          alt="twezimbe logo"
        />
        <span className="font-roboto text-divider-300 ">
          Welcome, sign in to continue
        </span>
      </div>
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
      <div className=" mt-5 mb-4 flex justify-end">
        <NextLink href={`/forget-pass`}>
          <span className=" text-primary font-semibold">Forgot Password?</span>
        </NextLink>
      </div>

      <AuthButton type="submit" isLoading={isPending} text="Login" />
      {/* {feedback && (
        <div>
          <p className=" text-negative mt-2 text-[14px] capitalize">{feedback}</p>
        </div>
      )} */}
      {/* <div className=' flex  items-center gap-4 max-w-[70%]  my-5 mx-auto w-full '>
        <span className=' h-[1px] flex-1  relative w bg-divider' />
        <span className='text-divider-200'>or sign in with</span>
        <div className=' h-[1px] flex-1 flex relative bg-divider' />
      </div> */}
      {/* <div className='  justify-center flex gap-2 mx-auto'>
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
      <div className=" text-center justify-center items-center mt-10">
        <span className=" cursor-default text-divider-300">
          {"Don’t"} have an account?{" "}
          <NextLink
            href={invitationId ? `/register?Id=${invitationId}` : `/register`}
            passHref
            legacyBehavior
          >
            <span className="text-primary font-semibold">Sign Up</span>
          </NextLink>{" "}
          now.
        </span>
      </div>
    </form>
  );
};

export default AuthLogin;
