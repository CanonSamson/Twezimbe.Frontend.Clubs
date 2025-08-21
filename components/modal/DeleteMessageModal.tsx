'use client'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomAvatar from '../custom/CustomAvatar'
import moment from 'moment'
import { deleteChannelMessage, MessageType } from '@/api/messaging/group'
import TextRenderer from '../TextRenderer'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useAppDispatch } from '@/lib/hooks'
import { removeChannelMessage } from '@/lib/features/groups/groupMessageSlice'
import { deleteDmMessage } from '@/api/dms/messaging'
import { removeDmMessage } from '@/lib/features/dms/dmMessageSlice'
import { useContextSelector } from 'use-context-selector'
import { UserContext, UserContextType } from '@/contexts/user'

const DeleteMessageModal = () => {
  const { modals, modalData, closeModal } = useSettingModal()
  const dispatch = useAppDispatch()
  const data = modalData?.deleteMessageModal as MessageType | undefined
  const otherUserId = useParams()?.otherUserId as string
  const channelId = useParams()?.channelId as string
  const groupId = useParams()?.groupId as string

  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  )

  const user = {
    id: data?.user?.id || currentUser?.id,
    firstName: data?.user?.profile?.firstName || currentUser?.profile.firstName,
    lastName: data?.user?.profile?.lastName || currentUser?.profile.lastName,
    profileImage:
      data?.user?.profile?.profileImage || currentUser?.profile.profileImage
  }
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (otherUserId) {
        return await deleteDmMessage(data?.id as string)
      } else {
        return await deleteChannelMessage(groupId, channelId, {
          messageId: data?.id as string
        })
      }
    },
    onSuccess: () => {
      if (otherUserId) {
        dispatch(
          removeDmMessage({
            otherUserId,
            messageId: data?.id as string
          })
        )
      } else {
        dispatch(
          removeChannelMessage({
            groupId: groupId as string,
            channelId: channelId as string,
            messageId: data?.id as string
          })
        )
      }

      closeModal('deleteMessageModal')
    },
    onError: (error: any) => {
      toast.error(JSON.stringify(error))
    }
  })

  return (
    <div
      onClick={() => closeModal('deleteMessageModal')}
      className={`${
        modals.deleteMessageModal ? 'flex' : 'hidden'
      } fixed inset-0 bg-black/30 items-center justify-center  z-[55]`}
    >
      <div
        onClick={e => e.stopPropagation()}
        className='bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto z-10 p-6  custom-modal'
      >
        <div className='text-start mb-4'>
          <h4 className='text-[20px] font-Inter'>Delete message</h4>
          <p className='text-[12px] mt-2 font-Roboto'>
            Are you sure you want to delete this message?
          </p>
        </div>

        <div className='bg-[#F5F5F5] flex flex-col rounded-lg shadow-sm w-full p-4 '>
          <div className='flex items-start gap-2 '>
            <div className='flex-1'>
              <div className='flex items-baseline gap-4'>
                <h1 className='text-[15px] font-Inter'>{user?.firstName}</h1>
                <span className='text-[12px] text-gray-500 font-Lato'>
                  {moment(data?.createdAt).format('h:mm A')}
                </span>
              </div>
              <p className=' text-[15px]  text-start font-Roboto'>
                {data?.text && (
                  <TextRenderer value={data?.text} maxLength={200} />
                )}
              </p>
            </div>
            <CustomAvatar
              image={user?.profileImage}
              userFullName={`${user?.firstName} ${user?.lastName}`}
              className='relative top-0'
              imageClassName='w-[50px] h-[50px] rounded-[10px] border overflow-hidden object-top text-[32px] font-bold text-primary'
              labelClassName='flex w-[50px] h-[50px] items-center justify-center overflow-hidden rounded-[10px]'
              alt='profile image'
              showText={false}
              disabled={true}
              isCurrentUser={false}
              iconClassName='size-[28px]'
            />
          </div>
        </div>

        <div className='mt-4 flex justify-end gap-4 items-center'>
          <button
            disabled={isPending}
            onClick={() => closeModal('deleteMessageModal')}
            className='py-2 px-3 border rounded w-24 text-primary'
          >
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className='py-2 px-3 bg-red-600 text-white rounded w-24'
          >
            {isPending ? 'Deleting...' : `Delete`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteMessageModal
