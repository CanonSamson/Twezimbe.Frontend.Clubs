'use client'

import React from 'react'
import { IoClose } from 'react-icons/io5'
import * as Yup from 'yup'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomBfCurrencyInput from '../input/CustomBfCurrencyInput'
import { useFormik } from 'formik'
import AuthButton from '../button/AuthButton'
import { useMutation } from '@tanstack/react-query'
import { initiateBfWalletDeposit } from '@/api/bereavement-fund/payment'
import { useParams } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import CustomSelect from '../input/CustomSelect'
import { toast } from 'sonner'

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .min(50, 'Amount must be greater than 50')
    .test(
      'decimal-places',
      'Amount can only have up to 2 decimal places',
      value => {
        if (value === undefined || value === null) return true
        // Convert to string and check decimal places
        const valueStr = value.toString()
        if (valueStr.includes('.')) {
          const decimalPlaces = valueStr.split('.')[1].length
          return decimalPlaces <= 2
        }
        return true
      }
    )
    .test('valid-decimal', 'Invalid amount format', value => {
      if (value === undefined || value === null) return true
      // Check if the number has valid decimal format
      const regex = /^\d+(\.\d{1,2})?$/
      return regex.test(value.toString())
    }),
  method: Yup.string().required()
})

const WalletDepositModal = () => {
  const { modals, closeModal } = useSettingModal()
  const { bfId } = useParams()

  const bf = useAppSelector((state: RootState) => state.bf.bf)

  const bfData = bf?.[bfId as string]

  const { values, setFieldValue, errors, touched, handleSubmit } = useFormik({
    initialValues: {
      amount: '',
      method: ''
    },
    validationSchema,
    onSubmit: values => {
      mutate()
      console.log('Form values:', values)
    }
  })

  const handleCurrencyChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value.replace(/,/g, '')

      // Allow only numbers and one decimal point
      if (!/^\d*\.?\d*$/.test(inputValue)) {
        return // Don't update if invalid characters
      }

      // Handle decimal places - limit to 2 decimal places
      if (inputValue.includes('.')) {
        const parts = inputValue.split('.')
        if (parts[1] && parts[1].length > 2) {
          inputValue = parts[0] + '.' + parts[1].substring(0, 2)
        }
      }

      // Convert to number for validation, but keep as string to preserve decimal formatting
      const numericValue = inputValue === '' ? '' : parseFloat(inputValue)

      setFieldValue(fieldName, numericValue)
    }

  // Calculate fees based on method and amount
  const calculateFee = () => {
    const amount = parseFloat(values.amount.toString()) || 0
    if (!values.method || amount === 0) return 0

    switch (values.method) {
      case 'flutterwave':
        return amount * 0.05 // 5%
      case 'mtn-ug':
        return 0 // Free
      default:
        return 0
    }
  }

  const getFeeText = () => {
    if (!values.method) return ''

    switch (values.method) {
      case 'flutterwave':
        return '5%'
      case 'mtn-ug':
        return 'Free'
      default:
        return ''
    }
  }

  const fee = calculateFee()
  const amount = parseFloat(values.amount.toString()) || 0
  const totalAmount = amount + fee

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      initiateBfWalletDeposit(bfId as string, {
        amount: parseFloat(values.amount.toString()), // Ensure proper number conversion
        method: values.method
      }),
    onSuccess: response => {
      console.log('response', response)
      closeModal('walletDepositModal')
      setFieldValue('amount', '')
      setFieldValue('method', '')
      if (response.data?.data.paymentLink) {
        window.open(response.data?.data?.paymentLink, 'noopener,noreferrer')
      }

      toast.success('Deposit initiated successfully', {
        description: `Please complete your deposit using the selected method.`
      })
    }
  })

  return (
    <div
      className={`fixed inset-0 z-[55]  items-center justify-center ${
        modals.walletDepositModal ? 'flex' : ' hidden'
      }`}
    >
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={() => closeModal('walletDepositModal')}
      />

      <div className='bg-white rounded-lg shadow-lg max-h-[70vh] w-full max-w-md overflow-auto z-10'>
        <div className='p-5 mb-8'>
          <div className='flex justify-end items-center mb-4'>
            <button
              className='text-divider-200 hover:text-divider-300 duration-500 transition-colors'
              onClick={() => closeModal('walletDepositModal')}
            >
              <IoClose size={25} />
            </button>
          </div>

          <div className='text-center mt-5'>
            <h2 className='text-xl font-extrabold flex justify-start'>
              Deposit to {bfData?.name}
            </h2>
          </div>

          <div className='flex flex-col gap-4'>
            <CustomBfCurrencyInput
              type='text'
              id='walletAmount'
              value={values.amount}
              label='Amount to deposit'
              placeholder='2000.00'
              className='mt-4 font-bold'
              inputClassName='bg-divider-100 font-normal'
              onChange={handleCurrencyChange('amount')}
              error={touched.amount && errors.amount}
              inputMode='decimal'
              pattern='[0-9]*\.?[0-9]{0,2}'
            />

            <CustomSelect
              label=' Method'
              options={[
                {
                  value: 'flutterwave',
                  label: 'Flutterwave'
                },
                {
                  value: 'mtn-ug',
                  label: 'MTN UG'
                }
              ]}
              placeholder='Mobile Money or Card'
              value={values.method}
              className='font-inter'
              onChange={val => setFieldValue('method', val)}
              error={touched.method && errors.method}
            />

            {/* Fees Section */}
            {values.method && amount > 0 && (
              <div className='bg-gray-50 rounded-lg p-4 mt-4'>
                <h3 className='text-sm font-semibold text-gray-700 mb-2'>
                  Transaction Summary
                </h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Deposit Amount:</span>
                    <span className='font-medium'>
                      {amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>
                      Transaction Fee ({getFeeText()}):
                    </span>
                    <span className='font-medium'>
                      {fee > 0
                        ? fee.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        : 'Free'}
                    </span>
                  </div>
                  <div className='border-t pt-2 flex justify-between font-semibold'>
                    <span>Total Amount:</span>
                    <span>
                      {totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='flex justify-center mt-10'>
            <AuthButton
              text='Make deposit'
              handleClick={() => handleSubmit()}
              isLoading={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletDepositModal
