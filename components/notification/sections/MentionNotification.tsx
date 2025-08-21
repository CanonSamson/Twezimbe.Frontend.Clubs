"use client";
import NotificationItem from "@/components/dropdown/NotificationsDropdown/components/NotificationItem";
import { fetchMentionNotifications } from "@/lib/features/notification/generalNotificationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MentionNotification = () => {
  const dispatch = useAppDispatch();

  const mentionNotifications = useAppSelector(
    (state: RootState) => state.generalNotifications.mentionNotifications
  );
  const isLoading = useAppSelector(
    (state: RootState) =>
      state.generalNotifications.loading?.fetchMentionNotifications
  );

  useEffect(() => {
    dispatch(fetchMentionNotifications({}));
    return () => {};
  }, []);

  const pathName = usePathname();

  return (
    <main
    className={` p-4 ${
      pathName.includes("notification") ?  " " : "flex-1 overflow-y-auto h-full bg-gray-50"
    }`}
  >
      {!isLoading && mentionNotifications?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-8">
          <p className="text-gray-500 text-center">You have no mentions yet.</p>
        </div>
      ) : (
        <>
          {mentionNotifications?.map((notification, index) => {
            const showActions = false;
            return (
              <NotificationItem
                key={index}
                type={notification.type as any}
                text={
                  index === 0
                    ? "Bingham Insurance Group"
                    : index === 1
                    ? ""
                    : "Bingham Insurance"
                }
                createdAt={notification.createdAt}
                metadata={notification.meta}
                unread={!notification.isRead}
                actions={
                  showActions
                    ? [
                        {
                          text: "View",
                          handleClick: () => console.log("View fund"),
                          variant: "primary",
                          loading: false,
                        },
                      ]
                    : undefined
                }
              />
            );
          })}
        </>
      )}
    </main>
  );
};

export default MentionNotification;
