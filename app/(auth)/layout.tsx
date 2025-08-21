// PROJECT IMPORTS

// types
import { GuardProps } from "@/types/auth";

// ==============================|| DASHBOARD LAYOUT ||============================== //

export default function Layout({ children }: GuardProps) {
  return (
    <>
      <div className="fixed right-0 left-0 top-0 bottom-0 bg-white">
        {children}
      </div>
    </>
  );
}
