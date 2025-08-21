"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import SiderList from "./sider";
import { useSiderBar } from "@/contexts/siderbar";
import { AiOutlineClose } from "react-icons/ai";
import { getNameInitials } from "@/utils/functions/getNameInitials";
import ProfileSettingsPreview from "@/components/ProfileSettingsPreview";
import { useUser } from "@/contexts/user";
import Link from "next/link";

const Sider: React.FC = () => {
  const pathname = usePathname();
  const [transition, setTransition] = useState(true);
  const {
    siderWidth,
    handleCloseSiderBar,
    setSiderWidth,
    hidden: siderIsHidden,
  } = useSiderBar();
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser({});

  const router = useRouter();

  useEffect(() => {
    if (siderIsHidden) return;

    const handle = document?.querySelector(
      ".resize-sidebar-handle"
    ) as HTMLElement | null;
    const sidebar = document?.querySelector(
      ".resize-sidebar-current"
    ) as HTMLElement | null;

    if (!handle || !sidebar) return;

    let isResizing = false;

    const handleMouseDown = () => {
      isResizing = true;
      setTransition(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const width = e.clientX;
      if (width > 300) {
        setSiderWidth(300);
        (sidebar as HTMLElement).style.width = "250px";
      } else if (width > 80) {
        console.log(width);
        setSiderWidth(width);
        (sidebar as HTMLElement).style.width = `${width}px`;
      } else {
        setSiderWidth(80);
        (sidebar as HTMLElement).style.width = "80px";
      }
    };

    const handleMouseUp = () => {
      isResizing = false;
      setTransition(true);
    };

    handle.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (!siderIsHidden) {
        handle.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [siderIsHidden]);

  if (siderIsHidden) return null;

  return (
    <>
      <div
        className={`tablet-lg:flex-none font-inter prevent-select hidden tablet-lg:flex  h-[100dvh]  sticky top-0  justify-center bg-primary resize-sidebar-current w-[250px] overflow-y-auto ${
          transition ? "transition-[width] duration-200" : "transition-none"
        }`}
      >
        <div
          className="resize-sidebar-handle"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "1px",
            cursor: "ew-resize",
          }}
        />
        <button
          className={`absolute right-[40px] text-white top-[60px] ${
            siderWidth > 250 ? "block" : "hidden"
          }`}
          onClick={handleCloseSiderBar}
        >
          <AiOutlineClose className="w-[24px] h-auto" width={24} />
        </button>
        <div className="w-[80%]  min-h-[100dvh] flex flex-col h-full">
          <div
            className={`mt-[100px] flex justify-center  ${
              siderWidth > 250 ? " mb-[40px]" : " mb-[50px]"
            }`}
          >
            <Link href={`/home`}>
              <div
                className={`h-auto ${
                  siderWidth > 250 ? "w-[60px]" : "w-[60px]"
                }`}
              >
                {loading && (
                  <div className="w-full aspect-square bg-[#65A2CD] rounded-[10px]" />
                )}
                <Image
                  src="/icon/logo.svg"
                  width={0}
                  height={0}
                  alt="Logo"
                  className={`w-full h-auto ${loading && "hidden"}`}
                  priority={true}
                  onLoad={() => setLoading(false)}
                />
              </div>
            </Link>
          </div>
          <SiderList pathname={pathname} siderWidth={siderWidth} />

          <div className=" flex  h-full bg-slate-300 relative flex-1 w-full"></div>
          <div className="   relative pb-20 mt-[35px]   items-center justify-center mx-auto flex w-full ">
            <ProfileSettingsPreview siderWidth={siderWidth}>
              <button
                className={`flex text-white relative items-center w-full hover:opacity-70 transition-all duration-100  justify-center  ${
                  siderWidth > 250 ? "gap-3" : "gap-0"
                }`}
                onClick={() => router.push("/setting")}
              >
                <div className="w-[50px] ">
                  {currentUser?.profile?.profileImage ? (
                    <Image
                      src={currentUser?.profile?.profileImage}
                      className={`w-[50px] h-[50px] object-top  rounded-xl
                  object-cover bg-white flex items-center justify-center `}
                      width={200}
                      height={200}
                      alt={"YC EC"}
                    />
                  ) : (
                    <div
                      className="w-[50px] aspect-square rounded-xl
         bg-white flex items-center font-bold font-inter justify-center
          text-primary text-[22px]  uppercase"
                    >
                      {getNameInitials(
                        `${currentUser?.profile.firstName} ${currentUser?.profile.lastName}`
                      )}
                    </div>
                  )}
                </div>
                {siderWidth > 250 && (
                  <div className={` capitalize  items-start flex flex-col`}>
                    <div className="text-[14px] capitalize">
                      {currentUser?.profile.firstName}
                    </div>
                    <div className="text-[14px] capitalize">
                      {currentUser?.profile.lastName}
                    </div>
                  </div>
                )}
              </button>
            </ProfileSettingsPreview>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sider;
