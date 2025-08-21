import { UserContext } from '@/contexts/user'
import useGroup from '@/hooks/userGroup'
import { BasicClubType } from '@/types/groups'
import { hasPermission } from '@/utils/permissions/auth-abac'
import { useParams, useRouter } from 'next/navigation'
import { HiLockClosed } from 'react-icons/hi'
import { IoChevronDownSharp } from 'react-icons/io5'
import { useContextSelector } from 'use-context-selector'

const ClubItem = ({ club }: { club: BasicClubType }) => {
  const { handleToggleCollapse, collapsed } = useGroup()

  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  )
  const groupId = useParams()?.groupId as string

  const roles = club?.roles.map(r => r.permission)

  const router = useRouter()
  return (
    <div className=' w-full'>
      <button
        onClick={() => handleToggleCollapse(`club-${club.id}`)}
        className=' flex items-center gap-1 text-divider-300'
      >
        <IoChevronDownSharp
          size={16}
          className={`${
            collapsed[`bf-${club.id}`] ? ' -rotate-90 ' : ' rotate-0'
          } duration-300 `}
        />
        <span className='line-clamp-1'>{club.name}</span>

        {hasPermission(
          {
            blockedBy: [],
            id: currentUser?.id as string,
            roles: roles
          },
          'clubs',
          'create',
          {
            groupId: groupId as string
          }
        ) ? null : (
          <HiLockClosed size={16} className=' text-divider-300' />
        )}
      </button>
      <div className={` ${collapsed[`club-${club.id}`] ? 'hidden' : 'false'}`}>
        <div className=' flex flex-col gap-2 mt-2  w-full'>
          <button
            onClick={() => {
              router.push(`/clubs/${groupId}/${club.id}/profile`)
            }}
            className={`gap-2 pl-5  hover:bg-white rounded-[5px] flex items-center`}
          >
            club info
          </button>
          <button
            onClick={() => {
              // pending page modal
            }}
            className={`gap-2 pl-5  hover:bg-white rounded-[5px] flex items-center`}
          >
            finish setup
          </button>
          <button
            onClick={() => {
              router.push(`/clubs/${groupId}/${club.id}`)
            }}
            className={`gap-2 pl-5  hover:bg-white rounded-[5px] flex items-center`}
          >
            dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClubItem
