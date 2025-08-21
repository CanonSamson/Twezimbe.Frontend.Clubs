'use client'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomDialog from '../custom/CustomDialog'
import Image from 'next/image'
import AuthButton from '../button/AuthButton'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { formatAmount } from '@/utils/functions/formatAmount'
import { getUserPendingSubscriptionFeeCalculation } from '@/api/bereavement-fund/beneficiary'
import { closeBfPendingModal } from '@/api/bereavement-fund'
import { togglePendingModal } from '@/lib/features/bf/bfSlice'

const PendingPaymentModal = () => {
  const { modals, modalData } = useSettingModal()
  const groupId = useParams()?.groupId as string
  const bfId = useParams()?.bfId as string
  const bfLoading = useAppSelector(state => state.bf.bfLoading)
  const bfUserAcces = useAppSelector(state => state.bf.bfUserAcces)
  const bf = useAppSelector(state => state.bf.bf)

  const pathName = usePathname()
  const bfData = bf?.[bfId]
  const bfAccess = Boolean(bfUserAcces?.[bfId])
  const isLoading = Boolean(bfLoading?.[bfId])
  const { openModal, closeModal } = useSettingModal()
  const [closed, setClosed] = useState(true)

  const dispatch = useAppDispatch()
  const { mutate: mutateCloseBfPendingModal } = useMutation({
    mutationFn: () => closeBfPendingModal(bfId),
    onError: error => {
      console.log(error, 'error')
    }
  })

  // const isClosedPendingModal = false
  const forceOpen = modalData.pendingPaymentModal === true

  const router = useRouter()

  const { data: pendingStats } = useQuery({
    queryKey: ['bf-pending-subscription-stats', bfId],
    queryFn: async () => {
      if (!bfId || bfId === 'undefined') return null
      return getUserPendingSubscriptionFeeCalculation(bfId)
    }
  })

  const pendingStatsData = pendingStats?.data?.calculation

  const hasNoBeneficiaries = useMemo(
    () => pendingStatsData && pendingStatsData?.subtotal === 0,
    [pendingStatsData]
  )

  // Calculate if there are actual pending payments
  const hasPendingPayments = useMemo(
    () =>
      pendingStats?.data?.calculation &&
      (pendingStats?.data?.calculation?.grandTotal || 0) +
        (pendingStats?.data?.calculation?.membershipFee || 0) >
        0,
    [pendingStats]
  )

  // Check if we're on the principal page
  const isOnPrincipalPage = useMemo(
    () => pathName.includes(`/${groupId}/${bfId}/principal`),
    [pathName, groupId, bfId]
  )

  useEffect(() => {
    const showModalWithDelay = setTimeout(() => {
      if (!bfAccess || isLoading || closed) return
      if (modals?.pendingPaymentModal === true) return
      if (isOnPrincipalPage && hasPendingPayments) {
        openModal('pendingPaymentModal', true)
      }
    }, 1000) // 1 second delay

    return () => clearTimeout(showModalWithDelay)
  }, [bfAccess, isLoading, openModal, isOnPrincipalPage, hasPendingPayments])

  useEffect(() => {
    if (closed) {
      setClosed(false)
    }
  }, [isOnPrincipalPage])

  const hidden = pathName.includes(`/${groupId}/${bfId}/beneficiary`)

  const handleCloseModal = async () => {
    setClosed(true)
    closeModal('pendingPaymentModal')
    mutateCloseBfPendingModal()
    dispatch(togglePendingModal({ isClosed: true, bfId: bfId }))
  }

  return (
    <CustomDialog
      open={
        forceOpen
          ? forceOpen
          : hidden
          ? false
          : closed
          ? false
          : !!bfId &&
            modals?.pendingPaymentModal &&
            isOnPrincipalPage &&
            hasPendingPayments
      }
      close={() => handleCloseModal()}
      name='pendingPaymentModal'
      contentClassName='sm:max-w-[525px] max-h-[70dvh] overflow-y-auto py-10 z-[55] bg-white
                max-tablet-lg:max-h-[85dvh] max-tablet-lg:py-6 max-tablet-lg:max-w-full'
    >
      <Image
        src='/icon/bar.svg'
        alt='gray-bar'
        width={70}
        height={70}
        className='absolute top-4 left-1/2 -translate-x-1/2 tablet-lg:hidden'
      />
      <div className='flex flex-col items-center justify-center mt-10 tablet-lg:mt-0'>
        <Image
          src={`/assets/images/icons/bell.svg`}
          className='h-[150px] w-auto'
          width={200}
          height={200}
          alt='bell logo'
        />
        <h1 className='mt-4 text-xl font-medium text-center'>
          {hasNoBeneficiaries
            ? `Welcome to ${bfData?.name}`
            : 'Payment Pending!'}
        </h1>

        <p className='text-center mb-6 px-10 mt-4'>
          {hasNoBeneficiaries
            ? ' To join the fund, here’s a quick summary of what you’ll pay.'
            : 'Here is a quick summary of what you’ll pay.'}
        </p>

        <div className='w-full mb-8'>
          <table className='w-full text-sm text-left  rounded'>
            <thead className='bg-gray-100 text-gray-700 font-semibold'>
              <tr>
                <th className='p-3'>Fee Type</th>
                <th className='p-3 text-right'>Amount (UGX)</th>
              </tr>
            </thead>
            <tbody className='text-gray-700'>
              <tr className='border-t'>
                <td className='p-3'>Membership Fee (One-Off)</td>
                <td className='p-3 text-right'>
                  UGX{' '}
                  {formatAmount(String(pendingStatsData?.membershipFee || 0))}
                </td>
              </tr>
              <tr className='border-t'>
                <td className='p-3'>Annual subscription base fee</td>
                <td className='p-3 text-right'>
                  UGX{' '}
                  {formatAmount(String(pendingStatsData?.annualBaseFee || 0))}
                </td>
              </tr>
              <tr className='border-t'>
                <td className='p-3'>Age-based add-on fees</td>
                <td className='p-3 text-right'>
                  UGX {formatAmount(String(pendingStatsData?.subtotal || 0))}
                </td>
              </tr>
              <tr className='border-t font-bold'>
                <td className='p-3'>Total Due</td>
                <td className='p-3 text-right'>
                  UGX{' '}
                  {formatAmount(
                    String(
                      (pendingStatsData?.grandTotal || 0) +
                        (pendingStatsData?.membershipFee || 0) || 0
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <p className='text-xs text-center text-gray-500 mt-3'>
            Fees are calculated based on the age of each person you add. Add
            your beneficiaries now to see the complete total for your
            membership.
          </p>
        </div>
        <div className='w-full flex flex-col gap-2'>
          <AuthButton
            text='Add Beneficiaries'
            handleClick={() => {
              handleCloseModal()
              openModal('addBeneficiaryModal', {
                fundId: bfId,
                manual: false,
                state: 1
              })
            }}
          />
          <AuthButton
            text='Continue to Payments'
            handleClick={() => {
              router.push(
                `/bf/principal-settings/${groupId}/${bfId}/my-payments`
              )
              handleCloseModal()
            }}
            className='bg-transparent text-primary border border-primary'
          />
        </div>
      </div>
    </CustomDialog>
  )
}

export default PendingPaymentModal
