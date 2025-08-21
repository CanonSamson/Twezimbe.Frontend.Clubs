import CustomDialog from '@/components/custom/CustomDialog'
import AuthButton from '@/components/button/AuthButton'

interface BfLeaveGroupModalProps {
  isOpen: boolean
  toggleModal: (modalName: string, value: any) => void
  isPending: boolean
  mutateLeaveGroup: () => void
}

const Leave: React.FC<BfLeaveGroupModalProps> = ({
  isOpen,
  toggleModal,
  isPending,
  mutateLeaveGroup,
}) => {
  return (
    <CustomDialog
      open={isOpen}
      close={() => {}}
      name='bfLeaveGroupModal'
      contentClassName='sm:max-w-[525px] py-10 z-[55] bg-white custom-modal'

      
    >
      <div className='text-center'>
        <h4 className='text-xl font-semibold'>Are you sure?</h4>
        <p className='text-[13px] mt-2 text-[#969696]'>
        Kindly note that leaving the BF will attract a 5% deduction fee from your wallet
        </p>
        <p className='flex flex-col text-[12px] mt-2 text-[#DE3108]'>
        <span>Deduction fee: UGX250</span>
        <span>Balance: UGX4,750</span>
        </p>
      </div>
      <div className='mt-4 items-center grid grid-cols-2 gap-4'>
        <AuthButton
          text='No, Cancel'
          handleClick={() => toggleModal('bfLeaveGroupModal', null)}
        />
        <AuthButton
          text='Yes, Leave'
          isLoading={isPending}
          handleClick={mutateLeaveGroup}
          className='bg-red-600 text-white'
        />
      </div>
    </CustomDialog>
  )
}

export default Leave
