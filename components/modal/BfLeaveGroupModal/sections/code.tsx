import CustomDialog from '@/components/custom/CustomDialog'
import AuthButton from '@/components/button/AuthButton'

interface BfLeaveGroupModalProps {
  isOpen: boolean
  toggleModal: (modalName: string, value: any) => void
}

const Code: React.FC<BfLeaveGroupModalProps> = ({
  isOpen,
  toggleModal,
}) => {
  return (
    <CustomDialog
      open={isOpen}
      close={() => {}}
      name='bfLeaveGroupModal'
      contentClassName='sm:max-w-[525px] py-10 z-[55] bg-white custom-modal'

      
    >
      <div className='text-center'>
        <h4 className='text-xl font-semibold'>Enter verification code</h4>
        <p className='text-[13px] mt-2 text-[#969696]'>
        Before you go, kindly verify that it’s you by input <br />the OTP code sent to your email <span className='text-[13px] text-primary font-bold'>ex***@gmail.com</span> 
        </p>
        <div className="flex flex-col items-center gap-3 mt-8">
  <div className="flex gap-2">
    {[...Array(5)].map((_, i) => (
      <input
        key={i}
        type="password"
        maxLength={1}
        className="w-10 h-12 text-center border border-gray-300 text-lg focus:outline-none focus:ring-2 bg-divider-100"
      />
    ))}
  </div>
  </div>
  <p className='text-[#969696] mt-6 text-[13px]'>Didn&apos;t see the code? <span className='text-primary font-bold'>Resend Code</span></p>
      </div>
      <div className='mt-4 items-center gap-4'>
        <AuthButton
          text='Verify'
          handleClick={() => toggleModal('bfLeaveGroupModal', null)}
        />
      </div>
    </CustomDialog>
  )
}

export default Code
