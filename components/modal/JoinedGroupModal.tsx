'use client'
import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { BsHash } from 'react-icons/bs'
import { GoChevronRight } from 'react-icons/go'
import Image from 'next/image'
import { getNameInitials } from '@/utils/functions/getNameInitials'
import Lottie from 'react-lottie'
import * as loadingAnimationData from '../../public/assets/animations/loading.json'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomDialog from '../custom/CustomDialog'
import { useAppSelector } from '@/lib/hooks'

const JoinedGroupModal = () => {
  const { toggleModal } = useSettingModal()
  const { group } = useAppSelector(state => state.group)

  const isPending = false

  // Return early if no group found
  if (!group) {
    return null
  }

  const { iconImage, name, description } = group

  // Return early if group already has all required information
  const hasRequiredInfo = Boolean(iconImage && name && description)
  if (hasRequiredInfo) {
    return null
  }

  if (iconImage && name && description) return <></>

  const setOpen = () => {
    toggleModal('joinedGroupModal')
  }
  return (
    <CustomDialog
      close={() => {}}
      name='joinedGroupModal'
      contentClassName='sm:max-w-[525px] py-10  bg-white'
    >
      <DialogHeader className=' text-center mt-10'>
        {iconImage ? (
          <Image
            className='w-[80px] h-[80px]  object-cover  flex justify-center   mx-auto items-center bg-gray-200 rounded-[5px]'
            width={70}
            height={70}
            src={iconImage}
            alt={group?.name as string}
          />
        ) : (
          <div className='w-[80px] h-[80px]  text-[40px] font-bold uppercase flex justify-center  text-black  mx-auto items-center bg-gray-200 rounded-[5px]'>
            {group?.name && getNameInitials(group?.name as string)}
          </div>
        )}
        <div className='pt-4'>
          <DialogTitle className=' text-center '>Welcome to {name}</DialogTitle>
          <DialogDescription className=' text-center'>
            {description}
          </DialogDescription>
        </div>
      </DialogHeader>
      <div className=' flex flex-col mt-5 '>
        <span className=' text-[12px]'>GET STARTED</span>
        <button
          onClick={() => setOpen()}
          disabled={isPending}
          className=' flex  items-center w-full p-4 rounded-[5px] justify-between bg-primary text-white'
        >
          <div className=' flex items-center gap-4'>
            <BsHash size={24} />
            <div className=' flex flex-col'>
              <span>General</span>
              <span className=' text-[12px]'>#general</span>
            </div>
          </div>
          <div>
            {isPending ? (
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: loadingAnimationData,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }}
                height={44}
                width={44}
              />
            ) : (
              <GoChevronRight size={24} />
            )}
          </div>
        </button>
        <span className=' mt-2 text-[14px] justify-center text-center'>
          Remember to adhere to{' '}
          <span className=' underline text-primary'>Group guidelines</span>
        </span>
      </div>
    </CustomDialog>
  )
}

export default JoinedGroupModal
