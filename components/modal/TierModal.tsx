"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useUser } from "@/contexts/user";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { useLockPage } from "@/hooks/useLockPage";
import { useEffect } from "react";

const TierModal = () => {
  const { modals, toggleModal } = useSettingModal();
  const { lock, unlock } = useLockPage();
  const { currentUser } = useUser({});

  useEffect(() => {
    if (modals.tierModal) {
      lock();
    } else {
      unlock();
    }

    return () => unlock();
  }, [modals.tierModal, lock, unlock]);

  const tiers = [
    {
      name: "Tier 1",
      description:
        "Welcome to the essentials! Get started with our platform and explore the basic features designed to make your experience seamless",
      icon: "/icon/tier1.svg",
      active: true,
      curent: currentUser?.isKyc ? false : true,
      onPressButton: () => {},
    },
    {
      name: "Tier 2",
      description:
        "Level up! Gain access to additional features that empower you to connect and achieve more within our community.",
      icon: "/icon/tier2.svg",
      active: currentUser?.isKyc ? true : false,
      curent: currentUser?.isKyc ? true : false,
      onPressButton: () => {},
    },
  ];

  return (
    <div
      onClick={() => toggleModal("tierModal")}
      className={`${
        modals.tierModal ? "flex" : "hidden"
      } fixed left-0 w-full bg-black/30 text-[12px] right-0 top-0 bottom-0 items-center justify-center z-30 max-tablet:items-end`}
    >
      <div className="bg-white max-w-[400px] flex flex-col rounded-[10px] p-4 max-tablet:max-w-full max-tablet:rounded-t-[10px] max-tablet:rounded-b-none max-tablet:h-[50vh] max-tablet:mb-0 max-tablet:mt-4">
        <Image
          src="/icon/bar.svg"
          alt="gray-bar"
          width={70}
          height={70}
          className="self-center mb-4 max-tablet:block hidden"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleModal("tierModal");
          }}
          className="text-divider-200 w-[28px] pb-4 ml-auto max-tablet:hidden"
        >
          <IoMdClose size={24} />
        </button>
        <div className=" flex  flex-col gap-0 tablet:gap-4">
          {tiers.map((item, index) => {
            return (
              <div
                key={index}
                className={`border p-3 text-start rounded-[10px] duration-300 transition-all ${
                  item.curent ? "border-primary" : "border-divider"
                } mt-8 tablet:mt-0`}
              >
                <div className=" flex justify-between items-center">
                  <div className=" flex  items-center gap-2">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={32}
                      height={32}
                    />
                    <span className=" text-primary  font-semibold  ">
                      {item.name}
                    </span>
                  </div>
                  {item.curent && (
                    <button className="rounded-[10px] border border-divider px-2 py-1">
                      current tier
                    </button>
                  )}
                </div>
                <div
                  className={`mt-3  pl-[32px] text-[#667085] ml-2 ${
                    item.active ? "pb-4" : ""
                  }`}
                >
                  <p>{item.description}</p>
                </div>
                {!item.active && (
                  <div className=" mt-3">
                    <button
                      className="border-primary text-primary  border px-4 py-2 rounded-[10px] w-full"
                      onClick={item.onPressButton}
                    >
                      Upgrade
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TierModal;
