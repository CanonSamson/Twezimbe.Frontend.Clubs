'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import { useAppDispatch } from '@/lib/hooks'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { leaveGroup } from '@/api/group'
import { useMutation } from '@tanstack/react-query'
import { fetchGroupList } from '@/lib/features/groups/groupSlice'
import Exit from './sections/exit'
import Why from './sections/why'
import { useAppSelector } from '@/lib/hooks'
import { RootState } from '@/lib/store'
// import Feedback from './sections/feedback'

const LeaveGroupModal = () => {
  const { modals, toggleModal, modalData } = useSettingModal()
  const { groupId } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const group = useAppSelector((state: RootState) => state.group.group)

  const data = modalData?.leaveGroupModal
  const { mutate: mutateLeaveGroup, isPending } = useMutation({
    mutationKey: ['leaveGroup', groupId as string],
    mutationFn: () => leaveGroup(groupId as string),
    onSuccess: async () => {
      toggleModal('leaveGroupModal', null)
      dispatch(fetchGroupList())
      toast.success('Left group successfully')
      router.replace('/home')
    },
    onError: (error: any) => {
      toast.error(error.error || 'Failed to leave group')
    }
  })

  return (
    <>
      {modals?.leaveGroupModal && (
        <>
          <Exit
            isOpen={data.step === 2}
            toggleModal={toggleModal}
            isPending={isPending}
            mutateLeaveGroup={mutateLeaveGroup}
          />
          {/* <Feedback isOpen={data.step === 2}/> */}
          <Why isOpen={data.step === 1}
          group={group} />
        </>
      )}
    </>
  )
}

export default LeaveGroupModal
