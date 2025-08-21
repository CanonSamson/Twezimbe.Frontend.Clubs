"use client";
import { useSettingModal } from "@/contexts/modal-setting";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeGroupMember } from "@/api/group";

const RemoveGroupMemberModal = () => {
  const { modals, modalData, closeModal, toggleModal } = useSettingModal();
  const data = modalData?.removeGroupMemberModal?.member as {
    id: string;
    fullName: string;
    groupId: string;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => removeGroupMember(data?.groupId, data?.id),
    onSuccess: (data) => {
      console.log(data);
      toast.info("member has been removed");
      modalData?.removeGroupMemberModal?.refetch();
      toggleModal(
        modalData.removeGroupMemberModal?.previous?.name,
        modalData.removeGroupMemberModal?.previous?.data
      );
    },
    onError: (data) => {
      toast.error(data.message || JSON.stringify(data));
    },
  });

  return (
    <div
      onClick={() => closeModal("removeGroupMemberModal")}
      className={`${
        modals.removeGroupMemberModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center  z-[55]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto z-10 p-6  custom-modal"
      >
        <div className="text-start mb-4">
          <div className="text-start mb-4">
            <h4 className="text-[20px] font-Inter">Remove user?</h4>
            <p className="text-[12px] mt-2 font-Roboto">
              You&apos;re about to remove{" "}
              <strong className="  text-primary font-semibold">
                {data?.fullName}
              </strong>{" "}
              from the channel. They will lose access to all channel content and
              will no longer be able to participate in channel discussions or
              activities. Are you sure you want to proceed?
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-4 items-center">
          <button
            disabled={isPending}
            onClick={() =>
              toggleModal(
                modalData.removeGroupMemberModal?.previous?.name,
                modalData.removeGroupMemberModal?.previous?.data
              )
            }
            className="py-2 px-3 border rounded w-24 text-primary"
          >
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="py-2 px-3 bg-red-600 text-white rounded w-24"
          >
            {isPending ? "Removing..." : `Remove`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveGroupMemberModal;
