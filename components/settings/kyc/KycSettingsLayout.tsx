"use client";

import { useState } from "react";
import { useUser } from "@/contexts/user";
import { useSettingModal } from "@/contexts/modal-setting";
import { usePathname } from "next/navigation";
import { uploadUserProfile } from "@/api/upload/user-profile";
import { updateBasicUserInfo } from "@/api/basic-profile";
import NotificationsDropdown from "@/components/dropdown/NotificationsDropdown";
import Image from "next/image";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { toast } from "sonner";
import Link from "next/link";

export default function KycSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const routes = [
    {
      name: "general",
      title: "General",
      icon: "/icon/settings.svg",
      path: "/settings/kyc/general",
    },
    {
      name: "contact",
      title: "Contact",
      icon: "/icon/contact.svg",
      path: "/settings/kyc/contact",
    },
    {
      name: "education_employment",
      title: "Education & Employment",
      icon: "/icon/education.svg",
      path: "/settings/kyc/education-employment",
    },
    {
      name: "next_of_kin",
      title: "Next of Kin Details",
      icon: "/icon/kin.svg",
      path: "/settings/kyc/next-of-kin",
    },
    {
      name: "documents",
      title: "Documents",
      icon: "/icon/documents.svg",
      path: "/settings/kyc/documents",
    },
    {
      name: "declaration",
      title: "Declaration",
      icon: "/icon/declaration.svg",
      path: "/settings/kyc/declaration",
    },
  ];

  const { currentUser, fetchCurrentUser } = useUser({});

  const [uploading, setUploading] = useState<boolean>(false);
  const [profileUrl, setProfileUrl] = useState<undefined | string>(
    currentUser?.profile.profileImage || undefined
  );
  const { toggleModal } = useSettingModal();
  const pathName = usePathname();

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const response = await uploadUserProfile(file);
      if (response.data) {
        await handleUpdateProfile(response.data.url);
      }
      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (url?: string) => {
    const response = await updateBasicUserInfo({
      profileImage: url || profileUrl,
    });

    if (response?.data?.success) {
      fetchCurrentUser({ load: false });
    }
  };

  const paths = routes?.map((route) => route.path);
  const kycPaths = paths;

  return (
    <div
      className="w-full mobile:px-[50px] overflow-x-hidden scroll-container pb-20 h-full overflow-auto "
      style={{ height: "calc(100vh)" }} // Set height to make the container scrollable
    >
      <div className="max-w-[1300px] duration-500 mb-20 transition-all mx-auto">
        <div>
          <div className="w-full max-tablet-lg:hidden h-full p-5 bg-white rounded-[10px] mt-[30px] max-tablet:hidden">
            <div className="w-full inline-flex justify-between items-center">
              <div>
                <p className="text-[14px] capitalize">
                  Hello, {currentUser?.profile.firstName}{" "}
                  {currentUser?.profile.lastName}!
                </p>
                <p className="text-[20px]">How are you today ?</p>
              </div>

              <NotificationsDropdown />
            </div>
          </div>
          <div className=" tablet-lg:bg-white max-tablet-lg:px-2 rounded-t-[10px] mt-5">
            <div className="">
              <div className="bg-gradient-to-r tablet:px-5 flex justify-end max-tablet:justify-center p-10 max-tablet:px-4 px-2 max-tablet:pt-10 max-tablet:pb-10 max-tablet:max-w-[calc(100%-16px)] max-tablet:mx-auto rounded-t-[10px] h-[100px] from-[#DBE9F8] to-[#FEFBF0]">
                <button
                  className={`text-primary/25 flex items-center gap-4 max-tablet:justify-end max-tablet:-translate-y-4 ${
                    kycPaths.includes(pathName)
                      ? "max-tablet:flex"
                      : "max-tablet:hidden"
                  } max-tablet:w-full`}
                >
                  <Image
                    width={28}
                    height={28}
                    src={
                      currentUser?.isKyc ? "/icon/tier2.svg" : "/icon/tier.svg"
                    }
                    alt="tier"
                  />
                  <span>{currentUser?.isKyc ? "tier 2" : "tier 1"}</span>
                </button>
              </div>
              <div className="  tablet-lg:p-10 relative">
                <div className="flex items-center gap-5 max-tablet:-mt-[50px]  relative max-tablet:left-10 max-tablet:flex-col max-tablet:gap-2 max-tablet:items-start">
                  <div className="relative">
                    <CustomAvatar
                      image={profileUrl}
                      className="justify-start"
                      labelClassName="h-[100px] w-[100px]"
                      alt="profile image"
                      showText={false}
                      disabled={uploading}
                      iconClassName="size-[44px]"
                      onFileChange={async (file: File) => {
                        setProfileUrl(URL.createObjectURL(file));
                        toast.promise(handleImageUpload(file), {
                          loading: "Uploading...",
                          success: "User Profile Image Updated Successfully",
                          error: "Upload failed",
                        });
                      }}
                    />
                    <span className="absolute bottom-1 right-4 h-3 w-3 bg-green-600 rounded-full max-tablet:block hidden"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[22px] font-medium">
                      {currentUser?.profile.firstName}{" "}
                      {currentUser?.profile.lastName}
                    </span>
                    <span className="opacity-50">
                      @{currentUser?.profile.userName}
                    </span>
                  </div>
                </div>
                <div
                  className={` items-center justify-between  ${
                    !paths?.includes(pathName) || currentUser?.isKyc
                      ? " hidden"
                      : "flex"
                  } `}
                >
                  <div className="max-tablet:invisible max-tablet:h-0"></div>
                  <div>
                    <button
                      onClick={() => toggleModal("tierModal")}
                      className={`bg-primary text-white rounded-[5px] text-[16px] px-5 py-3 flex items-center justify-center max-tablet:font-Poppins max-tablet:-translate-y-4 max-tablet:ml-auto max-tablet:flex`}
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
              <div className=" ">
                {paths?.includes(pathName) && (
                  <nav className="w-full tablet:px-10 mb-4">
                    <div className=" ">
                      <div className="max-tablet-lg:border-b border-b-gray-300 pb-2 pt-5 max-laptop:block hidden">
                        <div className="flex flex-row gap-1  scrollbar-hide overflow-x-auto py-1 px-2 -mx-2 pl-4">
                          {routes.map((route) => (
                            <Link
                              key={route.name}
                              href={route.path}
                              className={`px-2 py-2 rounded-xl transition-colors flex-shrink-0 flex items-center justify-center ${
                                pathName === route.path
                                  ? "bg-primary text-white"
                                  : "bg-gray-200 hover:bg-gray-300"
                              }`}
                            >
                              <span className="text-[14px] self-center font-medium uppercase tracking-wide whitespace-nowrap">
                                {route.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <ul className="flex max-laptop:hidden">
                        {routes.map((route) => (
                          <li key={route.name}>
                            <Link
                              className={`px-5 py-2 duration-300 transition-all border-b-2 ${
                                pathName === route.path
                                  ? "border-primary"
                                  : "border-gray-200"
                              }`}
                              href={route.path}
                            >
                              {route.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                )}
                <div className=" mt-10">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
