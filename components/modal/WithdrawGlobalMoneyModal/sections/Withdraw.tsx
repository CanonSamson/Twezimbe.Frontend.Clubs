'use client'

import { IoClose } from 'react-icons/io5'
import * as React from 'react'
import CustomSelect from '@/components/input/CustomSelect'
import CustomTextInput from '@/components/input/CustomTextInput'

const Withdraw: React.FC<{
  next: () => void
  handleToggleModal: () => void
}> = ({ next, handleToggleModal }) => {
  const [amount, setAmount] = React.useState('')
  const [mobileMoneyNumber, setMobileMoneyNumber] = React.useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<
    'mobile_money' | 'bank_account' | ''
  >('')
  const [selectedNetwork, setSelectedNetwork] = React.useState('')
  const [bankName, setBankName] = React.useState('')
  const [accountNumber, setAccountNumber] = React.useState('')
  const [accountName, setAccountName] = React.useState('')

  return (
    <>
      <div className='p-4'>
        <div className='flex justify-end mb-4'>
          <button
            className='text-divider-200 hover:text-divider-300 transition-colors duration-200'
            onClick={handleToggleModal}
          >
            <IoClose size={24} />
          </button>
        </div>

        <h2 className='text-xl font-bold text-left'>Withdraw</h2>

        <div className='rounded-lg w-full gap-4 mt-4'>
          <CustomTextInput
            type='text'
            id='fundAmount'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            label='Amount to withdraw'
            placeholder='Amount'
            inputClassName='bg-gray-50'
          />

          <div className='mt-4'>
            <CustomSelect
              label='Destination of funds'
              placeholder='Select'
              options={[
                { value: 'mobile_money', label: 'Mobile Money' },
                { value: 'bank_account', label: 'Bank Account' }
              ]}
              value={selectedPaymentMethod}
              onChange={value =>
                setSelectedPaymentMethod(
                  value as 'mobile_money' | 'bank_account'
                )
              }
              className='font-inter text-gray-700'
            />
          </div>

          {selectedPaymentMethod === 'mobile_money' && (
            <>
              <div className='mt-4'>
                <CustomTextInput
                  type='tel'
                  id='mobileMoneyNumber'
                  value={mobileMoneyNumber}
                  onChange={e => setMobileMoneyNumber(e.target.value)}
                  label='Mobile Money Number'
                  placeholder='+256 enter number'
                  inputClassName='bg-gray-50'
                />
              </div>

              <div className='mt-4'>
                <CustomSelect
                  label='Network'
                  placeholder='Select Network'
                  options={[
                    { value: 'mtn-ug', label: 'MTN' }
                    // { value: "airtel", label: "Airtel" },
                  ]}
                  value={selectedNetwork}
                  onChange={value => setSelectedNetwork(value)}
                  className='font-inter text-gray-700'
                />
              </div>
            </>
          )}

          {selectedPaymentMethod === 'bank_account' && (
            <>
              <div className='mt-4'>
                <CustomTextInput
                  type='text'
                  id='bankName'
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  label='Bank Name'
                  placeholder='Enter bank name'
                  inputClassName='bg-gray-50'
                />
              </div>

              <div className='mt-4'>
                <CustomTextInput
                  type='text'
                  id='accountNumber'
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  label='Account Number'
                  placeholder='Enter number'
                  inputClassName='bg-gray-50'
                />
              </div>

              <div className='mt-4'>
                <CustomTextInput
                  type='text'
                  id='accountName'
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  label='Account Name'
                  placeholder='Enter name'
                  inputClassName='bg-gray-50'
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className='w-full bg-white p-3 flex justify-center'>
        <button
          className='w-full max-w-md px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50'
          onClick={next}
          disabled={!amount || !selectedPaymentMethod}
        >
          Withdraw
        </button>
      </div>
    </>
  )
}

export default Withdraw
