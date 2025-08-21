import axiosServices from "@/utils/axios";

export type SignUpDTO = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  inviteId?: string
};

export type SignUpResponse = {
  data: {
    success: boolean;
    token?: string;
    message: string;

  };
};

export type ValidateOtpDTO = {
  data: {
    success: boolean;
    message: string;
  };
};

export const signUp = (data: SignUpDTO): Promise<SignUpResponse> => {
  return axiosServices.post("/v1/tenancy/auth/signup", data);
};

export const validateSignupOtp = ({
  otp,
  email,
  userId,
}: {
  otp: string;
  email: string;
  userId: string;
}): Promise<ValidateOtpDTO> => {
  return axiosServices.post("/v1/ekyc/basic/signup/otp-verification", {
    otp,
    email,
    userId,
  });
};

export const resendSignupOtp = ({
  email,
}: {
  email: string;
}): Promise<ValidateOtpDTO> => {
  return axiosServices.post("/v1/ekyc/basic/signup/resend-verification", {
    email,
  });
};
