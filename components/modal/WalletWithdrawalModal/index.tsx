import React from 'react'
import { useSettingModal } from '@/contexts/modal-setting'
import Withdrawal from './sections/withdrawal'
import Password from './sections/password'
import Done from './sections/done'

const WalletWithdrawalModal = () => {
  const { modals, toggleModal, modalData } = useSettingModal()

  const currentStep = modalData?.walletWithdrawalModal?.state

  return (
    <div
      className={`fixed inset-0 z-[55] items-center justify-center ${
        modals.walletWithdrawalModal ? 'flex' : 'hidden'
      }`}
    >
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={() => toggleModal('walletWithdrawalModal')}
      />

      {currentStep === 1 ? (
        <Withdrawal />
      ) : currentStep === 2 ? (
        <Password />
      ) : (
        <Done />
      )}
    </div>
  )
}

export default WalletWithdrawalModal
