'use client'

import CustomDialog from '@/components/custom/CustomDialog'
import AuthButton from '@/components/button/AuthButton'
import { useSettingModal } from '@/contexts/modal-setting'

const MembershipPaymentModal = () => {
  const { modalData, closeModal } = useSettingModal()

  const attemptedAction =
    modalData?.membershipPaymentModal?.attemptedAction || 'subscription payment'

  const handleCancel = () => {
    closeModal('membershipPaymentModal')
  }

  return (
    <CustomDialog
      close={handleCancel}
      name='membershipPaymentModal'
      contentClassName='max-w-[450px] py-10 z-[55] bg-white custom-modal'
    >
      <div className='flex flex-col items-center text-center p-0'>
        <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
          <svg
            className='w-6 h-6 text-orange-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>

        <h4 className='text-xl font-semibold mb-4 text-gray-800'>
          Membership Required
        </h4>

        <p className='text-sm text-gray-600 mb-2 leading-relaxed'>
          You need to pay for your membership before you can proceed with{' '}
          {attemptedAction}.
        </p>

        <p className='text-xs text-gray-500 mb-6'>
          Please complete your membership payment to unlock all features and
          continue.
        </p>

        <div className='flex gap-3 w-full'>
          <AuthButton
            handleClick={() => {
              handleCancel()
            }}
            className='flex-1 border-gray-300 bg-white border text-gray-700 hover:bg-gray-50'
            text='Close'
          />
        </div>
      </div>
    </CustomDialog>
  )
}

export default MembershipPaymentModal
