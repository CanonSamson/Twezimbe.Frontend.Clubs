'use client'

import CustomDialog from '@/components/custom/CustomDialog'
import AuthButton from '@/components/button/AuthButton'
import { useSettingModal } from '@/contexts/modal-setting'
import { useMutation } from '@tanstack/react-query'
import { deleteTransitionMember } from '@/api/bereavement-fund/transition'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { queryClient } from '@/contexts/ProviderWrapper'

const DeleteTransitionMemberModal = () => {
  const { modalData, closeModal } = useSettingModal()

  const member = modalData?.deleteTransitionMemberModal?.member || null

  const user = member?.user || null

  const fundId = useParams()?.bfId as string

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTransitionMember(fundId, user?.id as string),
    onSuccess: () => {
      toast.success('Member deleted successfully')
      closeModal('deleteTransitionMemberModal')
      queryClient.invalidateQueries({
        queryKey: ['getTransitionMember', fundId]
      })
    },
    onError: error => {
      toast.error(
        error.message || JSON.stringify(error) || 'Failed to delete member'
      )
    }
  })
  return (
    <CustomDialog
      close={() => {}}
      name='deleteTransitionMemberModal'
      contentClassName='max-w-[450px] py-10 z-[55] bg-white custom-modal'
    >
      <div className='flex flex-col items-center text-center p-0'>
        <h4 className='self-start text-left text-xl font-semibold mb-4'>
          Delete Transition Member
        </h4>
        <p className='self-start text-left text-[13px] font-inter'>
          Are you sure you want to remove {user?.firstName} {user?.lastName}{' '}
          from the transition? This action cannot be undone and the member will
          lose access to transition benefits.
        </p>

        <div className='self-end text-right mt-4 items-center grid grid-cols-2 gap-4'>
          <AuthButton
            text='Cancel'
            handleClick={() => {
              closeModal('deleteTransitionMemberModal')
            }}
            className='rounded-md border border-gray-400 px-3 py-0.5 text-primary bg-white text-[13px] h-11'
          />
          <AuthButton
            text={isPending ? 'Deleting...' : 'Delete Member'}
            className='bg-[#FF0000] text-white rounded-md px-3 py-0.5 text-[13px] h-11 whitespace-nowrap'
            handleClick={() => mutate()}
          />
        </div>
      </div>
    </CustomDialog>
  )
}

export default DeleteTransitionMemberModal
