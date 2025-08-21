'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import { IoIosClose } from 'react-icons/io'

const Wallet: React.FC<{
  next: () => void
}> = ({ next }) => {
 
  const { closeModal } = useSettingModal()
  return (
    <>
      <div className='max-h-[40vh] w-full overflow-y-auto'>
        <div className='relative'>
          <div
            onClick={() => {
              closeModal('walletActivationModal')
            }}
            className='absolute top-0 right-0 p-4 flex justify-end w-full'
          >
            <IoIosClose size={25} />
          </div>
        </div>

        <div className='px-6 py-8'>
          <div className='text-center space-y-1 mt-6'>
            <h1 className='font-bold text-black text-xl'>Well done!</h1>
            <p className='text-[14px] text-gray-500 mb-6 text-center line-clamp-2'>
              Well done for filling your KYC, now you can activate your wallet
              and carry out desired transactions
            </p>
          </div>
          <div className='flex p-4 bg-white'>
            <button
              className='flex-1 py-2 bg-primary text-white rounded-lg'
              onClick={() => next()}
            >
              Activate wallet
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wallet
