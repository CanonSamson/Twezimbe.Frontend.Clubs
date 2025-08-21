import { FC, useState } from 'react'
import { RecommendedGroupType } from '@/types/groups'
import { joinPublicGroup } from '@/api/group'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { AiOutlineLoading } from 'react-icons/ai'
import { useSettingModal } from '@/contexts/modal-setting'
import { useAppDispatch } from '@/lib/hooks'
import { fetchGroup, fetchGroupList } from '@/lib/features/groups/groupSlice'

const JoinGroupButton: FC<RecommendedGroupType> = ({ id }) => {
  const { toggleModal } = useSettingModal()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const dispatch = useAppDispatch()
  const handleJoinGroup = async () => {
    try {
      setIsPending(true)
      const data = await joinPublicGroup(id)
      if (data.data.success) {
        dispatch(fetchGroupList())
        await dispatch(fetchGroup({ groupId: id }))
        router.push(`/groups/${id}/${data?.data?.generalChannelId}`)
        toast.success(data.data.message)

        toggleModal('joinedGroupModal')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      disabled={isPending}
      onClick={handleJoinGroup}
      className='tablet:px-4 tablet:py-2 py-1 w-full  border  bg-white  border-primary text-primary rounded-full text-[14px] tablet:text-[16px] transition'
    >
      {isPending ? (
        <div className=' flex w-full items-center mx-auto justify-center gap-4'>
          <span>Joining</span>
          <AiOutlineLoading
            size={20}
            className='  animate-spin  transition-all duration-700'
          />
        </div>
      ) : (
        'Join'
      )}
    </button>
  )
}

export default JoinGroupButton
