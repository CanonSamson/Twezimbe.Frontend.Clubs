'use client'

import React, { useEffect, useMemo } from 'react'
import { IoClose } from 'react-icons/io5'
import * as Yup from 'yup'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomBfCurrencyInput from '../input/CustomBfCurrencyInput'
import { useFormik } from 'formik'
import AuthButton from '../button/AuthButton'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getBfWallet, payBfMembership } from '@/api/bereavement-fund/wallet'
import { queryClient } from '@/contexts/ProviderWrapper'
import { UserContext } from '@/contexts/user'
import { formatAmount } from '@/utils/functions/formatAmount'
import { useContextSelector } from 'use-context-selector'


const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .min(50, 'Amount must be greater than 50')
})

const PayBfMembershipModal = () => {
  const { closeModal, modals, modalData } = useSettingModal()
  const bfId = useParams()?.bfId as string
  const groupId = useParams()?.groupId as string

  const membershipFee = modalData?.payBfMembershipModal?.data?.membershipFee
  const subscriptionId = modalData?.payBfMembershipModal?.data?.id
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  )
  const { values, setFieldValue, errors, touched, handleSubmit } = useFormik({
    initialValues: {
      amount: membershipFee
    },
    validationSchema,
    onSubmit: values => {
      if (!subscriptionId) {
        toast.error('Subscription ID is required')
        return
      }

      // Check if wallet has sufficient balance including charges
      const walletBalance = wallet?.data?.data?.balance || 0
      if (walletBalance < chargeDetails.totalAmount) {
        toast.error(
          `Insufficient wallet balance. Required: UGX ${formatAmount(
            String(chargeDetails.totalAmount)
          )} (including UGX ${formatAmount(
            String(chargeDetails.chargeAmount)
          )} charges), Available: UGX ${formatAmount(String(walletBalance))}`
        )
        return
      }

      mutate()
      console.log('Form values:', values)
    }
  })

  // Calculate charges for BF wallet payment (5% charge)
  const chargeDetails = useMemo(() => {
    const originalAmount = Number(values.amount) || 0
    const chargeRate = 0.05 // 5% charge for wallet payments
    const chargeAmount = originalAmount * chargeRate
    const totalAmount = originalAmount + chargeAmount

    return {
      originalAmount,
      chargeAmount: parseFloat(chargeAmount.toFixed(2)),
      chargeRate,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    }
  }, [values.amount])

  useEffect(() => {
    setFieldValue('amount', membershipFee)
  }, [membershipFee])

  const handleCurrencyChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove commas and convert to number for form validation
      const numericValue = Number(e.target.value.replace(/,/g, ''))
      setFieldValue(fieldName, numericValue)
    }

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return payBfMembership(bfId, {
        subscriptionId,
        test: ''
      })
    },
    onMutate: () => {
      refetchWallet()
    },

    onSuccess: (response: any) => {
      console.log('response', response)
      closeModal('payBfMembershipModal')
      queryClient.invalidateQueries({
        queryKey: ['getFundOneTimeMembership', bfId]
      })
      toast.success('Payment successful')
    },
    onError: data => {
      toast.error(data.message || JSON.stringify(data))
    }
  })

  const { data: wallet, refetch: refetchWallet } = useQuery({
    queryKey: [bfId, 'user-wallet', currentUser?.id],
    queryFn: () => getBfWallet(bfId as string),
    enabled: !!bfId
  })

  const router = useRouter()
  return (
    <div
      className={`fixed inset-0 z-[55]  items-center justify-center ${
        modals.payBfMembershipModal ? 'flex' : ' hidden'
      }`}
    >
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={() => closeModal('payBfMembershipModal')}
      />

      <div className='bg-white rounded-lg shadow-lg max-h-[70vh] w-full max-w-md overflow-auto z-10'>
        <div className='p-5 mb-8'>
          <div className='flex justify-end items-center mb-4'>
            <button
              className='text-divider-200 hover:text-divider-300 duration-500 transition-colors'
              onClick={() => closeModal('payBfMembershipModal')}
            >
              <IoClose size={25} />
            </button>
          </div>

          <div className='text-center mt-5'>
            <h2 className='text-xl font-extrabold flex justify-start'>
              Membership
            </h2>
            <p className='text-gray-600  text-start text-[14px] w-[80%] mt-1'>
              This one off payment qualifies you to become part of the fund.{' '}
              <a
                href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/learn-more/my-payments`}
                className='text-primary hover:underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                Learn more
              </a>
            </p>
          </div>

          <div className='flex flex-col gap-4'>
            <CustomBfCurrencyInput
              type='text'
              id='membershipFee'
              value={values.amount}
              label='Amount'
              placeholder='2000'
              className='mt-4 '
              inputClassName='bg-divider-100 font-normal'
              onChange={handleCurrencyChange('amount')}
              disabled={true}
              error={
                touched.amount && errors.amount
                  ? errors.amount.toString()
                  : undefined
              }
            />

            {/* BF Wallet Balance Display */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-blue-700'>
                  BF Wallet Balance:
                </span>
                <span className='text-sm font-semibold text-blue-800'>
                  UGX {formatAmount(String(wallet?.data?.data?.balance || 0))}
                </span>
              </div>
            </div>

            {/* Charges Summary */}
            {values.amount > 0 && (
              <div className='bg-gray-50 rounded-lg p-4 mt-2'>
                <h3 className='text-sm font-semibold text-gray-700 mb-2'>
                  Payment Summary
                </h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Membership Fee:</span>
                    <span className='font-medium'>
                      UGX {formatAmount(String(chargeDetails.originalAmount))}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Service Charge (5%):</span>
                    <span className='font-medium text-orange-600'>
                      UGX {formatAmount(String(chargeDetails.chargeAmount))}
                    </span>
                  </div>

                  <div className='border-t pt-2 flex justify-between font-semibold'>
                    <span>Total Amount:</span>
                    <span className='text-orange-600'>
                      UGX {formatAmount(String(chargeDetails.totalAmount))}
                    </span>
                  </div>
                </div>

                {/* Wallet balance check warning */}
                {(wallet?.data?.data?.balance || 0) <
                  chargeDetails.totalAmount && (
                  <div className='mt-3 p-2 flex justify-between items-center bg-red-50 border border-red-200 rounded text-xs'>
                    <p className='text-red-600 font-medium'>
                      Insufficient wallet balance (including charges)
                    </p>
                    <button
                      onClick={() => {
                        router.push(`/bf/${groupId}/${bfId}/wallet`)
                      }}
                      className='  p-2'
                    >
                      Top Up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='flex justify-center mt-10'>
            <AuthButton
              text={
                values.amount > 0
                  ? `Pay UGX ${formatAmount(String(chargeDetails.totalAmount))}`
                  : 'Make Payment'
              }
              handleClick={() => handleSubmit()}
              isLoading={isPending}
              disabled={
                (wallet?.data?.data?.balance || 0) < chargeDetails.totalAmount
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayBfMembershipModal
