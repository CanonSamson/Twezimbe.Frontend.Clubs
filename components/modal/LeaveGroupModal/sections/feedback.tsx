import CustomDialog from '@/components/custom/CustomDialog'
import { useSettingModal } from '@/contexts/modal-setting'

interface FeedBackModalProps {
  isOpen: boolean
}

const Feedback: React.FC<FeedBackModalProps> = ({ isOpen }) => {
  const { closeModal, updateModalData } = useSettingModal()

  return (
    <CustomDialog
      open={isOpen}
      close={() => closeModal('leaveGroupModal')}
      name='leaveGroupModal'
      contentClassName='sm:max-w-[440px] p-0 z-[55] overflow-hidden rounded-xl custom-modal'
    >
      <div className='flex flex-col'>
        <div className='px-6 pt-8 pb-6 text-center bg-white text-[#000000] text-[20px]'>
          <h4 className='text-2xl font-extrabold'>Feedback submitted</h4>
          <p className='text-[12px] mt-3 font-roboto text-[#000000]'>
            Thank you for your feedback! We&apos;re always looking to make
            things better, and your feedback helps us do just that.
          </p>
        </div>

        <div className='bg-[#F2F2F2] px-6 py-5'>
          <div className='flex justify-end'>
            <button
              onClick={() => updateModalData('leaveGroupModal', { step: 3 })}
              className='px-8 py-2.5 text-base bg-primary rounded-lg text-white hover:bg-primary-dark/90 transition-colors'
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </CustomDialog>
  )
}

export default Feedback
