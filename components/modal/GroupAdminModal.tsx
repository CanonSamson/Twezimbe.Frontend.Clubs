import { makeUserAdmin, removeAdminMemberRole } from "@/api/group";
import { useSettingModal } from "@/contexts/modal-setting";
import { queryClient } from "@/contexts/ProviderWrapper";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";

const GroupAdminModal = () => {
  const { modals, toggleModal, modalData, closeModal } = useSettingModal();

  const data = modalData?.groupAdminModal;

  const groupId = useParams()?.groupId as string;

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (data?.remove) {
        return removeAdminMemberRole(groupId, data.userId);
      } else {
        return makeUserAdmin(groupId, data.userId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const [resource, id] = query.queryKey;
          return resource === "members" && id === groupId;
        },
      });

      toggleModal(modalData?.groupAdminModal?.previous?.name, {
        ...modalData?.groupAdminModal?.previous?.data,
      });
    },
    onError: (data) => {
      toast.error(data.message || JSON.stringify(data));
    },
  });

  const handleClose = () => {
    closeModal("groupAdminModal");
  };

  return (
    <div
      className={`${
        modals.groupAdminModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-30`}
    >
      <div className="bg-white w-full max-w-[500px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6 relative flex flex-col min-h-[200px]">
        <button
          onClick={() => handleClose()}
          disabled={isPending}
          className="absolute top-4 right-4 text-divider-200"
        >
          <IoMdClose size={24} />
        </button>

        <div className="flex-1 flex flex-col items-start justify-start mt-8">
          <h1 className="text-2xl font-bold mb-2 text-left">Confirm action</h1>
          {data?.remove ? (
            <p className="mb-4 text-[12px] text-left">
              You are about to{" "}
              <span className="text-red-500 font-semibold">remove</span>{" "}
              <span className="text-primary font-semibold">
                {data?.userFullName}
              </span>{" "}
              from the group admin role. They will no longer be able to manage
              group settings, add or remove members, or moderate content. Are
              you sure you want to proceed?
            </p>
          ) : (
            <p className="mb-4 text-[12px] text-left">
              You are about to make{" "}
              <span className="text-primary font-semibold">
                {data?.userFullName}
              </span>{" "}
              a group admin. This will give them the ability to manage group
              settings, add or remove members, and moderate content. Are you
              sure you want to proceed?
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            disabled={isPending}
            onClick={() => {
              toggleModal(data.previous.name, {
                ...data.previous.data,
              });
            }}
            className="border border-gray-400 bg-white text-primary px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="bg-primary text-white px-6 py-2 rounded"
          >
            Confirm {isPending ? "..." : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupAdminModal;
