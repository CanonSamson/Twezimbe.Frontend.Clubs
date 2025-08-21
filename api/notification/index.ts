import axiosServices from '@/utils/axios'


export type GeneralNotificationType = {

  id: string;
  type: string | null;
  meta: any;
  heading: string;
  subHeading: string | null;
  subText: string | null;
  isRead: boolean;
  groupId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;

}

export type PaginationType = {
  total: number,
  limit: number,
  offset: number
  hasMore: number
} | undefined
export type GeneralNotificationResponse = {
  data: {
    success: boolean
    data: GeneralNotificationType[]
    pagination: PaginationType
  }
}

export const getGeneralNotifications = async (params?: {
  [key: string]: any
}): Promise<GeneralNotificationResponse> => {
  return await axiosServices.get(
    `/v1/notification/in-app/notification/general`,
    { params }
  )
}


export const getGeneralUnreadNotificationsCount = async (): Promise<{
  data: { counts: { [key: string]: number }, total: number }
}> => {
  return await axiosServices.get(
    `/v1/notification/in-app/notification/general/unread-count`
  )
}

export const markManyGeneralNotificationsAsRead = async ({ notificationIds }: { notificationIds: string[] }): Promise<{
  data: { success: boolean, data: any }
}> => {
  return await axiosServices.patch(
    `/v1/notification/in-app/notification/general/mark-as-read`, { notificationIds }
  )
}


