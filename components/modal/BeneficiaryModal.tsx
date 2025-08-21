'use client'

import React, { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomAvatar from '../custom/CustomAvatar'
import UserProfileHint from '@/components/UserProfileHint'
import { CiCirclePlus } from 'react-icons/ci'
import { CiSearch } from 'react-icons/ci'
import { useQuery } from '@tanstack/react-query'
import { getPotentialUserBeneficiaries } from '@/api/bereavement-fund/beneficiary'
import { useParams } from 'next/navigation'

const BeneficiaryModal = () => {
  const { toggleModal, modals, updateModalData } = useSettingModal()
  const { groupId, bfId } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch potential beneficiaries with search
  const { data: potentialBeneficiaries, isLoading } = useQuery({
    queryKey: [
      'getPotentialUserBeneficiaries',
      bfId,
      groupId,
      debouncedSearch
    ],
    queryFn: () =>
      getPotentialUserBeneficiaries(bfId as string, groupId as string, {
        search: debouncedSearch,
        page: 1,
        limit: 20
      }),
    enabled: Boolean(bfId && groupId && modals.beneficiaryModal)
  })

  const handleSelectUser = (selectedUser: any) => {
    updateModalData('addBeneficiaryModal', {
      manual: false,
      user: selectedUser,
      state: 2
    })
    toggleModal('beneficiaryModal')
    toggleModal('addBeneficiaryModal')
  }

  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center ${
        modals.beneficiaryModal ? 'flex' : 'hidden'
      }`}
    >
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={() => toggleModal('beneficiaryModal')}
      />

      <div className='bg-white rounded-lg shadow-lg h-[70vh] w-full max-w-lg overflow-hidden z-10 flex flex-col'>
        <div className='p-5 flex-shrink-0'>
          <div className='text-center mt-5'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-black text-[24px] text-[#1D1C1D]'>
                Add beneficiary
              </h2>
              <button
                className='text-divider-200 hover:text-divider-300 duration-500 transition-colors'
                onClick={() => toggleModal('beneficiaryModal')}
              >
                <IoClose size={25} />
              </button>
            </div>
          </div>

          <div className='flex justify-center mt-5'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Search for friends or group members to add'
                className='font-semibold text-white text-[13px] w-full px-6 py-3 text-lg bg-primary rounded-sm border border-primary focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-white placeholder:text-sm placeholder:font-normal'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className='absolute inset-y-0 right-3 flex items-center'>
                <CiSearch className='h-5 w-5 text-white' />
              </button>
            </div>
          </div>

          <div className='flex relative w-full right-3 mt-4'>
            <button
              className='justify-start h-8 flex items-center gap-x-2 px-3 py-2 text-gray-600 transition-colors rounded-md'
              onClick={() => {
                toggleModal('beneficiaryModal')
                toggleModal('addBeneficiaryModal')
                updateModalData('addBeneficiaryModal', { manual: true, user: null })
              }}
            >
              <CiCirclePlus className='h-5 w-5 text-[#000000]' />
              <span className='text-md font-medium text-black'>
                Manually add details
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className='flex-1 overflow-y-auto px-5 pb-5'>
          {isLoading ? (
            <div className='flex justify-center items-center py-8'>
              <div className='text-gray-500'>Loading...</div>
            </div>
          ) : potentialBeneficiaries?.data?.members?.length ? (
             <div className='flex flex-col gap-3'>
               {potentialBeneficiaries.data.members.map((member: any, index: number) => (
                <div
                  key={index}
                  className='flex items-center justify-between gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors'
                >
                  <UserProfileHint align='start' user={{
                    id: member.user?.id ?? '',
                    firstName: member.user?.firstName ?? '',
                    lastName: member.user?.lastName ?? '',
                    profileImage: member.user?.profileImage ?? undefined,
                    userName: member.user?.userName ?? undefined
                  }}>
                    <div className='flex items-center gap-2'>
                      <CustomAvatar
                        image={member.user?.profileImage}
                        className='justify-start w-[45px] h-[45px]'
                        imageClassName='h-[45px] object-top text-[16px] font-bold text-primary border w-[45px] rounded-[12px] overflow-hidden flex items-center justify-center'
                        labelClassName='h-[45px] border-none w-[45px] rounded-[9px] overflow-hidden flex items-center justify-center'
                        alt='profile image'
                        showText={false}
                        disabled={true}
                        iconClassName='w-[30px] h-[30px]'
                        isCurrentUser={false}
                        userFullName={`${member.user?.firstName} ${member.user?.lastName}`}
                      />

                      <div className='flex items-center gap-2'>
                        <span className='text-[16px] font-medium'>
                          {member.user?.firstName} {member.user?.lastName}
                        </span>
                        {member.user?.firstName && member.user?.lastName && (
                          <span className='h-2 w-2 bg-green-700 rounded-full'></span>
                        )}
                      </div>
                    </div>
                  </UserProfileHint>

                  <button
                    className='px-6 py-1 bg-white border border-[#1D1C1D21] text-black text-sm rounded-full hover:bg-gray-50'
                    onClick={() => handleSelectUser(member.user)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
              <div className='text-center'>
                {searchTerm ? (
                  <>
                    <p>No members found for &quot;{searchTerm}&quot;</p>
                    <p className='text-sm mt-1'>Try a different search term</p>
                  </>
                ) : (
                  <p>No beneficiary available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BeneficiaryModal
