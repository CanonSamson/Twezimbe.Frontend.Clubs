import { sendBereavementFundInvite } from "@/api/invite/bf-invite";
import { useSettingModal } from "@/contexts/modal-setting";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const InviteAsPrincipalButton = () => {
  const { toggleModal, closeModal, modalData } = useSettingModal();
  const bfId = useParams()?.bfId as string;
  const groupId = useParams()?.groupId as string;

  const user = modalData.viewBfProfileModal?.user;

  const { mutate: invitePrincipal, isPending } = useMutation({
    mutationFn: () =>
      sendBereavementFundInvite(bfId, groupId, {
        receiverId: user.userId,
      }),
    onSuccess: () => {
      // Close the current modal first
      closeModal("viewBfProfileModal");
      // Then open the success modal
      toggleModal("principalInvitedModal");
    },
    onError: (error) => {
      console.error("Failed to send invite:", error);

      toast.error(error.message || JSON.stringify(error))
      // You can add error handling here, like showing an error toast
    },
  });

  const handleCancel = () => {
    closeModal("viewBfProfileModal");
  };

  const handleInvite = () => {
    if (user?.userId && bfId && groupId) {
      invitePrincipal();
    }
  };

  return (
    <div className="flex w-full gap-2 mt-4">
      <button 
        onClick={handleCancel}
        className="w-1/2 text-primary bg-white border border-gray-300 rounded px-4 py-2"
        disabled={isPending}
      >
        Cancel
      </button>
      <button
        onClick={handleInvite}
        disabled={isPending || !user?.userId}
        className="w-1/2 text-white bg-primary border border-gray-300 rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Sending..." : "Invite principal"}
      </button>
    </div>
  );
};

export default InviteAsPrincipalButton;