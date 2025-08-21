"use client";

import { useSettingModal } from "@/contexts/modal-setting";


const RoleRemoved = () => {
  const { closeModal } = useSettingModal();

  const handleToggleModal = () => {
    closeModal("removeBfRoleModal");
  };

  return (
    <>
      <button className="absolute top-4 right-8" onClick={handleToggleModal}>
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.96409 6.5L12.6599 2.80423C13.1134 2.35071 13.1134 1.6154 12.6599 1.16151L11.8385 0.340142C11.385 -0.113381 10.6497 -0.113381 10.1958 0.340142L6.5 4.03591L2.80423 0.340142C2.35071 -0.113381 1.6154 -0.113381 1.16151 0.340142L0.340142 1.16151C-0.113381 1.61503 -0.113381 2.35034 0.340142 2.80423L4.03591 6.5L0.340142 10.1958C-0.113381 10.6493 -0.113381 11.3846 0.340142 11.8385L1.16151 12.6599C1.61503 13.1134 2.35071 13.1134 2.80423 12.6599L6.5 8.96409L10.1958 12.6599C10.6493 13.1134 11.385 13.1134 11.8385 12.6599L12.6599 11.8385C13.1134 11.385 13.1134 10.6497 12.6599 10.1958L8.96409 6.5Z"
            fill="#808080"
          />
        </svg>
      </button>
      <div className="pb-12 pt-14 px-9">
        <div className="w-full flex items-center justify-center">
          <svg
            width="132"
            height="132"
            viewBox="0 0 132 132"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity="0.25" cx="66" cy="66" r="66" fill="#FFE5E5" />
            <rect x="32" y="32" width="68" height="68" rx="30" fill="#DC3545" />
            <path
              d="M59.753 79.4501L47.5499 67.247C46.8167 66.5138 46.8167 65.3251 47.5499 64.5919L50.2048 61.9369C50.938 61.2036 52.1268 61.2036 52.8599 61.9369L61.0805 70.1574L78.6881 52.5499C79.4212 51.8167 80.61 51.8167 81.3432 52.5499L83.9981 55.2049C84.7313 55.9381 84.7313 57.1268 83.9981 57.86L62.408 79.4502C61.6748 80.1833 60.4861 80.1833 59.753 79.4501Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="mt-9">
          <p className="w-full text-center font-bold text-[20px] leading-[150%] tracking-[0.03px]">
            Role removed
          </p>
          <p className="mt-2 w-full text-center text-[14px] leading-[150%] tracking-[0%]">
            The role has been successfully removed. Their permissions have been updated accordingly.
          </p>
        </div>
        <div className="w-full mt-9">
          <button
            onClick={handleToggleModal}
            className="w-full py-4 px-3 rounded-md bg-primary text-white text-base leading-[24px] font-medium tracking-[0%]"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};



export default RoleRemoved;