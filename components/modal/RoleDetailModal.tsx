"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";
import { PiUserFill, PiUsersThreeFill, PiWalletFill } from "react-icons/pi";

// Role configuration that matches the data structure from ManageRoles.tsx
const ROLE_CONFIG: Record<
  string,
  {
    title: string;
    description: string;
    badge: string;
    permissions: string | string[];
    roles: string[];
    staffCount?: number;
    permissionCount?: number;
    backgroundColor?: string;
    topIcon?: string;
    bottomIcon?: string;
  }
> = {
  admin: {
    title: "Admin",
    description: "Has full access to all features",
    badge: "System",
    permissions: [
      "Permissions",
      "These permissions come pre-set for default roles",
    ],
    roles: [
      "View Wallet Balance",
      "View Fund Growth",
      "File Support Requests",
      "Review and approve cases",
      "Generate reports & Insights",
      "View Transaction History",
      "Export Reports",
    ],
    staffCount: 3,
    permissionCount: 7,
    backgroundColor: "bg-white",
    topIcon: "/icon/adminrole.svg",
  },
  principal: {
    title: "Principal",
    description: "Supports KYC and group communication",
    badge: "Default",
    permissions: [
      "Permissions",
      "These permissions come pre-set for default roles",
    ],
    roles: [
      "View Wallet Balance",
      "View Fund Growth",
      "File Support Requests",
      "Review and approve cases",
      "Generate reports & Insights",
      "View Transaction History",
      "Export Reports",
    ],
    staffCount: 2,
    permissionCount: 5,
    backgroundColor: "bg-white",
  },
  supervisor: {
    title: "Supervisor",
    description: "Manages members, no financial access",
    badge: "System",
    permissions: [
      "Permissions",
      "These permissions come pre-set for default roles",
    ],
    roles: [
      "View Wallet Balance",
      "View Fund Growth",
      "File Support Requests",
      "Review and approve cases",
      "Generate reports & Insights",
      "View Transaction History",
      "Export Reports",
    ],
    staffCount: 3,
    permissionCount: 7,
    backgroundColor: "bg-white",
  },
  treasurer: {
    title: "Treasurer",
    description: "Manages wallets, payments & reports",
    badge: "System",
    permissions: [
      "Permissions",
      "These permissions come pre-set for default roles",
    ],
    roles: [
      "View Wallet Balance",
      "View Fund Growth",
      "File Support Requests",
      "Review and approve cases",
      "Generate reports & Insights",
      "View Transaction History",
      "Export Reports",
      "Approve Withdrawals",
    ],
    staffCount: 3,
    permissionCount: 7,
    backgroundColor: "bg-white",
  },
  president: {
    title: "President",
    description: "Has supervisor's access level",
    badge: "Custom",
    permissions: [
      "Permissions",
      "These permissions come pre-set for default roles",
    ],
    roles: [
      "View Wallet Balance",
      "View Fund Growth",
      "File Support Requests",
      "Review and approve cases",
      "Generate reports & Insights",
      "View Transaction History",
      "Export Reports",
    ],
    staffCount: 5,
    permissionCount: 7,
    backgroundColor: "bg-white",
    topIcon: "/icon/adminrole.svg",
  },
};

const getRoleIcon = (role: string) => {
  const normalizedRole = role.toLowerCase();
  if (normalizedRole.includes("admin")) {
    return (
      <div className="bg-blue-200 rounded-full w-10 h-10 flex items-center justify-center relative">
        <Image
          src="/icon/adminrole.svg"
          alt="Admin Role"
          width={24}
          height={24}
        />
        <div className="absolute bottom-0 right-0 bg-blue-200 rounded-full p-0.5 border">
          <PiUserFill className="text-primary w-3 h-3" />
        </div>
      </div>
    );
  } else if (normalizedRole.includes("principal")) {
    return (
      <div className="relative w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center overflow-hidden">
        <PiUserFill className="text-[#7C3AED] w-5 h-5" />
      </div>
    );
  } else if (normalizedRole.includes("supervisor")) {
    return (
      <div className="bg-orange-200 rounded-full w-10 h-10 flex items-center justify-center">
        <PiUsersThreeFill className="text-secondary w-6 h-6" />
      </div>
    );
  } else if (normalizedRole.includes("treasurer")) {
    return (
      <div className="bg-[#FDE68A] rounded-full w-10 h-10 flex items-center justify-center">
        <PiWalletFill className="text-[#D97706] w-6 h-6" />
      </div>
    );
  } else if (normalizedRole.includes("president")) {
    return (
      <div className="bg-blue-200 rounded-full w-10 h-10 flex items-center justify-center relative">
        <Image
          src="/icon/adminrole.svg"
          alt="President Role"
          width={24}
          height={24}
        />
      </div>
    );
  }
};

const RoleDetailModal = () => {
  const { modals, toggleModal, modalData } = useSettingModal();
  const data = modalData?.roleDetailModal;

  const role = data?.role;

  const activeModal = modals?.roleDetailModal;

  if (!activeModal || !role) return null;

  // Get the config using the role directly (since it's already lowercase)
  const config = ROLE_CONFIG[role];
  
  // If no config found, return null or show error
  if (!config) {
    console.warn(`No configuration found for role: ${role}`);
    return null;
  }

  const permissions = Array.isArray(config.permissions)
    ? config.permissions
    : [config.permissions];

  const handleEditClick = () => {
    toggleModal("roleDetailModal");
    toggleModal("detailsEditModal");
  };

  return (
    <div
      onClick={() => toggleModal("roleDetailModal")}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[450px] min-h-[350px] rounded-lg p-6 flex flex-col items-start overflow-hidden ${config.backgroundColor}`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            {getRoleIcon(config.title)}
            <h1 className="text-[16px] font-bold text-black font-inter">
              {config.title}
            </h1>
          </div>
          <span className="px-3 py-1 bg-[#F3BF93] text-black rounded-lg text-xs font-inter">
            {config.badge}
          </span>
        </div>

        <p className="w-full mt-4 text-gray-600 font-inter text-[14px]">
          {config.description}
        </p>

        <div className="mt-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/icon/staff.svg" alt="Staff" width={24} height={24} />
            <span className="text-gray-400 text-[13px]">
              {config.staffCount} Staff Member
              {config.staffCount === 1 ? "" : "s"} Assigned
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/icon/perm.svg"
              alt="Permission"
              width={24}
              height={24}
            />
            <span className="text-gray-400 text-[13px]">
              {config.permissionCount} Permission
              {config.permissionCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="mt-6 w-full">
          <h2 className="text-md font-inter text-black">{permissions[0]}</h2>
          <p className="mt-4 text-gray-600 text-[13px]">{permissions[1]}</p>
        </div>

        <div className="mt-4 w-full flex flex-wrap gap-2">
          {config.roles.map((role, idx) => (
            <span
              key={idx}
              className="bg-[#F2F2F2] text-black font-inter px-3 py-1 rounded-full text-xs"
            >
              {role}
            </span>
          ))}
        </div>
        {config.title.toLowerCase() === "president" && (
          <button
            onClick={handleEditClick}
            className="mt-6 w-full bg-white border border-primary text-primary py-2 rounded-lg text-lg font-semibold"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => toggleModal("roleDetailModal")}
          className="mt-6 w-full bg-primary text-white py-2 rounded-lg text-lg font-semibold"
        >
          Close
        </button>

        {config.bottomIcon && (
          <Image
            src={config.bottomIcon}
            alt="Bottom Icon"
            width={100}
            height={100}
            className="absolute bottom-0 right-0"
          />
        )}
      </div>
    </div>
  );
};

export default RoleDetailModal;
