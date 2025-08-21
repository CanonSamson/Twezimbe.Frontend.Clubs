'use client'

import {
  getGroupByInviteLink,
  GroupLinkDataResponseData,
  joinGroupByInviteLink
} from '@/api/groupInvite'
import AuthButton from '@/components/button/AuthButton'
import { useSettingModal } from '@/contexts/modal-setting'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/lib/hooks'
import { fetchGroupList } from '@/lib/features/groups/groupSlice'
import { useContextSelector } from 'use-context-selector'
import { UserContext, UserContextType } from '@/contexts/user'

const GroupInvitation: FC = () => {
  const { linkId } = useParams()
  const [isPending, setIsPending] = useState(false)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const setAllowRedirect = useContextSelector(
    UserContext,
    (state: UserContextType) => state.setAllowRedirect
  )
  const [data, setData] = useState<GroupLinkDataResponseData | null>(null)

  const groupData = data?.group
  const senderData = data?.sender

  const handleGetGroypByInviteLink = async () => {
    try {
      const response = await getGroupByInviteLink(linkId as string)

      if (response.data) {
        setData(response.data)
      }
    } catch (error: any) {
      if (error?.message === 'Token not provided') {
        router.replace(`/login?Id=${linkId}`)
      } else {
        console.log(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setAllowRedirect(false)
    handleGetGroypByInviteLink()

    return () => {
      setAllowRedirect(true)
    }
  }, [linkId])

  const router = useRouter()
  const { toggleModal } = useSettingModal()

  const handleJoinGroup = async () => {
    try {
      setIsPending(true)
      const data = await joinGroupByInviteLink(linkId as string)
      if (data.data.success) {
        dispatch(fetchGroupList())
        const groupId = groupData?.id
        setAllowRedirect(true)

        router.push(`/groups/${groupId}/${data?.data?.generalChannelId}`)
        toast.success(data.data.message)

        toggleModal('joinedGroupModal')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsPending(false)
    }
  }

  if (isLoading) return <LoadingSketch />

  return (
    <div className='bg-primary h-screen w-full  flex items-center justify-center font-inter'>
      <div className='justify-center items-center py-20 shadow-md flex flex-col font-inter px-4 sm:max-w-[450px] mx-auto w-full bg-white rounded-[10px] rounded-bl-none flex-1 md:justify-center'>
        <div className='flex items-center justify-center'>
          <Image
            src='/assets/images/logo/v1.svg'
            className='h-[50px] w-auto'
            width={40}
            height={40}
            alt='twezi logo'
          />
        </div>

        {groupData?.iconImage ? (
          <Image
            src={groupData?.iconImage}
            className='w-[70px] h-[70px] bg-slate-300 rounded-[5px] my-7'
            width={70}
            height={70}
            alt=' logo'
          />
        ) : (
          <div className='w-[70px] h-[70px] bg-slate-300 flex items-center object-cover justify-center rounded-[5px] my-7'>
            <p className='text-[50px] leading-none  flex items-center justify-center text-slate-400'>
              {groupData?.name[0]}
            </p>
          </div>
        )}
        <div className='  text-center'>
          <h1 className='mt-2 text-[20px]  font-medium'>
            {senderData?.firstName} has invited you to join{' '}
          </h1>
          <p className='mt-2 text-[18px] font-semibold'>{groupData?.name}</p>
        </div>

        <div className=' w-full'>
          <AuthButton
            handleClick={handleJoinGroup}
            text='Accept Invite'
            isLoading={isPending}
            disabled={isPending || isLoading}
            className='mt-10'
          />
        </div>
      </div>
    </div>
  )
}

export default GroupInvitation

const LoadingSketch = () => {
  return (
    <div className='bg-primary h-screen w-full flex items-center justify-center font-inter'>
      <div className='justify-center items-center py-20 shadow-md flex flex-col font-inter px-4 sm:max-w-[450px] mx-auto w-full bg-white/90 rounded-[10px] rounded-bl-none flex-1 md:justify-center'>
        <div className='flex items-center bg-gray-300 animate-pulse rounded justify-center'>
          <Image
            src='/assets/images/logo/v1.svg'
            className='h-[50px] w-auto opacity-0'
            width={40}
            height={40}
            alt='twezi logo'
          />
        </div>
        <div className='w-[70px] h-[70px] bg-gray-300 rounded-[5px] my-7 animate-pulse' />

        <div className='text-center w-full'>
          <div className='h-6 bg-gray-300 rounded w-3/4 mx-auto mt-2 animate-pulse' />
          <div className='h-5 bg-gray-300 rounded w-1/2 mx-auto mt-2 animate-pulse' />
        </div>

        <div className='w-full mt-10'>
          <div className='h-12 bg-gray-300 rounded w-full animate-pulse' />
        </div>
      </div>
    </div>
  )
}
