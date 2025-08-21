"use client";

import GroupRecommendations from "@/components/GroupRecommendations";
import React, { useEffect, useRef, useState } from "react";
import { UserContext } from "@/contexts/user";
import dynamic from "next/dynamic";
import { useContextSelector } from "use-context-selector";
import NotificationsDropdown from "@/components/dropdown/NotificationsDropdown";
import Image from "next/image";
import { RiSearchLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { TfiPlus } from "react-icons/tfi";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";

const AboutMeModal = dynamic(() => import("@/components/modal/AboutMeModal"));

const categories = [
  { id: 1, name: "Education", value: "education" },
  { id: 2, name: "Social", value: "social" },
  { id: 3, name: "Professional", value: "professional" },
  { id: 4, name: "Healthcare", value: "healthcare" },
  { id: 5, name: "Others", value: "others" },
];

const words = [
  "All",
  "Education",
  "Social",
  "Professional",
  "Healthcare",
  "Others",
];

const Home = () => {
  const router = useRouter();
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );
  const [filters, setFilters] = useState<{ [key: string]: any }>({
    pageSize: 10,
    page: 1,
  });
  // const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState<string | undefined>("");
  const [activeTab, setActiveTab] = useState("Groups");
  const [searchActive, setSearchActive] = useState(false);
  const { modals, toggleModal } = useSettingModal();

  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const tabs = ["Groups", "Savings Groups", "Crowd Fund", "Clubs"];

  const groupList = useAppSelector((state: RootState) => state.group.groupList);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case "Groups":
        // Check if running on the client (window is available)
        if (typeof window !== "undefined") {
          const screenWidth = window.innerWidth;
          console.log("Screen width:", screenWidth);
          if (groupList?.length) {
            const firstGroup = groupList[0];

            // Example: conditional navigation based on screen width
            if (screenWidth < 767) {
              // Mobile-specific logic (optional)
              console.log("Navigating on mobile");
              router.push(`/groups/${firstGroup.id}`);

              return;
            }

            const firstChannel = firstGroup.channels[0];
            router.push(`/groups/${firstGroup.id}/${firstChannel.id}`);
          }
        }
        break;

      case "Savings Groups":
        toggleModal("savingsWaitListModal");
        break;
      case "Crowd Fund":
        toggleModal("crowdsWaitListModal");
        break;
      case "Clubs":
        toggleModal("clubsWaitListModal");
        break;
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (timeoutId) clearTimeout(timeoutId);

    setTimeout(() => {
      setQuery(search !== "" ? search : undefined);
    });
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* mobile:px-[50px] px-[10px] tablet:px-[20px] */}
      <AboutMeModal />
      <div
        ref={containerRef}
        className="w-full  h-[100dvh] scroll-container  overflow-y-auto  bg-white"
      >
        <div
          ref={headerRef}
          className={`max-w-[1300px] duration-500 transition-all mx-auto`}
        >
          <div className=" bg-white z-20 mobile:px-[50px] sticky top-0 w-full px-[10px] tablet:px-[20px]">
            <div className="">
              <div className="w-full h-full p-5 bg-[#F9F9F9] rounded-[10px] mt-[30px]">
                <div className="w-full inline-flex justify-between items-center">
                  <div>
                    <p className="text-[16px] tablet:text-[16px] capitalize text-gray-400 font-inter">
                      Hello, {currentUser?.profile.firstName}{" "}
                      {currentUser?.profile.lastName}!
                    </p>
                    <p className="flex items-center text-[12px] tablet:text-[12px] text-gray-400 font-inter">
                      Excited to see you{" "}
                      <Image
                        src="/icon/smile.svg"
                        alt="smiley"
                        width={15}
                        height={15}
                        className="ml-2"
                      />
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <NotificationsDropdown />
                    <div className="block tablet-lg:hidden">
                      <CustomAvatar
                        image="/icon/samsonbeatrice.svg"
                        className="justify-start w-[40px] h-[40px] shrink-0 rounded-full"
                        imageClassName="h-[40px] object-top text-[16px] font-bold text-primary border w-[40px] rounded-full overflow-hidden flex items-center justify-center"
                        labelClassName="h-[40px] border-none w-[40px] rounded-[9px] overflow-hidden flex items-center justify-center"
                        alt="profile image"
                        showText={false}
                        iconClassName="w-[20px] h-[20px]"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-[30px] rounded-[10px]  bg-white">
              <div className="p-5 pb-3">
                {" "}
                <div className="w-full flex justify-between items-center mb-1">
                  {" "}
                  <div className="flex items-center gap-4">
                    <div className="hidden tablet-lg:block">
                      <Image
                        src="/icon/recycle.svg"
                        alt="recycle"
                        width={15}
                        height={15}
                        className="ml-2"
                      />
                    </div>
                    {tabs.map((tab) => (
                      <span
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`text-[14px] tablet:text-[14px] font-inter cursor-pointer ${
                          activeTab === tab
                            ? "text-primary font-semibold"
                            : "text-black"
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                  <div
                    ref={dropdownRef}
                    className="hidden tablet-lg:flex items-center gap-3"
                  >
                    <div className="relative">
                      <div
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer"
                      >
                        <Image
                          src="/icon/menu.svg"
                          alt="menu"
                          width={15}
                          height={15}
                          className="mr-1"
                        />
                      </div>

                      {open && (
                        <div className="absolute top-full right-0 mt-2 w-40 rounded-md shadow-lg bg-white z-[100]">
                          <ul className="py-1">
                            {words.map((word, index) => (
                              <li
                                key={index}
                                className="relative px-2 py-1 cursor-pointer"
                              >
                                <div className="px-2 py-1 text-sm text-gray-700 hover:bg-primary hover:text-white transition duration-150">
                                  {word}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <RiSearchLine
                        size={18}
                        className="text-black cursor-pointer"
                        onClick={() => setSearchActive(!searchActive)}
                      />
                      {searchActive && (
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-[150px] px-2 py-[2px] text-sm border border-gray-300 rounded outline-none transition-all duration-200"
                          onChange={(e) => setSearch(e.target.value)}
                          value={search}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[2px] bg-gray-300" />
            </div>
          </div>

          <div className="mobile:px-[50px] px-[10px] tablet:px-[20px]">
            <div className="relative min-h-[200px] mt-5 rounded-lg overflow-hidden">
              <div className="absolute  w-full h-full z-0">
                <Image
                  src="/icon/overlay.svg"
                  alt="background overlay"
                  width={1000}
                  height={700}
                  className=" object-cover h-full object-right w-full"
                  priority
                />
              </div>

              <div className="relative z-10 p-5">
                <div
                  className={`sticky top-0 pt-5 z-20 duration-500 transition-all`}
                >
                  <div
                    className={`p-5 tablet:p-10  rounded-[10px] duration-500 transition-all`}
                  >
                    <div
                      className={`text-[20px] tablet:text-[36px] font-semibold text-primary overflow-hidden text-left mb-5 opacity-100 max-h-[100px] duration-500 transition-all`}
                    >
                      <h1 className="text-left leading-tight">
                        FIND GROUPS THAT SHARE
                        <br />
                        YOUR VISION ON TWEZI
                      </h1>
                    </div>

                    <div
                      className={`mt-10 duration-500 overflow-hidden overflow-x-auto transition-all`}
                    >
                      <div className="w-full">
                        <ul className="inline-flex items-center font-light gap-4 border-b-2 border-gray-300 justify-start">
                          {categories.map((category) => (
                            <li key={category.id} className="relative pb-1">
                              <button
                                onClick={() =>
                                  setFilters((prev) => {
                                    const newFilters = { ...prev };
                                    if (prev.groupType === category.value) {
                                      delete newFilters.groupType;
                                    } else {
                                      newFilters.groupType = category.value;
                                    }
                                    return newFilters;
                                  })
                                }
                                className={`hover:text-primary text-center font-inter duration-300 transition-all ${
                                  filters.groupType === category.value
                                    ? "text-primary font-medium"
                                    : "text-black"
                                }`}
                              >
                                {category.name}
                              </button>
                              {filters.groupType === category.value && (
                                <div className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-blue-500"></div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-2 tablet:px-10 mt-5 tablet:top-10 pb-[40dvh] relative">
              <GroupRecommendations
                setFilters={setFilters}
                query={query}
                filters={filters}
              />

              {!modals?.homeModal && (
                <div className="fixed bottom-32 right-8 z-50 tablet-lg:hidden">
                  <button
                    onClick={() => {
                      toggleModal("homeModal");
                    }}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition duration-300"
                  >
                    <TfiPlus size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
