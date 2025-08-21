'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import { useAppDispatch } from '@/lib/hooks'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { leaveGroup } from '@/api/group'
import { useMutation } from '@tanstack/react-query'
import { fetchGroupList } from '@/lib/features/groups/groupSlice'
// import { useAppSelector } from '@/lib/hooks'
// import { RootState } from '@/lib/store'
import Leave from './sections/leave'
import { useState } from 'react'
import Code from './sections/code'
import Withdrawal from './sections/withdrawal'
import Reason from './sections/reason'
// import Feedback from './sections/feedback'

const BfLeaveGroupModal = () => {
  const { modals, toggleModal } = useSettingModal()
  const { groupId } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [step, setStep] = useState(1)

//   const group = useAppSelector((state: RootState) => state.group.group)

  

  const { mutate: mutateLeaveGroup, isPending } = useMutation({
    mutationKey: ['leaveGroup', groupId as string],
    mutationFn: () => leaveGroup(groupId as string),
    onSuccess: async () => {
      toggleModal('bfLeaveGroupModal', null)
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
      {modals?.bfLeaveGroupModal && (
        <>
        {step === 1 && (
          <Leave
            isOpen
            toggleModal={toggleModal}
            isPending={isPending}
            mutateLeaveGroup={() => {
                setStep(4)
                mutateLeaveGroup()
            }}
            
          />
        )}
          {step === 2 && (
            <Code
              isOpen
              toggleModal={toggleModal}
          
            />
          )}
           {step === 3 && (
            <Withdrawal
              isOpen
              toggleModal={toggleModal}
         
            />
          )}
            {step === 4 && (
            <Reason
              isOpen
              toggleModal={toggleModal}
           
            />
          )}
       </>
      )}
    </>
  )
}

export default BfLeaveGroupModal
