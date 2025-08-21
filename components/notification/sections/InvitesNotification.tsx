"use client";

import { acceptChannelInvite, declineChannelInvite } from "@/api/channel";
import {
  acceptBereavementFundInvite,
  declineBereavementFundInvite,
} from "@/api/invite/bf-invite";
import NotificationItem from "@/components/dropdown/NotificationsDropdown/components/NotificationItem";
import {
  fetchReceiverInvite,
  fetchReceiverInviteCount,
} from "@/lib/features/notification/generalNotificationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { InviteType } from "@/types/invite";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { HiMiniCheck } from "react-icons/hi2";
import { toast } from "sonner";

const InvitesNotification = () => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  const { invites } = useAppSelector((state: RootState) => ({
    invites: state.generalNotifications.invites,
    isLoading: state.generalNotifications.loading?.fetchReceiverRequest,
  }));

  useEffect(() => {
    dispatch(fetchReceiverInvite({status: "PENDING"}));
    return () => {};
  }, []);

  return (
    <main
      className={` p-4 ${
        pathName.includes("notification")
          ? " "
          : "flex-1 overflow-y-auto h-full bg-gray-50"
      }`}
    >
      {invites?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-8">
          <p className="text-gray-500 text-center">You have no invites yet.</p>
        </div>
      ) : (
        <div>
          {invites?.map((invite, index) => (
            <Invite key={index} invite={invite} />
          ))}
        </div>
      )}
    </main>
  );
};

const Invite = ({ invite }: { invite: InviteType }) => {
  const [status, setStatus] = useState<"" | "accepted" | "declined">("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Channel invite mutations
  const {
    mutate: acceptChannelInviteMutation,
    isPending: isAcceptingChannelInvite,
  } = useMutation({
    mutationFn: () => acceptChannelInvite(invite?.id as string),
    onSuccess: (data) => {
      toast.success("Invite accepted! Redirecting to the channel...");

      setTimeout(() => {
        router.push(`/bf/${data.invite.groupId}/${data.invite.channelId}`);
      }, 1500);

      dispatch(fetchReceiverInviteCount({ status: "PENDING" }));

      setStatus("accepted");
    },
    onError: (error) => {
      toast.error("Failed to accept invite. Please try again.");
      console.error("Error accepting channel invite:", error);
    },
  });

  const {
    mutate: declineChannelInviteMutation,
    isPending: isDecliningChannelInvite,
  } = useMutation({
    mutationFn: () => declineChannelInvite(invite?.id as string),
    onSuccess: () => {
      setStatus("declined");
      dispatch(fetchReceiverInviteCount({ status: "PENDING" }));
    },
  });

  // Benevolent Fund invite mutations
  const {
    mutate: acceptBereavementFundInviteMutation,
    isPending: isAcceptingBereavementFundInvite,
  } = useMutation({
    mutationFn: () => acceptBereavementFundInvite(invite?.id as string),
    onSuccess: (data) => {
      toast.success("Invite accepted! Redirecting to the fund...");

      // Add a small delay to let user see the toast before redirecting
      setTimeout(() => {
        router.push(
          `/bf/${data.invite.groupId}/${data.invite.fundId}/principal`
        );
      }, 1500);

      dispatch(fetchReceiverInviteCount({ status: "PENDING" }));
      setStatus("accepted");
    },
    onError: (error) => {
      toast.error("Failed to accept invite. Please try again.");
      console.error("Error accepting BF invite:", error);
    },
  });

  const {
    mutate: declineBereavementFundInviteMutation,
    isPending: isDecliningBereavementFundInvite,
  } = useMutation({
    mutationFn: () => declineBereavementFundInvite(invite?.id as string),
    onSuccess: () => {
      setStatus("declined");
      dispatch(fetchReceiverInviteCount({ status: "PENDING" }));
    },
  });

  // Combined pending states
  const isPending =
    isAcceptingChannelInvite ||
    isDecliningChannelInvite ||
    isAcceptingBereavementFundInvite ||
    isDecliningBereavementFundInvite;

  const handleAcceptInvite = () => {
    if (isPending) return;

    if (invite.type === "channel-invite") {
      acceptChannelInviteMutation();
    } else if (invite.type === "bf-invite") {
      acceptBereavementFundInviteMutation();
    }
  };

  const handleDeclineInvite = () => {
    if (isPending) return;

    if (invite.type === "channel-invite") {
      declineChannelInviteMutation();
    } else if (invite.type === "bf-invite") {
      declineBereavementFundInviteMutation();
    }
  };

  // Get current loading state based on invite type
  const getCurrentLoadingState = (action: "accept" | "decline") => {
    if (invite.type === "channel-invite") {
      return action === "accept"
        ? isAcceptingChannelInvite
        : isDecliningChannelInvite;
    } else if (invite.type === "bf-invite") {
      return action === "accept"
        ? isAcceptingBereavementFundInvite
        : isDecliningBereavementFundInvite;
    }
    return false;
  };

  return (
    <NotificationItem
      icon={invite?.sender?.profile?.profileImage}
      type={invite.type || "channel-invite"}
      name={`${invite?.sender?.profile?.firstName} ${invite?.sender?.profile?.lastName}`}
      unread={false}
      bereavementFund={
        invite?.bereavementFund ? invite?.bereavementFund : undefined
      }
      actions={[
        ...(invite.status === "PENDING" && status === ""
          ? [
              {
                text: "Accept",
                handleClick: handleAcceptInvite,
                variant: "primary" as const,
                loading: getCurrentLoadingState("accept"),
              },
              {
                text: "Decline",
                handleClick: handleDeclineInvite,
                variant: "secondary" as const,
                loading: getCurrentLoadingState("decline"),
              },
            ]
          : []),

        ...(status === "accepted" || invite.status === "ACCEPTED"
          ? [
              {
                text: (
                  <div className="flex items-center gap-1">
                    <HiMiniCheck className="size-[20px]" />
                    <span>Accepted</span>
                  </div>
                ),
                handleClick: () => {},
                variant: "secondary" as const,
                loading: false,
              },
            ]
          : []),

        ...(status === "declined" || invite.status === "DECLINED"
          ? [
              {
                text: (
                  <div className="flex items-center gap-1">
                    <AiOutlineClose className="text-red-600 size-[20px]" />
                    <span>Declined</span>
                  </div>
                ),
                handleClick: () => {},
                variant: "secondary" as const,
                loading: false,
              },
            ]
          : []),
      ]}
      createdAt={invite?.createdAt}
      group={invite?.group}
    />
  );
};

export default InvitesNotification;
