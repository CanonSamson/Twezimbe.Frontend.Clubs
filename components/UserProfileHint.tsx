import { FC } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../components/ui/tooltip'
import Image from 'next/image'
import { TbMessageCircle } from 'react-icons/tb'
import { useSettingModal } from '@/contexts/modal-setting'
import { useRouter } from 'next/navigation'

interface UserProfileHintProps {
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  user: {
    firstName: string
    lastName: string
    id: string
    userName?: string
    profileImage?: string
  }
}
const UserProfileHint: FC<UserProfileHintProps> = ({
  children,
  side = 'top',
  align = 'start',
  user
}) => {
  const { toggleModal } = useSettingModal()

  const router = useRouter()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className=' bg-white text-black text-[14px] w-[350px] p-5  rounded-[10px] '
        >
          <div className=' flex items-start gap-4'>
            <div>
              {user.profileImage ? (
                <Image
                  src={user?.profileImage}
                  alt={user?.firstName}
                  width={50}
                  height={50}
                  className=' w-[70px] h-[70px] '
                />
              ) : (
                <div className=' w-[70px] h-[70px] flex uppercase items-center justify-center text-4xl  bg-gray-100 text-primary'>
                  <span className=' text-[40px] font-bold '>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className=''>
              <h4 className=' font-bold capitalize text-[20px] flex items-center gap-2'>
                <strong>
                  {user?.firstName} {user?.lastName}
                </strong>{' '}
                <span className=' h-[10px] rounded-full w-[10px] bg-gray-300 relative flex ' />
              </h4>
              <p className='mt-1'>@{user?.userName}</p>
              <button
                onClick={e => {
                  e.stopPropagation()
                  toggleModal('viewFullProfileModal', user)
                }}
                className='text-[12px] py-2 p-0 text-primary'
              >
                View full profile
              </button>
            </div>
          </div>

          <div className=' mt-4'>
            <button
              onClick={e => {
                e.stopPropagation()
                router.push(`/dms/${user.id}`)
              }}
              className=' flex w-full border justify-center p-2 items-center gap-2 '
            >
              <TbMessageCircle className=' size-4' />
              Message
            </button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default UserProfileHint
