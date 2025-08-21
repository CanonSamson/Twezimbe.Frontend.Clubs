'use client'

import React from 'react'
import { IoClose } from 'react-icons/io5'
import * as Yup from 'yup'
import { useSettingModal } from '@/contexts/modal-setting'
import CustomBfCurrencyInput from '../input/CustomBfCurrencyInput'
import { useFormik } from 'formik'
import AuthButton from '../button/AuthButton'
import Image from 'next/image'

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .min(50, 'Amount must be greater than 50')
})

const ContributedFundsModal = () => {
  const { toggleModal, modals } = useSettingModal()
  // const { bfId } = useParams()

  const { values, setFieldValue, errors, touched } = useFormik({
    initialValues: {
      amount: 0
    },
    validationSchema,
    onSubmit: values => {
      //   mutate()
      console.log('Form values:', values)
    }
  })

  const handleCurrencyChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove commas and convert to number for form validation
      const numericValue = Number(e.target.value.replace(/,/g, ''))
      setFieldValue(fieldName, numericValue)
    }

  //   const { mutate, isPending } = useMutation({
  //     mutationFn: () =>
  //       getBfWalletDepositionLink(bfId as string, {
  //         amount: values.amount,
  //         method: ''
  //       }),
  //     onSuccess: response => {
  //       console.log('response', response)
  //       toggleModal('walletDepositModal')
  //       setFieldValue('amount', 0)
  //       if (response.data?.data?.paymentLink) {
  //         window.open(response.data?.data?.paymentLink, 'noopener,noreferrer')
  //       }
  //     }
  //   })
  return (
    <div
      className={`fixed inset-0 z-[55]  items-center justify-center ${
        modals.contributedFundsModal ? 'flex' : ' hidden'
      }`}
    >
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={() => toggleModal('contributedFundsModal')}
      />

      <div className='bg-white rounded-lg shadow-lg max-h-[70vh] w-full max-w-xl overflow-auto z-10'>
        <div className='p-5 mb-8'>
          <div className='flex justify-end items-center mb-4'>
            <button
              className='text-divider-200 hover:text-divider-300 duration-500 transition-colors'
              onClick={() => toggleModal('contributedFundsModal')}
            >
              <IoClose size={25} />
            </button>
          </div>

          <div className='mt-5 flex items-center gap-4'>
            <div className='flex-shrink-0'>
              <Image
                src='/icon/funeral.svg'
                alt='funeral'
                width={200}
                height={200}
                className='object-cover h-[100px] rounded-lg'
              />
            </div>
            <div>
              <h2 className='text-xl font-medium text-left text-[26px]'>
                You are supporting {''}{' '}
                <span className='font-bold'>Help us fund a funeral </span> case
              </h2>
              <p className='text-[16px] text-[#808080] font-medium'>
                Your donation will benefit {''}
                <span className='text-[16px] text-[#808080] font-bold'>
                  James Mark
                </span>
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <CustomBfCurrencyInput
              type='text'
              id='walletAmount'
              value={values.amount}
              label='Enter your donation'
              placeholder='2000'
              className='mt-4 font-bold'
              inputClassName='bg-divider-100 font-normal'
              onChange={handleCurrencyChange('amount')}
              error={touched.amount && errors.amount}
            />
          </div>

          <div className='flex justify-center mt-10'>
            <AuthButton
              text='Donate'
              //   handleClick={() => handleSubmit()}
              //   isLoading={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContributedFundsModal
