"use client";
import { ReactNode } from "react";

// project import
import { Toaster } from "sonner";
import { SideBarProvider } from "@/contexts/siderbar";
import { SettingModalProvider } from "@/contexts/modal-setting";

// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageingProvider } from "@/contexts/messaging";
import StoreProvider from "@/app/StoreProvider";
import AuthGuard from "@/utils/route-guard/AuthGuard";
import { UserProvider } from "./user";
import { QuillProvider } from "./quill";
export const queryClient = new QueryClient();

// ==============================|| APP, ROUTER, LOCAL ||============================== //

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <StoreProvider>
        <UserProvider>
          <AuthGuard>
            <SettingModalProvider>
              <MessageingProvider>
                <SideBarProvider>
                  <QuillProvider>{children}</QuillProvider>
                </SideBarProvider>
              </MessageingProvider>
            </SettingModalProvider>
          </AuthGuard>
        </UserProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}
