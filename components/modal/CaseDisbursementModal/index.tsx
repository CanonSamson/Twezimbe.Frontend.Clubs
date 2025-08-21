'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { useState } from 'react'
import AuthButton from '@/components/button/AuthButton'
import CaseSection from './sections/CaseSection'
import DetailSection from './sections/DetailSection'
import { useParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '@/contexts/ProviderWrapper'
import moment from 'moment'
import { IoMdClose } from 'react-icons/io'
import {
  bfCaseFundDisbursement,
  declineBfCaseDisbursement
} from '@/api/bereavement-fund/cases-disbursement'

const CaseDisbursementModal = () => {
  const { toggleModal, modalData, modals, updateModalData, closeModal } =
    useSettingModal()
  const [activeRoute, setActiveRoute] = useState('case')

  const sections = [
    { name: 'case', title: 'Case Description', path: 'case' },
    { name: 'details', title: 'Details', path: 'details' }
  ]

  const bfId = useParams()?.bfId as string
  const caseData = modalData?.caseDisbursementModal?.disbursement?.case
  const disbursement = modalData?.caseDisbursementModal?.disbursement

  const { mutate: approveMutation, isPending: approveIsPending } = useMutation({
    mutationFn: () =>
      bfCaseFundDisbursement({ disbursementId: disbursement?.id }),
    onSuccess: () => {
      toast.success('Case approved successfully')
      queryClient.invalidateQueries({
        queryKey: ['user-cases', bfId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getBfCaseDisbursement', bfId]
      })

      updateModalData('caseDisbursementModal', {
        case: { ...caseData, status: 'APPROVED' }
      })
      closeModal('caseDisbursementModal')
    },
    onError: data => {
      toast.error(data?.message || JSON.stringify(data))
    }
  })

  const { mutate: declineMutation, isPending: declineIsPending } = useMutation({
    mutationFn: () =>
      declineBfCaseDisbursement({ disbursementId: disbursement?.id }),
    onSuccess: () => {
      toast.success('Declined')
      queryClient.invalidateQueries({
        queryKey: ['user-cases', bfId as string]
      })
      queryClient.invalidateQueries({
        queryKey: ['getBfCaseDisbursement', bfId]
      })

      updateModalData('caseDisbursementModal', {
        case: { ...caseData, status: 'DECLINED' }
      })
      closeModal('caseDisbursementModal')
    },
    onError: data => {
      toast.error(data.message || JSON.stringify(data))
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
        modals?.caseDisbursementModal ? 'flex' : 'hidden'
      }`}
    >
      <button
        className='absolute z-[50] inset-0 bg-black opacity-50'
        onClick={() => toggleModal('caseDisbursementModal')}
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
                onClick={() => toggleModal('caseDisbursementModal')}
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
                      caseData?.beneficiary.beneficiary?.profile?.profileImage
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
                {activeRoute === 'details' && <DetailSection />}
              </div>

              {caseData?.status === 'REJECTED' ||
              disbursement?.status === 'DISBARRED' ? null : (
                <div className='flex items-center mt-4 gap-3 mb-4'>
                  <AuthButton
                    text='Approve'
                    className=' text-sm  '
                    handleClick={() => approveMutation()}
                    isLoading={approveIsPending}
                    disabled={disabled}
                  />
                  {/* disbursement?.status === "DISBARRED" */}
                  {disbursement?.status === 'PENDING' && (
                    <AuthButton
                      className='bg-red-600  text-sm  '
                      text='Decline'
                      isLoading={declineIsPending}
                      disabled={disabled}
                      handleClick={() => declineMutation()}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseDisbursementModal
