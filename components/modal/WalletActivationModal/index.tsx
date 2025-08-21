'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import Activate from './sections/Activate'
import Input from './sections/Input'
import Hang from './sections/Hang'
import Wallet from './sections/Wallet'

const WalletActivationModal = () => {
  const { modals, closeModal, updateModalData, modalData } = useSettingModal()
  const walletActivationModal = modals.walletActivationModal
  const step = modalData.walletActivationModal?.step || 1

  const next = () =>
    updateModalData('walletActivationModal', { step: step + 1 })
  const back = () => {
    if (step == 2) {
      return closeModal('walletActivationModal')
    }
    updateModalData('walletActivationModal', { step: step - 1 })
  }

  const handleToggleModal = () => {
    closeModal('walletActivationModal')
    updateModalData('walletActivationModal', { step: 1, activated: false })
  }

  const handleActivationComplete = () => {
    updateModalData('walletActivationModal', { activated: true })
    handleToggleModal()
  }

  return (
    <>
      <div
        className={`${
          walletActivationModal ? 'max-tablet-lg:hidden flex' : 'hidden'
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={() => {
            closeModal('walletActivationModal')
          }}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            walletActivationModal ? 'flex' : 'hidden'
          }`}
        />

        <div className='bg-white z-20 duration-500 transition-all relative w-[440px] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg'>
          {step === 1 && <Wallet next={next} />}
          {step === 4 && (
            <Activate next={next} handleToggleModal={handleToggleModal} />
          )}
          {step === 2 && (
            <Input
              handleToggleModal={handleToggleModal}
              back={back}
              next={next}
            />
          )}
          {step === 3 && <Hang handleToggleModal={handleActivationComplete} />}
        </div>
      </div>
    </>
  )
}

export default WalletActivationModal
