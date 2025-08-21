// ==============================|| PAGE ||============================== //

import AuthResetPassword from "@/sections/auth/auth-forms/AuthResetPassword";

export default function ForgotPasswordPage() {
  return (
    <main className=" sm:bg-primary min-h-screen  pt-10  flex items-center justify-center w-full flex-col ">
      <AuthResetPassword />;
    </main>
  );
}
