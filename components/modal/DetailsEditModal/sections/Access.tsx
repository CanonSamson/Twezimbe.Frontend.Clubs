"use client";

import CustomTextInput from "@/components/input/CustomTextInput";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const Access: React.FC<{
  handleToggleModal: () => void;
  next: () => void;
}> = ({ handleToggleModal, next }) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customRole, setCustomRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [accessError, setAccessError] = useState("");

  const roles = [
    {
      id: "TREASURER",
      label: "Treasurer",
      description:
        "Supports beneficiary onboarding, KYC requests, and communication. Cannot approve members or access financial data.",
    },
    {
      id: "ADMIN",
      label: "Admin",
      description:
        "Has full control of the group, including roles, approvals, financials, and governance.",
    },
    {
      id: "SUPERVISOR",
      label: "Supervisor",
      description:
        "Can approve members, verify KYC, assign roles, manage settings, and send messages. Cannot access financials.",
    },
  ];

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.value);
    if (accessError) setAccessError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomRole(e.target.value);
    if (roleError) setRoleError("");
  };

  const handleNext = () => {
    let valid = true;

    if (!customRole.trim()) {
      setRoleError("Role name is required.");
      valid = false;
    }

    if (!selectedRole) {
      setAccessError("Please select an access level.");
      valid = false;
    }

    if (!valid) return;

    next();
  };

  return (
    <>
      <div className="w-full max-h-[50vh] overflow-y-auto relative px-6 py-8">
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-xl font-bold text-start">Edit Role</h2>
          <button
            onClick={handleToggleModal}
            className="text-divider-200 hover:text-divider-300 transition-colors duration-300"
          >
            <IoClose size={34} />
          </button>
        </div>

        <CustomTextInput
          type="text"
          id="customRole"
          value={customRole.toUpperCase()}
          onChange={handleChange}
          error={roleError}
          label="Role Name"
          placeholder="President"
          inputClassName="bg-gray-50"
          className="flex-1 [&_label]:font-semibold mt-4"
        />
        <p className="text-[14px] text-divider-200 mb-6 mt-2 text-start">
          Give a descriptive name for this role
        </p>

        <div className="text-start space-y-1">
          <h1 className="font-bold text-black text-lg mb-2">
            Set access level for this role
          </h1>
          <p className="text-black text-[12px]">
            Pick the access level this custom role should have by using any of
            Twezimbe’s preset role types as a base.
          </p>
          {accessError && (
            <span className="text-red-500 text-[12px] mt-1 block">
              {accessError}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {roles.map(({ id, label, description }) => (
            <label
              key={id}
              htmlFor={id}
              className={`flex items-start gap-3 p-4 rounded-md cursor-pointer transition-all border ${
                selectedRole === id
                  ? "bg-primary/10 border-primary"
                  : "bg-gray-100 border-transparent"
              }`}
            >
              <input
                type="radio"
                id={id}
                name="roleSelection"
                value={id}
                checked={selectedRole === id}
                onChange={handleSelect}
                className="mt-1 w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-500"
              />
              <div>
                <h1 className="text-[14px] font-semibold text-black">
                  {label}
                </h1>
                <span className="text-[12px] text-black block">
                  {description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 px-4 mb-6 pt-2">
        <button
          className="px-4 py-2 bg-white text-primary border border-gray-300 rounded-md"
          onClick={handleToggleModal}
        >
          Delete Role
        </button>
        <button
          className={`px-4 py-2 text-white rounded-md transition ${
            customRole.trim() && selectedRole
              ? "bg-primary hover:bg-primary-dark"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!customRole.trim() || !selectedRole}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default Access;
