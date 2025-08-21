'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { useState } from 'react'
import AuthButton from '@/components/button/AuthButton'
import CaseSection from './sections/CaseSection'
import TargetSection from './sections/TargetSection'
import { approveBfCase, rejectBfCase } from '@/api/bereavement-fund/file-case'
import { useAppSelector } from '@/lib/hooks'
import { useUser } from '@/contexts/user'
import { useParams, useRouter } from 'next/navigation'
import { hasBfPermission } from '@/utils/permissions/bf/bf-abac'
import { useMutation } from '@tanstack/react-query'
import { formatAmount } from '@/utils/functions/formatAmount'
import { toast } from 'sonner'
import { queryClient } from '@/contexts/ProviderWrapper'
import moment from 'moment'

import { IoMdClose } from 'react-icons/io'

const FileCaseReviewModal = () => {
  const { toggleModal, modalData, modals, updateModalData } = useSettingModal()
  const [activeRoute, setActiveRoute] = useState('case')

  const sections = [
    { name: 'case', title: 'Case Description', path: 'case' },
    { name: 'details', title: 'Details', path: 'details' }
  ]

  const { bfId } = useParams()
  const caseData = modalData?.fileCaseReviewModal?.case
  const isBeneficiary = !!modalData?.fileCaseReviewModal?.isBeneficiary
  const allowDisbursement =
    modalData?.fileCaseReviewModal?.allowDisbursement === true
  const allowContribution =
    modalData?.fileCaseReviewModal?.allowContribution === true

  const { bf } = useAppSelector(state => state.bf)
  const { currentUser } = useUser({})
  const bfData = bf?.[bfId as string]
  const router = useRouter()

  const { mutate: approveMutation, isPending: approveIsPending } = useMutation({
    mutationFn: () => approveBfCase(bfId as string, caseData?.id),
    onSuccess: () => {
      toast.success('Case approved successfully')
      queryClient.invalidateQueries({
        queryKey: ['user-cases', bfId as string]
      })
      updateModalData('fileCaseReviewModal', {
        case: { ...caseData, status: 'Approved' }
      })
    },
    onError: error => {
      toast.success(error?.message || JSON.stringify(error))
    }
  })

  const { mutate: rejectMutation, isPending: rejectIsPending } = useMutation({
    mutationFn: () => rejectBfCase(bfId as string, caseData?.id),
    onSuccess: () => {
      toast.success('Case approved successfully')
      queryClient.invalidateQueries({
        queryKey: ['user-cases', bfId as string]
      })
      updateModalData('fileCaseReviewModal', {
        case: { ...caseData, status: 'REJECTED' }
      })
    },
    onError: error => {
      toast.success(error?.message || JSON.stringify(error))
    }
  })

  const userFullName = `${
    caseData?.beneficiary?.firstName ||
    caseData?.beneficiary?.beneficiary?.profile?.firstName ||
    caseData?.filedByUser?.firstName
  } ${' '}${
    caseData?.beneficiary?.lastName ||
    caseData?.beneficiary?.beneficiary?.profile?.lastName ||
    caseData?.filedByUser?.lastName
  }`

  const disabled = approveIsPending

  return (
    <div
      className={`fixed z-[50] inset-0  items-center justify-center ${
        modals?.fileCaseReviewModal ? 'flex' : 'hidden'
      }`}
    >
      <button
        className='absolute z-[50] inset-0 bg-black opacity-50'
        onClick={() => toggleModal('fileCaseReviewModal')}
        disabled={disabled}
      />

      <div className='flex left-0 w-full text-[12px] right-0 top-0 bottom-0 items-center justify-center z-[101] max-w-lg h-1/2'>
        <div className='flex flex-col w-full'>
          <div className='flex flex-col w-full max-w-[600px] bg-white rounded-t-[10px] rounded-b-[10px] mt-10 relative'>
            <div className='bg-gradient-to-r flex justify-start items-end p-4 rounded-t-[10px] h-[100px] relative flex-col '>
              <div className='mr-auto justify-start mt-6'>
                <h2 className=' font-extrabold text-[#1D1C1D] leading-tight text-[24px] '>
                  {caseData?.caseName}
                </h2>
                <p className=' text-[#49454FCC] mt-2 text-[12px] font-Inter font-medium'>
                  Contribution timeline:{' '}
                  {caseData?.timeLine
                    ? moment(caseData?.timeLine).fromNow()
                    : 'Was not provided'}
                </p>
              </div>

              <button
                disabled={disabled}
                onClick={() => toggleModal('fileCaseReviewModal')}
                className='rounded-full p-1 h-fit absolute top-4 right-4'
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className='p-6 overflow-auto'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <CustomAvatar
                    image={
                      caseData?.beneficiary?.image ||
                      caseData?.beneficiary?.beneficiary?.profile.profileImage ||
                      caseData?.filedByUser?.profileImage
                    }
                    className='justify-start'
                    imageClassName='h-[80px] object-top text-[40px] font-bold text-primary border w-[80px] rounded-[12px] overflow-hidden flex items-center justify-center'
                    labelClassName='h-[80px] w-[80px] rounded-[12px] overflow-hidden flex items-center justify-center'
                    alt='profile image'
                    showText={false}
                    disabled={true}
                    iconClassName='size-[36px]'
                    isCurrentUser={false}
                    userFullName={userFullName}
                  />
                  <div className='flex flex-col space-y-1 items-start text-center'>
                    <p className='text-[18px] font-medium'>{userFullName}</p>
                    <h1 className='text-sm'>
                      Beneficiary Status:{' '}
                      <span className=' uppercase'> {caseData?.reason}</span>
                    </h1>
                    <button
                      className='text-xs text-blue-600  '
                      // onClick={() => toggleModal("detailsModal")}
                    >
                      See Principal details
                    </button>
                  </div>
                </div>
              </div>

              <div className='bg-[#F9F6F7]/75 rounded-[10px] mt-4 p-4 space-y-4'>
                <nav className='pt-2'>
                  <ul className='flex justify-start'>
                    {sections.map(route => (
                      <li
                        className={`text-center border-b-2 font-medium text-[12px] px-4 ${
                          activeRoute === route.path
                            ? 'border-primary'
                            : 'border-gray-200'
                        }`}
                        key={route.name}
                      >
                        <button
                          className='w-full py-2 px-4 mx-[-12] hover:bg-gray-50 transition-colors whitespace-nowrap text-[#475569] text-[16px] font-semibold'
                          onClick={() => setActiveRoute(route.path)}
                        >
                          {route.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
                {activeRoute === 'case' && <CaseSection caseData={caseData} />}
                {activeRoute === 'details' && (
                  <TargetSection
                    targetAmount={formatAmount(String(caseData?.targetAmount))}
                  />
                )}
              </div>

              {isBeneficiary ? (
                <></>
              ) : (
                <>
                  {caseData?.status === 'REJECTED' ? null : (
                    <div className='flex items-center mt-4 gap-3 mb-4'>
                      {hasBfPermission(
                        {
                          blockedBy: [],
                          id: currentUser?.id as string
                        },
                        bfData?.roles ?? [],
                        'principals',
                        'view',
                        {
                          groupId: '',
                          bfId: bfId as string
                        }
                      ) && caseData?.status === 'PENDING' ? (
                        <>
                          <AuthButton
                            text='Approve'
                            className=' text-sm  '
                            handleClick={() => approveMutation()}
                            isLoading={approveIsPending}
                            disabled={disabled}
                          />
                          <AuthButton
                            className='bg-red-600  text-sm  '
                            text='Decline'
                            isLoading={rejectIsPending}
                            disabled={disabled}
                            handleClick={() => rejectMutation()}
                          />
                        </>
                      ) : (
                        <>
                          {allowDisbursement && (
                            <AuthButton
                              text='Disburse'
                              className='text-sm'
                              disabled={disabled}
                              handleClick={() => {
                                toggleModal('fundDisbursementModal', {
                                  case: caseData,
                                  state: 1
                                })
                              }}
                            />
                          )}
                          {allowContribution && (
                            <AuthButton
                              text='Contribute'
                              className=' bg-white text-sm text-primary border border-primary'
                              disabled={disabled}
                              handleClick={() => {
                                router.push(`/cases/${caseData.id}`)
                                toggleModal('fileCaseReviewModal')
                              }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileCaseReviewModal
