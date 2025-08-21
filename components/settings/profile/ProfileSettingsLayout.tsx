"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/user";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { uploadUserProfile } from "@/api/upload/user-profile";
import { useState } from "react";
import { toast } from "sonner";
import { updateBasicUserInfo } from "@/api/basic-profile";
import NotificationsDropdown from "../../dropdown/NotificationsDropdown";
import { IoChevronBack } from "react-icons/io5";
import { cn } from "@/lib/utils";

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const routes = [
    {
      name: "basic",
      title: "Basic",
      icon: "/icon/settings.svg",
      path: "/settings/profile/basic",
    },
    {
      name: "socials",
      title: "Socials",
      icon: "/icon/contact.svg",
      path: "/settings/profile/socials",
    },
  ];
  const { currentUser, fetchCurrentUser } = useUser({});

  const [uploading, setUploading] = useState<boolean>(false);
  const [profileUrl, setProfileUrl] = useState<undefined | string>(
    currentUser?.profile.profileImage || undefined
  );
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

  const handleBack = () => {
    window.history.back();
  };

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
              <div className="bg-gradient-to-r flex justify-end max-tablet:justify-center p-10 max-tablet:px-4 px-2 max-tablet:pt-10 max-tablet:pb-10 max-tablet:max-w-[calc(100%-16px)] max-tablet:mx-auto rounded-t-[10px] h-[100px] from-[#DBE9F8] to-[#FEFBF0]">
                <button
                  onClick={handleBack}
                  className={`max-tablet:block hidden max-tablet:-translate-y-6 max-tablet:-translate-x-2 max-tablet:mr-auto h-6 w-6 focus:outline-none`}
                >
                  <IoChevronBack className="h-6 w-6" />
                </button>
              </div>
              <div className="  tablet-lg:p-10 relative">
                <div className="flex items-center gap-5 max-tablet-lg:-mt-[50px] relative max-tablet:left-10 max-tablet:flex-col max-tablet:gap-2 max-tablet:items-start">
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
                  className={`flex items-center justify-between ${
                    paths?.includes(pathName) ? " " : "hidden"
                  } `}
                >
                  <div className="max-tablet:invisible max-tablet:h-0"></div>
                </div>
              </div>
              <div className=" ">
                {paths?.includes(pathName) && (
                  <nav className="w-full mb-4 tablet:px-10">
                    <div className="max-tablet:relative max-tablet:mt-10 max-tablet:flex max-tablet:justify-center">
                      <div className="hidden max-tablet:block absolute bottom-0 left-0 w-full border-b-2 border-gray-200"></div>

                      <ul className="flex mt-10 max-tablet:mt-0 max-tablet:w-full max-tablet:justify-center">
                        {routes.map((route) => (
                          <li
                            key={route.name}
                            className="max-tablet:w-1/2 max-tablet:relative"
                          >
                            <Link
                              className={cn(
                                "px-5 py-2 duration-300 transition-all border-b-2",
                                "max-tablet:border-b-0 max-tablet:w-full max-tablet:block",
                                "max-tablet:text-center max-tablet:text-[16px] max-tablet:font-inter",
                                pathName === route.path
                                  ? "border-primary"
                                  : "border-[#CBD5E1]"
                              )}
                              href={route.path}
                            >
                              {route.title}
                              {pathName === route.path && (
                                <div className="hidden max-tablet:block absolute bottom-0 left-0 w-full border-b-2 border-primary" />
                              )}
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
