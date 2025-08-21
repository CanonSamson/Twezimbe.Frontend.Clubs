"use client";

import CustomAvatar from "@/components/custom/CustomAvatar";
import React from "react";
import {
  acceptChannelRequest,
  declineChannelRequest,
  getChannelRequests,
} from "@/api/channel";
import { queryClient } from "@/contexts/ProviderWrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

const RequestsChatView = () => {
  const { channelId } = useParams();
  const [acceptingStates, setAcceptingStates] = useState<
    Record<string, boolean>
  >({});
  const [decliningStates, setDecliningStates] = useState<
    Record<string, boolean>
  >({});

  const { data, isLoading } = useQuery({
    queryKey: ["getChannelRequests", channelId],
    queryFn: async () => getChannelRequests(channelId as string),
    enabled: !!channelId,
  });

  const {
    mutate: mutateAcceptChannelRequest,
    isPending: isPendingAcceptChannelRequest,
  } = useMutation({
    mutationFn: async (request: { id: string }) => {
      setAcceptingStates((prev) => ({ ...prev, [request.id]: true }));
      return acceptChannelRequest(request?.id as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getChannelRequests", channelId],
      });
    },
    onSettled: (_, __, request) => {
      setAcceptingStates((prev) => ({ ...prev, [request.id]: false }));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    mutate: mutateDeclineChannelRequest,
    isPending: isPendingDeclineChannelRequest,
  } = useMutation({
    mutationFn: async (request: { id: string }) => {
      setDecliningStates((prev) => ({ ...prev, [request.id]: true }));
      return declineChannelRequest(request?.id as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getChannelRequests", channelId],
      });
    },
    onSettled: (_, __, request) => {
      setDecliningStates((prev) => ({ ...prev, [request.id]: false }));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleAccept = (requestId: string) => {
    mutateAcceptChannelRequest({ id: requestId });
  };

  const handleDecline = (requestId: string) => {
    mutateDeclineChannelRequest({ id: requestId });
  };

  return (
    <div className="max-h-screen mb-[70px] flex flex-col gap-2">
      {data?.data?.requests?.map((request, index) => {
        const fullName = `${request.sender.profile?.firstName} ${request.sender.profile?.lastName}`;
        const isAccepting = acceptingStates[request.id];
        const isDeclining = decliningStates[request.id];

        const disabled =
          isPendingAcceptChannelRequest || isPendingDeclineChannelRequest;

        return (
          <>
            <div
              key={index}
              className="flex items-center bg-white  justify-between p-3 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <CustomAvatar
                  image={request.sender.profile?.profileImage}
                  className="group justify-start w-[45px] h-[45px]"
                  imageClassName="h-[45px] font-bold flex text-primary justify-center items-center w-[45px] rounded-[12px] border object-cover"
                  labelClassName="border-none h-[45px] w-[45px]"
                  alt="Profile image"
                  showText={false}
                  disabled
                  userFullName={fullName}
                />

                <div className="flex items-center gap-2">
                  {fullName}
                  <div className="w-2 h-2 bg-green-700 rounded-full" />
                </div>
              </div>

              <div className="flex gap-2">
                {request?.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => handleAccept(request.id)}
                      disabled={isAccepting || disabled}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAccepting ? "Accepting..." : "Accept"}
                    </button>

                    <button
                      onClick={() => handleDecline(request.id)}
                      disabled={isDeclining || disabled}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-transparent text-primary border border-primary hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeclining ? "Declining..." : "Decline"}
                    </button>
                  </>
                ) : request?.status === "DECLINED" ? (
                  <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-transparent text-primary border border-primary hover:bg-red-50">
                    Declined
                  </button>
                ) : (
                  <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-transparent text-primary border border-primary hover:bg-red-50">
                    Accepted
                  </button>
                )}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default RequestsChatView;
