"use client";
import { acceptChannelRequest, declineChannelRequest } from "@/api/channel";
import NotificationItem from "@/components/dropdown/NotificationsDropdown/components/NotificationItem";
import { fetchReceiverRequest } from "@/lib/features/notification/generalNotificationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { RequestType } from "@/types/request";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HiMiniCheck } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import { usePathname } from "next/navigation";

const RequestsNotification = () => {
  const dispatch = useAppDispatch();

  const { requests } = useAppSelector((state: RootState) => ({
    requests: state.generalNotifications.requests,
    isLoading: state.generalNotifications.loading?.fetchReceiverRequest,
  }));

  useEffect(() => {
    dispatch(fetchReceiverRequest({status: "PENDING"}));
    return () => {};
  }, []);

  return (
    <>
      {requests?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-8">
          <p className="text-gray-500 text-center">You have no requests yet.</p>
        </div>
      ) : (
        <div>
          {requests?.map((request, index) => {
            return <Request key={index} request={request} />;
          })}
        </div>
      )}
    </>
  );
};

const Request = ({ request }: { request: RequestType }) => {
  const [status, setStatus] = useState<"" | "accepted" | "declined">("");

  const {
    mutate: acceptChannelRequestMutation,
    isPending: isAcceptingChannelRequest,
  } = useMutation({
    mutationFn: () => acceptChannelRequest(request?.id as string),
    onSuccess: () => {
      setStatus("accepted");
    },
  });

  const {
    mutate: declineChannelRequestMutation,
    isPending: isDecliningChannelRequest,
  } = useMutation({
    mutationFn: () => declineChannelRequest(request?.id as string),
    onSuccess: () => {
      setStatus("declined");
    },
  });

  const isPending = isAcceptingChannelRequest || isDecliningChannelRequest;

  const handleAcceptRequest = () => {
    if (isPending) return;
    if (request.type === "channel-request") {
      acceptChannelRequestMutation();
    }
  };

  const handleDeclineRequest = () => {
    if (isPending) return;
    if (request.type === "channel-request") {
      declineChannelRequestMutation();
    }
  };

  const pathName = usePathname();

  return (
    <main
      className={` p-4 ${
        pathName.includes("notification")
          ? " "
          : "flex-1 overflow-y-auto h-full bg-gray-50"
      }`}
    >
      <NotificationItem
        icon={request?.sender?.profile?.profileImage}
        type={request.type || "channel-request"}
        name={`${request?.sender?.profile?.firstName} ${request?.sender?.profile?.lastName}`}
        unread={false}
        actions={[
          ...(request.status === "PENDING" && status === ""
            ? [
                {
                  text: "Accept",
                  handleClick: handleAcceptRequest,
                  variant: "primary" as const,
                  loading: isAcceptingChannelRequest,
                },
                {
                  text: "Decline",
                  handleClick: handleDeclineRequest,
                  variant: "secondary" as const,
                  loading: isDecliningChannelRequest,
                },
              ]
            : []),

          ...(status === "accepted" || request.status === "ACCEPTED"
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

          ...(status === "declined" || request.status === "DECLINED"
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
        createdAt={request?.createdAt}
        group={request?.group}
      />
    </main>
  );
};

export default RequestsNotification;
