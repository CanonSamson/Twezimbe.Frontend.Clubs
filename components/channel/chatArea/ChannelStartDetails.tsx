import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";
import { FaHashtag, FaLock } from "react-icons/fa6";
import { IoPencil } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";
import { HiUserPlus } from "react-icons/hi2";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptChannelInvite,
  declineChannelInvite,
  getUserChannelInvite,
  sendChannelRequest,
} from "@/api/channel";
import Lottie from "react-lottie";
import loadingAnimationData from "@/public/assets/animations/loading.json";
import { toast } from "sonner";
import { refetchGroup } from "@/lib/features/groups/groupSlice";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useSettingModal } from "@/contexts/modal-setting";
import useGroup from "@/hooks/userGroup";

const ChannelStartDetails = () => {
  const { groupId } = useParams();
  const channelId = useParams()?.channelId as string;
  const { toggleModal } = useSettingModal();
  const channel = useAppSelector((state) =>
    state.group?.groups[groupId as string]?.channels.find(
      (item) => item.id === channelId
    )
  );

  const { isChannelAdmin } = useGroup();
  const access = channel?.access;

  const dispatch = useAppDispatch();
  const {
    mutate: handleSendChannelRequest,
    isPending: isChannelRequestPending,
    isSuccess: isChannelRequestSuccess,
  } = useMutation({
    mutationFn: () =>
      sendChannelRequest(channelId as string, groupId as string),
    onSuccess: (data) => {
      dispatch(refetchGroup({ groupId: groupId as string }));
      toast.success(data?.data?.message);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { data: inviteData, refetch: retetchInvitation } = useQuery({
    queryKey: ["channel-invite", groupId, channelId],
    queryFn: () => getUserChannelInvite(channelId),
  });

  const invited = inviteData?.data?.invite?.status === "PENDING";
  const invite = inviteData?.data?.invite;
  const requested = !!channel?.request;

  const {
    mutate: acceptChannelInviteMutation,
    isPending: isAcceptingChannelInvite,
  } = useMutation({
    mutationFn: () => acceptChannelInvite(invite?.id as string),
    onSuccess: () => {
      dispatch(refetchGroup({ groupId: groupId as string }));
      retetchInvitation();
      toast.success("Invite accepted successfully");
    },
    onError: () => {
      toast.error("Failed to accept invite");
    },
  });

  const {
    mutate: declineChannelInviteMutation,
    isPending: isDecliningChannelInvite,
  } = useMutation({
    mutationFn: () => declineChannelInvite(invite?.id as string),
    onSuccess: () => {
      dispatch(refetchGroup({ groupId: groupId as string }));
      retetchInvitation();

      toast.success("Invite declined");
    },
    onError: () => {
      toast.error("Failed to decline invite");
    },
  });

  return (
    <div className=" w-full flex flex-col">
      <div className="mt-10 tablet-lg:p-5   h-fit justify-end  pb-[200px] mx-2 tablet-lg:mx-10  flex flex-col ">
        <div>
          <div className=" bg-[#484444] relative w-[70px] h-[70px] tablet:w-[100px] flex items-center justify-center  text-white tablet:h-[100px] rounded-full">
            {!access ? (
              <FaLock className="text-[40px] tablet-lg:text-[50px]" />
            ) : (
              <FaHashtag className=" text-[40px] tablet-lg:text-[50px]" />
            )}
          </div>
          <div className=" mt-3">
            <h2 className=" text-[#6D6D6D] text-3xl tablet-lg:text-4xl font-semibold">
              {!access
                ? invited
                  ? "You've been invited to this channel"
                  : "This is a private channel"
                : `Welcome to #${channel?.name}!`}
            </h2>
            <p className=" text-[#808080] max-w-[600px]">
              {!access
                ? invited
                  ? "You have received an invitation to join this private channel. Accept the invite to access the channel and view messages."
                  : "You need an invite from the admin to access this channel and view messages. Click the button below to request access."
                : `This is the start of the #${channel?.name} channel.`}
            </p>

            {!access ? (
              <>
                <div className="mt-2">
                  {invited ? (
                    <div className="flex gap-3">
                      <button
                        disabled={isAcceptingChannelInvite}
                        onClick={() => acceptChannelInviteMutation()}
                        className="flex justify-between px-4 py-4 rounded-[10px] hover:opacity-85 duration-300 transition-all items-center gap-2 bg-primary text-white"
                      >
                        <div className="flex gap-2 items-center">
                          <FaCheck />
                          Accept Invite
                        </div>
                        {isAcceptingChannelInvite && (
                          <Lottie
                            options={{
                              loop: true,
                              autoplay: true,
                              animationData: loadingAnimationData,
                              rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice",
                              },
                            }}
                            height={24}
                            width={24}
                          />
                        )}
                      </button>
                      <button
                        disabled={isDecliningChannelInvite}
                        onClick={() => declineChannelInviteMutation()}
                        className="flex justify-between px-4 py-4 rounded-[10px] hover:opacity-85 duration-300 transition-all items-center gap-2 border border-red-600 text-red-600"
                      >
                        <div className="flex gap-2 items-center">
                          <FaTimes />
                          Decline
                        </div>
                        {isDecliningChannelInvite && (
                          <Lottie
                            options={{
                              loop: true,
                              autoplay: true,
                              animationData: loadingAnimationData,
                              rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice",
                              },
                            }}
                            height={24}
                            width={24}
                          />
                        )}
                      </button>
                    </div>
                  ) : requested || isChannelRequestSuccess ? (
                    <button className=" flex opacity-75 justify-between px-4 py-4 rounded-[10px] hover:opacity-85 duration-300 transition-all items-center gap-2 bg-primary text-white">
                      <div className="flex gap-2 items-center">
                        <FaCheck />
                        Request sent
                      </div>
                    </button>
                  ) : (
                    <button
                      disabled={isChannelRequestPending}
                      onClick={() => handleSendChannelRequest()}
                      className=" flex justify-between p-4 rounded-[10px] hover:opacity-85 duration-300 transition-all items-center gap-2 bg-primary text-white"
                    >
                      <div className="flex gap-2 items-center">
                        <FaLock />
                        Request access
                      </div>
                      {isChannelRequestPending ? (
                        <Lottie
                          options={{
                            loop: true,
                            autoplay: true,
                            animationData: loadingAnimationData,
                            rendererSettings: {
                              preserveAspectRatio: "xMidYMid slice",
                            },
                          }}
                          height={24}
                          width={24}
                        />
                      ) : (
                        <LuChevronRight className=" size-[24px]" />
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mt-2">
                  <div className=" flex items-center gap-4">
                    {channel.privacy === "PRIVATE" ? (
                      <button
                        onClick={() =>
                          toggleModal("addChannelMembersModal", {
                            channelId: channel.id,
                          })
                        }
                        className=" flex items-center gap-2 text-primary"
                      >
                        <HiUserPlus />
                        Invite members
                      </button>
                    ) : null}

                    {isChannelAdmin && (
                      <button
                        onClick={() =>
                          toggleModal("groupDetailsModal", {
                            activeTab: "about",
                          })
                        }
                        className=" flex items-center gap-2 text-primary"
                      >
                        <IoPencil />
                        Edit channel
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelStartDetails;
