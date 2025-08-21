import CustomDialog from "@/components/custom/CustomDialog";
import AuthButton from "@/components/button/AuthButton";
import { useSettingModal } from "@/contexts/modal-setting";
import { useMutation } from "@tanstack/react-query";
import { deleteChannel } from "@/api/channel";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { groupBaseUrl } from "@/utils/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { deleteGroupChannel } from "@/lib/features/groups/groupSlice";

const ChannelDeletionModal = () => {
  const { toggleModal, modalData, closeModal } = useSettingModal();

  const groupId = useParams().groupId as string;
  const channel = modalData?.channelDeletionModal?.channel;

  const data = modalData?.channelDeletionModal;
  const handleCancel = () => {
    closeModal("channelDeletionModal");
    toggleModal(data.previous.name, data.previous.data);
  };

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteChannel(channel?.id as string),
    mutationKey: ["delete-channel", channel?.id as string],
    onError: (data) => {
      console.log(data, "data");
      toast.error(data?.message || "Something went wrong...");
    },
    onSuccess: (data) => {
      if (data.data?.channel.id) {
        router.replace(groupBaseUrl(groupId, data.data?.generalChannel?.id));
        closeModal("channelDeletionModal");

        dispatch(
          deleteGroupChannel({
            groupId: groupId,
            channel: {
              id: data.data?.channel.id,
            },
          })
        );

        console.log({ onSuccess: data.data });
        toast.success("Channel deleted successfully!");
      }
    },
  });

  return (
    <CustomDialog
      close={() => {}}
      name="channelDeletionModal"
      disabled={isPending}
      contentClassName="max-w-[450px] py-10 z-[55] bg-white custom-modal"
    >
      <div className="flex flex-col items-center text-center p-0">
        <h4 className="self-start text-left text-xl font-semibold mb-4">
          Delete {channel?.name}?
        </h4>
        <p className="self-start text-left text-[13px] font-inter">
          You are about to permanently delete this channel. All channel data,
          including messages and files, will be erased and cannot be recovered.
          This action is irreversible. Are you sure you want to proceed?
        </p>

        <div className="self-end text-right mt-4  text-[13px] font-medium items-center grid grid-cols-2 gap-2">
          <AuthButton
            text="Cancel"
            disabled={isPending}
            handleClick={() => handleCancel()}
            className="rounded-md border border-gray-400 text-[13px] px-3 !py-2 !h-auto text-primary bg-white "
          />
          <AuthButton
            disabled={isPending}
            handleClick={() => mutate()}
            text={`Proceed ${isPending ? "..." : ""}`}
            className="bg-[#FF0000] text-white rounded-md px-3  font-medium  !py-2 !h-auto   text-[14px] whitespace-nowrap1"
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default ChannelDeletionModal;
