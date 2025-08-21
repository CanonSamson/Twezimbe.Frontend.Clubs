'use client'
import React, { FC, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import AuthButton from '../button/AuthButton'
import CustomBfCurrencyInput from '../input/CustomBfCurrencyInput'
import CustomSelect from '../input/CustomSelect'
import { useSettingModal } from '@/contexts/modal-setting'
import { getBfTransitionPaymentLink } from '@/api/bereavement-fund/payment'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .min(50, 'Amount must be at least 50')
    .test(
      'decimal-places',
      'Amount can only have up to 2 decimal places',
      value => {
        if (value == null) return false
        const parts = value.toString().split('.')
        return parts.length < 2 || parts[1].length <= 2
      }
    ),
  method: Yup.string().required('Payment method is required'),
  mobile: Yup.string()
    // .required("Mobile Money number is required")
    .matches(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
})

interface FormValues {
  amount: string
  method: string
  mobile: string
}

interface PayTransitionModalProps {
  onSubmit?: (values: FormValues) => void
}

const PayTransitionModal: FC<PayTransitionModalProps> = props => {
  const { closeModal, modals, modalData } = useSettingModal()

  const bfId = useParams()?.bfId as string

  const onSubmit = props.onSubmit ?? (() => {})

  const { values, setFieldValue, touched, errors, handleSubmit } =
    useFormik<FormValues>({
      initialValues: {
        amount: '',
        method: '',
        mobile: ''
      },
      validationSchema,
      onSubmit: (values, actions) => {
        onSubmit(values)
        actions.resetForm()
      }
    })

  useEffect(() => {
    const totalDuePayments = modalData?.payTransitionModal?.totalDuePayments

    if (totalDuePayments) {
      setFieldValue('amount', totalDuePayments)
    }
  }, [modalData?.payTransitionModal])

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      getBfTransitionPaymentLink(bfId as string, {
        amount: parseFloat(values.amount.toString()),
        method: values.method
      }),
    onSuccess: response => {
      closeModal('payTransitionModal')
      if (response.data?.paymentLink) {
        window.open(
          response.data?.paymentLink,
          'transition,noopener,noreferrer'
        )
        toast.success('Payment link generated successfully', {
          description: 'Please complete your payment using the provided link.'
        })
      } else {
        toast.success('Deposit initiated successfully', {
          description: `Please complete your deposit using the selected method.`
        })
      }
      setFieldValue('amount', '')
      setFieldValue('method', '')
      setFieldValue('mobile', '')
    }
  })

  return (
    <div
      className={`fixed inset-0 z-[55] items-center justify-center ${
        modals.payTransitionModal ? 'flex' : 'hidden'
      }`}
    >
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={() => closeModal('payTransitionModal')}
      />

      <div className='bg-white rounded-lg shadow-lg max-h-[70vh] w-full max-w-md overflow-auto z-10'>
        <div className='p-5 mb-8'>
          <div className='flex justify-end items-center mb-4'>
            <button
              className='text-divider-200 hover:text-divider-300 duration-500 transition-colors'
              onClick={() => closeModal('payTransitionModal')}
            >
              <IoClose size={25} />
            </button>
          </div>

          <h2 className='text-xl font-bold mb-4'>Deposit to Wallet</h2>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <CustomBfCurrencyInput
              type='text'
              id='amount'
              label='Amount'
              placeholder='amount'
              className='font-inter'
              value={values.amount}
              onChange={e => setFieldValue('amount', e.target.value)}
              error={touched.amount && errors.amount}
              disabled
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
                  label: 'MTN UG '
                }
              ]}
              placeholder='Mobile Money or Card'
              value={values.method}
              className='font-inter'
              onChange={val => setFieldValue('method', val)}
              error={touched.method && errors.method}
            />

            <div className='flex justify-center mt-6'>
              <AuthButton
                text='Make Deposit'
                type='submit'
                isLoading={isPending}
                handleClick={() => mutate()}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PayTransitionModal
