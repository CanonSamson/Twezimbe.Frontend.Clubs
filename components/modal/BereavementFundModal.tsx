"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const BereavementFundModal = () => {
  const { toggleModal, modals } = useSettingModal();
  const pathName = usePathname();
  const [activeRoute, setActiveRoute] = useState(
    ["/basic", "/annual-subscription", "/benefits", "/others"].includes(
      pathName
    )
      ? pathName
      : "/basic"
  );

  const bfId = useParams().bfId as string;
  const bf = useAppSelector((state: RootState) => state.bf.bf);

  const bfData = bf?.[bfId as string];
  const routes = [
    { name: "Basic", title: "Basic", path: "/basic" },
    {
      name: "AnnualSubscription",
      title: "Annual Subscription",
      path: "/annual-subscription",
    },
    { name: "Benefits", title: "Benefits", path: "/benefits" },
    { name: "Others", title: "Others", path: "/others" },
  ];

  return (
    <div
      className={`fixed inset-0 z-[55]  items-center justify-center ${
        modals.bereavementFundModal ? "flex" : " hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => toggleModal("bereavementFundModal")}
      />
      <div className="flex left-0 w-full text-[12px] right-0 top-0 bottom-0 items-center justify-center max-w-xl">
        <div className="flex flex-col">
          <div className="flex flex-col bg-white rounded-t-[10px] rounded-b-[10px] mt-10 relative">
            <div className="bg-gradient-to-r flex justify-end p-10 rounded-t-[10px] rounded-b-[10px] h-[100px] relative">
              <div className="top-4 right-4 flex items-center gap-2">
                <button onClick={() => toggleModal("bereavementFundModal")}>
                  <IoMdClose size={24} />
                </button>
              </div>
            </div>

            <div className="p-10">
              <div className="flex flex-col md:flex-row items-start justify-between ">
                <div className="flex items-center gap-5 -mt-10">
                  <div className="flex flex-col ">
                    <div className="flex items-center gap-2 justify-start mt-2 ">
                      <span className="text-[22px] font-extrabold text-[#1D1C1D]">
                        {bfData?.name || "Benevolent Fund"}
                      </span>
                    </div>
                    <span className="font-medium whitespace-pre-line text-[#49454FCC] text-[16px]">
                      {bfData?.name} is a Benevolent Fund created to <br />{" "}
                      allow users to gather money and grow together
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[10px] mt-6 p-6 space-y-6 bg-[#F9F9F9]">
                <nav className="pt-4 text-left">
                  <ul className="flex flex-wrap justify-start">
                    {routes.map((route) => (
                      <li key={route.name}>
                        <button
                          className={`px-5 py-2 duration-300 transition-all border-b-2 font-bold text-[15px] pr-2 text-[#475569] ${
                            activeRoute === route.path
                              ? "border-primary"
                              : "border-gray-200"
                          }`}
                          onClick={() => setActiveRoute(route.path)}
                        >
                          {route.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                {activeRoute === "/basic" && (
                  <div className="flex flex-wrap justify-start">
                    <div className="pb-10 pl-5">
                      <h1 className="text-[14px] font-medium text-left">
                        1. Maximum beneficiaries per principal: 4
                      </h1>
                      <h2 className="text-[14px] font-medium mb-20 text-left">
                        2. Sign up Membership fee: UGX 400
                      </h2>
                    </div>
                  </div>
                )}
                {activeRoute === "/annual-subscription" && (
                  <div className="flex flex-wrap justify-start">
                    <div className="pb-10 pl-5">
                      <h1 className="text-[14px] font-medium text-left">
                        Annual Subscription details here.
                      </h1>
                    </div>
                  </div>
                )}
                {activeRoute === "/benefits" && (
                  <div className="flex flex-wrap justify-start">
                    <div className="pb-10 pl-5">
                      <h1 className="text-[14px] font-medium text-left">
                        Benefits details here.
                      </h1>
                    </div>
                  </div>
                )}
                {activeRoute === "/others" && (
                  <div className="flex flex-wrap justify-start">
                    <div className="pb-10 pl-5">
                      <h1 className="text-[14px] font-medium text-left">
                        Other details here.
                      </h1>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center w-full">
                <button className="bg-primary text-white w-full py-4 rounded-lg font-bold text-[16px] hover:bg-primary/70 duration-500 transition-all">
                  Request to Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BereavementFundModal;
