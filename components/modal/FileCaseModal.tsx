'use client'

import React, { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomAvatar from '../custom/CustomAvatar'
import { useUser } from '@/contexts/user'
import UserProfileHint from '@/components/UserProfileHint'
import { useParams, useRouter } from 'next/navigation'
import { CiSearch } from 'react-icons/ci'
import { useQuery } from '@tanstack/react-query'
import { getFundBeneficiaries } from '@/api/bereavement-fund/beneficiary'
import Image from 'next/image'
import { MdOutlinePerson } from 'react-icons/md'

const FileCaseModal = () => {
  const { toggleModal, closeModal, modalData, modals, updateModalData } = useSettingModal()
  const { currentUser } = useUser({})
  const bfId = useParams()?.bfId as string
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<'myself' | 'beneficiary'>('beneficiary')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const userProfile = {
    id: currentUser?.id ?? '',
    firstName: currentUser?.profile?.firstName ?? '',
    lastName: currentUser?.profile?.lastName ?? '',
    profileImage: currentUser?.profile?.profileImage ?? undefined,
    userName: currentUser?.profile?.userName ?? undefined
  }

  const fundId = modalData?.fileCaseModal?.fundId
  const step = Number(modalData?.fileCaseModal?.step || 1)

  const handleProceed = () => {
    if (selectedOption === 'myself') {
      router.push(`/bf/file-case/${bfId}/${currentUser?.id}`)
      closeModal('fileCaseModal')
    } else {
      updateModalData('fileCaseModal', { ...modalData?.fileCaseModal, step: 2 })
    }
  }

  const { data } = useQuery({
    queryKey: ['user-beneficiaries', fundId || bfId, debouncedSearch],
    queryFn: () => getFundBeneficiaries(fundId || bfId, debouncedSearch ? { search: debouncedSearch } : undefined),
    enabled: !!fundId || !!bfId,
    refetchOnWindowFocus: false
  })

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center tablet-lg:items-center tablet-lg:justify-center ${
        modals.fileCaseModal ? 'flex' : 'hidden'
      }`}
    >
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={() => closeModal('fileCaseModal')}
      />

      {step === 2 ? (
        <div className='bg-white rounded-tl-[18px] rounded-tr-[18px] tablet-lg:rounded-lg shadow-lg h-[40vh] w-full max-w-full tablet-lg:max-w-lg  z-10'>
          <div className='p-5 mb-8'>
            <div className='text-center mt-5'>
              <Image
                src='/icon/bar.svg'
                alt='gray-bar'
                width={70}
                height={70}
                className='mb-0 relative bottom-6 mx-auto block tablet-lg:hidden'
              />
              <div className='flex flex-col tablet-lg:flex-row tablet-lg:justify-between items-center mb-4'>
                <div className=' flex flex-col items-start text-start'>
                  <h2 className='text-xl font-black text-[24px] text-[#1D1C1D] order-1 tablet-lg:order-none mb-0 tablet-lg:mb-0'>
                    Select beneficiary
                  </h2>
                  <p className=' text-sm'>Make a support request</p>
                </div>

                <button
                  className='hidden tablet-lg:block text-divider-200 hover:text-divider-300 duration-500 transition-colors order-2'
                  onClick={() => closeModal('fileCaseModal')}
                >
                  <IoClose size={25} />
                </button>
              </div>
            </div>

            <div className='flex justify-center mt-5'>
              <div className='relative w-[1000px]'>
                <input
                  type='text'
                  placeholder='Search beneficiaries'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='font-semibold text-[13px] w-full px-6 py-3 text-lg text-black bg-primary rounded-sm border border-primary focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-white placeholder:text-sm placeholder:font-normal'
                />
                <button className='absolute inset-y-0 right-3 flex items-center'>
                  <CiSearch className='h-5 w-5 text-white' />
                </button>
              </div>
            </div>
            <div className='border-t border-[#1D1C1D21] -mx-5  tablet-lg:hidden mt-4'></div>
            <div className='flex relative w-full right-3 mt-4'>
              <button
                className='justify-start h-8 flex items-center gap-x-2 px-3 py-2 text-gray-600 transition-colors rounded-md'
                onClick={() => {
                  router.push(`/bf/file-case/${bfId}/${currentUser?.id}`)
                  closeModal('fileCaseModal')
                }}
              >
                <MdOutlinePerson className='h-5 w-5 text-[#000000]' />
                <span className='text-md font-medium text-black'>
                  File support request for yourself
                </span>
              </button>
            </div>

            <div className=' mt-5 flex flex-col gap-1 overflow-auto'>
              {data?.data?.beneficiaries && data.data.beneficiaries.length > 0 ? (
                data.data.beneficiaries.map((beneficiary, index) => {
                  return (
                    <div key={index}>
                      <div className='flex items-center   justify-between gap-4  pb-5'>
                        <UserProfileHint align='start' user={userProfile}>
                          <div className='flex items-center gap-2'>
                            <CustomAvatar
                              image={beneficiary?.profileImage}
                              className='justify-start w-[45px] h-[45px]'
                              imageClassName='h-[45px] object-top text-[16px] font-bold text-primary border w-[45px] rounded-[12px] overflow-hidden flex items-center justify-center'
                              labelClassName='h-[45px] border-none w-[45px] rounded-[9px] overflow-hidden flex items-center justify-center'
                              alt='profile image'
                              showText={false}
                              disabled={true}
                              iconClassName='w-[30px] h-[30px]'
                              isCurrentUser={false}
                              userFullName={`${beneficiary?.firstName} ${beneficiary?.lastName}`}
                            />

                            <div className='flex items-center  gap-2'>
                              <span className='text-[16px] font-medium'>
                                {beneficiary?.firstName} {beneficiary?.lastName}
                              </span>
                              {beneficiary?.firstName &&
                                beneficiary?.lastName && (
                                  <span className='h-2 w-2 bg-green-700 rounded-full'></span>
                                )}
                            </div>
                          </div>
                        </UserProfileHint>

                        <button
                          className='px-6 py-1 bg-white border border-[#1D1C1D21] text-black text-sm rounded-full hover:bg-gray-50'
                          onClick={() => {
                            router.push(
                              `/bf/file-case/${bfId}/${beneficiary?.id}`
                            )
                            closeModal('fileCaseModal')
                          }}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
                  <div className='text-center'>
                    {searchTerm ? (
                      <>
                        <p>No beneficiaries found for &quot;{searchTerm}&quot;</p>
                        <p className='text-sm mt-1'>Try a different search term</p>
                      </>
                    ) : (
                      <p>No beneficiaries available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-tl-[18px] rounded-tr-[18px] tablet-lg:rounded-lg shadow-lg h-auto w-full max-w-full tablet-lg:max-w-lg z-10'>
          <div className='p-5'>
            <div className='text-center mt-5'>
              <Image
                src='/icon/bar.svg'
                alt='gray-bar'
                width={70}
                height={70}
                className='mb-0 relative bottom-6 mx-auto block tablet-lg:hidden'
              />
              <div className='flex flex-col tablet-lg:flex-row tablet-lg:justify-between items-center mb-6'>
                <div className='flex flex-col items-start text-start'>
                  <h2 className='text-xl font-black text-[24px] text-[#1D1C1D] order-1 tablet-lg:order-none mb-2 tablet-lg:mb-0'>
                    Who is this request for?
                  </h2>
                  <p className='text-sm text-gray-600'>Please select who you are making this request for.</p>
                </div>

                <button
                  className='hidden tablet-lg:block text-gray-400 hover:text-gray-600 duration-500 transition-colors order-2'
                  onClick={() => toggleModal('fileCaseModal')}
                >
                  <IoClose size={25} />
                </button>
              </div>
            </div>

            {/* Radio Button Options */}
            <div className='space-y-4 mb-8'>
              <label className='flex items-center space-x-3 cursor-pointer'>
                <input
                  type='radio'
                  name='requestFor'
                  value='myself'
                  checked={selectedOption === 'myself'}
                  onChange={(e) => setSelectedOption(e.target.value as 'myself' | 'beneficiary')}
                  className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                />
                <span className='text-gray-900 font-medium'>Myself</span>
              </label>

              <label className='flex items-center space-x-3 cursor-pointer'>
                <input
                  type='radio'
                  name='requestFor'
                  value='beneficiary'
                  checked={selectedOption === 'beneficiary'}
                  onChange={(e) => setSelectedOption(e.target.value as 'myself' | 'beneficiary')}
                  className='w-4 h-4 text-primary border-gray-300 focus:ring-primary'
                />
                <span className='text-gray-900 font-medium'>One of my beneficiaries</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => toggleModal('fileCaseModal')}
                className='px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className='px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileCaseModal
