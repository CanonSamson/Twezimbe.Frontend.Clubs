import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import * as Yup from 'yup'
import CustomBfCurrencyInput from '@/components/input/CustomBfCurrencyInput'
import { useFormik } from 'formik'
import AuthButton from '@/components/button/AuthButton'
import CustomSelect from '@/components/input/CustomSelect'
import CustomCountrySelect from '@/components/input/CustomCountrySelect'
import CustomTextInput from '@/components/input/CustomTextInput'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getBanks, retrieveAccountDetails } from '@/api/bank'
import { toast } from 'sonner'
import { useSettingModal } from '@/contexts/modal-setting'
import { fetchBasicUserInfo } from '@/lib/features/kyc/basicUserInfoSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  destination: Yup.string().required('Destination is required'),
  mobileNumber: Yup.string().when('destination', {
    is: 'mobile-money',
    then: schema => schema.required('Mobile number is required')
  }),
  network: Yup.string().when('destination', {
    is: 'mobile-money',
    then: schema => schema.required('Network is required')
  }),
  bankName: Yup.string().when('destination', {
    is: 'bank-account',
    then: schema => schema.required('Bank name is required')
  }),
  accountNumber: Yup.string().when('destination', {
    is: 'bank-account',
    then: schema =>
      schema
        .required('Account number is required')
        .matches(/^\d{10}$/, 'Account number must be exactly 10 digits')
        .test(
          'is-ug-account',
          'Invalid Ugandan account number format',
          value => {
            if (!value) return true // Let required handle empty values
            return /^\d{10}$/.test(value) // Ensures exactly 10 digits
          }
        )
  }),

  accountName: Yup.string().when('destination', {
    is: 'bank-account',
    then: schema => schema.required('Account name is required')
  })
})

const Withdrawal: React.FC = () => {
  const { modals, toggleModal, modalData, updateModalData } = useSettingModal()
  const dispatch = useAppDispatch()
  const basicUserInfo = useAppSelector(
    state => state.basicUserInfo.basicUserInfo
  )
  const isLoadingUserInfo = useAppSelector(state => state.basicUserInfo.loading)

  const [bank, setBank] = useState<null | {
    id: number
    code: string
    name: string
  }>(null)

  const walletWithdrawalModal = modals?.walletWithdrawalModal
  const {
    setFieldValue,
    handleChange,
    values,
    errors,
    touched,
    handleSubmit,
    setFieldError
  } = useFormik({
    initialValues: {
      amount: '',
      destination: 'bank-account' as 'mobile-money' | 'bank-account',
      mobileNumber: basicUserInfo.mobileNumber || '',
      network: '',
      bankName: '',
      accountNumber: '',
      accountName: ''
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log('Withdrawal data:', values)
      updateModalData('walletWithdrawalModal', {
        ...modalData?.walletWithdrawalModal,
        withdrawalData: values,
        bank,
        state: 2
      })
      setSubmitting(false)
    }
  })

  const { data: banksData } = useQuery({
    queryKey: [
      `${values.destination === 'mobile-money' ? `mobileMoney` : `banks`}`,
      'UG'
    ],
    queryFn: () =>
      getBanks({
        mobileMoney: values.destination === 'mobile-money' ? 'true' : 'false',
        countryCode: 'UG'
      }),
    enabled: !!values.destination && !!walletWithdrawalModal
  })

  const { mutate } = useMutation({
    mutationFn: ({
      accountNumber,
      bankCode
    }: {
      accountNumber: string
      bankCode: string
    }) =>
      retrieveAccountDetails({
        accountNumber,
        bankCode
      }),
    onSuccess: data => {
      toast.success('Account details retrieved')
      setFieldValue('accountName', data?.data?.data?.account_name as string)
    },
    onError: error => {
      setFieldError('accountNumber', 'Failed to retrieve account details')
      toast.error('Failed to retrieve account details')
      console.error(error)
    }
  })

  useEffect(() => {
    if (!walletWithdrawalModal) return
    const check = () => {
      const isValid = values.accountNumber?.length === 10 && bank?.code
      if (isValid) {
        mutate({
          accountNumber: values.accountNumber,
          bankCode: bank.code
          // accountNumber: "0690000040",
          // bankCode: "044",
        })
      }
    }

    check()
  }, [values?.accountNumber, bank, walletWithdrawalModal])

  useEffect(() => {
    dispatch(fetchBasicUserInfo())
  }, [dispatch])

  // Update mobile number when basicUserInfo is loaded from eKYC
  useEffect(() => {
    if (
      basicUserInfo.mobileNumber &&
      basicUserInfo.mobileNumber !== values.mobileNumber
    ) {
      setFieldValue('mobileNumber', basicUserInfo.mobileNumber)
    }
  }, [basicUserInfo.mobileNumber, setFieldValue])

  const banks = banksData?.data?.data || []
  return (
    <div className='bg-white rounded-lg shadow-lg max-h-[70vh] w-full max-w-md overflow-auto z-10'>
      <div className='p-5 mb-8'>
        <div className='flex justify-end items-center mb-4'>
          <button
            className='text-divider-200 hover:text-divider-300 duration-500 transition-colors'
            onClick={() => toggleModal('walletWithdrawalModal')}
          >
            <IoClose size={25} />
          </button>
        </div>

        <div className='text-center mt-5'>
          <h2 className='text-xl font-extrabold flex justify-start'>
            Withdraw
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4'>
            <CustomBfCurrencyInput
              type='text'
              id='amount'
              value={values.amount}
              label='Amount to withdraw'
              placeholder='Amount'
              className='mt-4 font-bold'
              inputClassName='bg-divider-100 font-normal'
              onChange={e => {
                setFieldValue('amount', e.target.value)
              }}
              error={touched.amount && errors.amount}
            />

            <CustomSelect
              label='Destination of funds'
              selectTriggerClassName='bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]'
              options={[
                // { label: 'Mobile Money', value: 'mobile-money' },
                { label: 'Bank account', value: 'bank-account' }
              ]}
              placeholder='Select destination'
              className='flex-1 mt-0 [&_label]:font-bold'
              value={values.destination}
              onChange={(val: string) =>
                setFieldValue('destination', val as typeof values.destination)
              }
              error={touched.destination && errors.destination}
            />

            {values.destination === 'mobile-money' ? (
              <div className='flex flex-col gap-4'>
                <CustomCountrySelect
                  label='Mobile money number'
                  selectTriggerClassName='bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]'
                  className='[&_label]:font-bold'
                  value={values.mobileNumber}
                  onChange={(val: any) => setFieldValue('mobileNumber', val)}
                  error={touched.mobileNumber && errors.mobileNumber}
                  disabled={true}
                />

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                  <p className='text-sm text-blue-700'>
                    <span className='font-medium'>Note:</span>{' '}
                    {isLoadingUserInfo
                      ? 'Loading mobile money number from your eKYC profile...'
                      : 'The mobile money number is retrieved from your eKYC profile. If you need to update this number, please change it in your KYC profile first.'}
                  </p>
                </div>

                <CustomSelect
                  label='Network'
                  selectTriggerClassName='bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]'
                  options={[
                    { label: 'MTN', value: 'mtn-ug' }
                    // { label: 'Airtel', value: 'airtel-ug' }
                  ]}
                  placeholder='Select network'
                  className='flex-1 mt-0 [&_label]:font-bold'
                  value={values.network}
                  onChange={(val: any) => setFieldValue('network', val)}
                  error={touched.network && errors.network}
                />
              </div>
            ) : (
              <div className='flex flex-col gap-4'>
                <CustomSelect
                  label='Bank Name'
                  selectTriggerClassName='bg-divider-100 border border-divider rounded-[10px] min-h-[50px] h-[50px]'
                  options={banks?.map((bank: { name: string }) => ({
                    label: bank.name,
                    value: bank.name
                  }))}
                  placeholder={values.bankName?.trim() || 'Search bank...'}
                  className='flex-1 mt-0 [&_label]:font-bold'
                  value={values.bankName}
                  onChange={(val: string) => {
                    setFieldValue('bankName', val)
                    const bank = banks?.find(bank => bank?.name === val)
                    if (bank) {
                      setBank(bank)
                    }
                  }}
                  error={touched?.bankName && errors.bankName}
                  isSearchable={true}
                />
                <CustomTextInput
                  type='text'
                  id='accountNumber'
                  label='Account Number'
                  placeholder='enter number'
                  inputClassName='bg-divider-100'
                  value={values.accountNumber}
                  onChange={handleChange}
                  error={touched?.accountNumber && errors?.accountNumber}
                  className='[&_label]:font-bold'
                />
                <CustomTextInput
                  type='text'
                  id='accountName'
                  label='Account Name'
                  placeholder='enter Account Name'
                  inputClassName='bg-divider-100'
                  value={values.accountName}
                  onChange={handleChange}
                  error={touched.accountName && errors.accountName}
                  className='[&_label]:font-bold'
                />
              </div>
            )}
          </div>
          <div className='flex justify-center mt-10'>
            <AuthButton
              type='submit'
              text='Withdraw'
              className='bg-[#DE3108]'
              // handleClick={goToNextStep}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Withdrawal
