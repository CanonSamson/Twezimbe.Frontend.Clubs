'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import AuthButton from '@/components/button/AuthButton'
import Link from 'next/link'
import CustomDialog from '../custom/CustomDialog'
import { usePathname } from 'next/navigation'

const BfKycRequiredModal = () => {
  const { closeModal } = useSettingModal()
  const pathname = usePathname()

  const noun = pathname === '/global-wallet' ? 'wallet' : 'fund'

  return (
    <CustomDialog
      close={() => {
      }}
      name='bfKycRequiredModal'
      contentClassName=' text-center py-10 font-inter bg-white'
    >
      <div>
        <h2 className=' text-[22px] font-semibold'>Complete KYC</h2>

        <p className=' text-divider-300 mt-4'>
          For a secure and transparent platform, we require you to complete your
          KYC before creating a {noun}
        </p>

        <Link
          onClick={() => {
            closeModal('bfKycRequiredModal')
          }}
          href={'/settings/kyc/general'}
        >
          <AuthButton
            text='Fill out KYC'
            className=' mt-10'
            handleClick={() => {}}
          />
        </Link>
      </div>
    </CustomDialog>
  )
}

export default BfKycRequiredModal
