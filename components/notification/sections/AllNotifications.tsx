"use client";

import { markManyGeneralNotificationsAsRead } from "@/api/notification";
import NotificationItem from "@/components/dropdown/NotificationsDropdown/components/NotificationItem";
import { fetchGeneralNotifications } from "@/lib/features/notification/generalNotificationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
const AllNotifications = () => {
  const dispatch = useAppDispatch();

  const generalNotifications = useAppSelector(
    (state: RootState) => state.generalNotifications.notifications
  );
  const pagination = useAppSelector(
    (state: RootState) => state.generalNotifications.notificationPagination
  );
  const isLoading = useAppSelector(
    (state: RootState) =>
      state.generalNotifications.loading?.fetchGeneralNotifications
  );

  useEffect(() => {
    dispatch(fetchGeneralNotifications({ limit: 20 }));
    return () => {};
  }, []);

  useEffect(() => {
    const markNotification = async () => {
      if (generalNotifications?.length > 0) {
        const notificationIds = generalNotifications.map((item) => item.id);

        await markManyGeneralNotificationsAsRead({
          notificationIds,
        });
      }
    };
    markNotification();
  }, [generalNotifications]);

  const fetchMoreNotification = () => {
    if (!pagination?.hasMore || isLoading) return;
    dispatch(
      fetchGeneralNotifications({
        offset: pagination.offset + pagination.limit,
      })
    );
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
      <div className=" flex flex-col">
        {!isLoading && generalNotifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <p className="text-gray-500 text-center">
              You have no notifications yet.
            </p>
          </div>
        ) : (
          <>
            {generalNotifications?.map((notification, index) => {
              const showActions = false;
              return (
                <NotificationItem
                  key={index}
                  type={notification.type as any}
                  text={index === 0 ? "" : index === 1 ? "" : ""}
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
        {pagination?.hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={fetchMoreNotification}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 duration-300 transition-all disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default AllNotifications;
