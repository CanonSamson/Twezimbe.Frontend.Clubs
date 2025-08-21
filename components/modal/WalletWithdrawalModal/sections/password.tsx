import React from 'react'
import { IoClose } from 'react-icons/io5'
import * as Yup from 'yup'
import CustomTextInput from '@/components/input/CustomTextInput'
import { useFormik } from 'formik'
import AuthButton from '@/components/button/AuthButton'
import { useMutation } from '@tanstack/react-query'
import { processBfWalletWithdrawal } from '@/api/bereavement-fund/bfWallet'
import { useSettingModal } from '@/contexts/modal-setting'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { queryClient } from '@/contexts/ProviderWrapper'
import { useContextSelector } from 'use-context-selector'
import { UserContext } from '@/contexts/user'
import Link from 'next/link'

const PasswordModal: React.FC = () => {
  const { modalData, closeModal, updateModalData } = useSettingModal()
  const { values, handleChange, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
    }),
    onSubmit: values => {
      mutate()
      console.log('Password submitted:', values)
    }
  })
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  )

  const bfId = useParams()?.bfId as string

  const data = modalData?.walletWithdrawalModal
  const withdrawalData = data?.withdrawalData
  const bank = data?.bank

  const validateWithdrawalData = () => {
    if (!values.password) {
      toast.error('Password is required.')
      return false
    }
    if (!bfId) {
      toast.error('Fund ID is missing.')
      return false
    }
    return true
  }

  const { isPending, mutate } = useMutation({
    mutationFn: () => {
      if (!validateWithdrawalData()) {
        throw new Error('Validation failed')
      }

      // Determine payment provider based on destination
      let paymentProvider: 'mtn-ug' | 'airtel-ug' | 'flutterwave'
      if (withdrawalData.destination === 'bank-account') {
        paymentProvider = 'flutterwave'
      } else {
        // For mobile money, use the selected network
        paymentProvider = withdrawalData.network as 'mtn-ug' | 'airtel-ug'
      }

      return processBfWalletWithdrawal({
        amount: withdrawalData?.amount,
        accountNumber: withdrawalData?.accountNumber,
        accountName: withdrawalData?.accountName,
        bankCode: bank?.code|| null,
        password: values?.password,
        fundId: bfId,
        paymentProvider
      })
    },
    onSuccess: () => {
      updateModalData('walletWithdrawalModal', {
        ...modalData?.walletWithdrawalModal,
        state: 3
      })
      queryClient.invalidateQueries({
        queryKey: [bfId, 'user-wallet', currentUser?.id]
      })
      queryClient.invalidateQueries({
        queryKey: ['transactions-user', bfId]
      })
    },
    onError: (data: any) => {
      toast.success(data.error || data.message || JSON.stringify(data))
    }
  })

  return (
    <div className='bg-white rounded-lg shadow-lg max-h-[70vh] w-full max-w-lg overflow-auto z-10'>
      <div className='p-5 mb-8'>
        <div className='flex justify-end mb-4'>
          <button
            className='text-divider-200 hover:text-divider-300 transition-colors'
            onClick={() => closeModal('walletWithdrawalModal')}
          >
            <IoClose size={25} />
          </button>
        </div>

        <div className='text-center mb-6'>
          <h2 className='text-xl font-extrabold flex justify-start items-start'>
            Confirm withdrawal
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4'>
            <CustomTextInput
              type='password'
              id='password'
              label='Password'
              placeholder='Enter account password'
              inputClassName='bg-divider-100'
              value={values.password}
              onChange={handleChange}
              error={touched?.password && errors?.password}
              className='[&_label]:font-bold'
            />
          </div>

          <p className='text-[12px] font-inter mt-6'>
            Your password is required to authorize withdrawals for the security
            of your funds.{' '}
            <Link
              href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/faqs#Can-I-exit-the-Fund`}
              className='text-primary hover:text-blue-800'
            >
              Learn more
            </Link>
          </p>

          <div className='flex justify-center mt-8'>
            <AuthButton
              type='submit'
              text='Withdraw'
              className='bg-[#DE3108]'
              isLoading={isPending}
              handleClick={() => mutate()}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordModal
