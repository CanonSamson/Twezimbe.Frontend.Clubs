'use client'

import Image from 'next/image'

const Hang: React.FC<{
  handleToggleModal: () => void
}> = ({ handleToggleModal }) => {
  return (
    <>
      <div className='max-h-[40vh] w-full overflow-y-auto'>
        <div className='relative'>
          <div className='absolute top-0 right-0 p-4 flex justify-end w-full'></div>
        </div>

        <div className='px-6 py-8'>
          <div className='flex justify-center mb-4'>
            <Image
              src='/icon/Group 42.svg'
              alt='shape'
              width={120}
              height={120}
            />
          </div>

          <div className='text-center space-y-1'>
            <h1 className='font-bold text-black text-lg'>Wallet activated</h1>
            <p className='text-[12px] text-black mb-6 text-center line-clamp-2'>
              Your wallet has been activated. You can now make transactions
              through your wallet and access your wallet ID
            </p>
          </div>
        </div>
      </div>

      <div className='flex p-4 bg-white mx-10 mb-4'>
        <button
          className='flex-1 py-2 bg-primary text-white rounded-none'
          onClick={handleToggleModal}
        >
          Close
        </button>
      </div>
    </>
  )
}

export default Hang
