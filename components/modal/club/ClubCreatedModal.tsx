'use client'

import { Check } from 'lucide-react'
import { useSettingModal } from '@/contexts/modal-setting'
import { useParams, useRouter } from 'next/navigation'

const ClubCreatedModal = () => {
  const { modals, closeModal, modalData } = useSettingModal()
  const isOpen = modals?.clubCreatedModal

  const club = modalData?.clubCreatedModal?.club

  const groupId = useParams()?.groupId as string
  const clubId = club?.id

  const router = useRouter()

  if (!isOpen) return null

  return (
    <>
      <button
        onClick={() => {
          closeModal('clubCreatedModal')
          router.replace(`/clubs/${groupId}/${clubId}/create/welcome`)
        }}
        className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center !z-[55]'
      />
      <div className='fixed inset-0  flex items-center justify-center !z-[56]'>
        <div className='bg-white rounded-t-lg space-y-3 rounded-br-lg p-8 w-full max-w-[450px] relative !z-[56]'>
          <div className='flex flex-col items-center text-center gap-3'>
            <div className='bg-[#C3DBEC] flex items-center justify-center size-24 rounded-full'>
              <div className='bg-[#4D94C5] p-2 rounded-full flex items-center justify-center'>
                <Check size={40} color='white' />
              </div>
            </div>
            <h2 className='text-[1.25rem] font-bold text-black'>
              Your club is live!
            </h2>
            <p className='text-sm text-gray-600'>
              Club created. Time to rally your people!
            </p>
            <button
              onClick={() => {
                closeModal('clubCreatedModal')
                router.replace(`/clubs/settings/${groupId}/${clubId}`)
              }}
              className='w-full bg-[#4D94C5] hover:bg-[#73acd5] text-white py-2 px-4 rounded-t-md rounded-br-md transition-colors'
            >
              Set up your club
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClubCreatedModal
