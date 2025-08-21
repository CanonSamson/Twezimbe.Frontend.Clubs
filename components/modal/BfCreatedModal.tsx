'use client'
import { Dialog, DialogContent } from '../ui/dialog'
import { BsHash } from 'react-icons/bs'
import { GoChevronRight } from 'react-icons/go'

import Lottie from 'react-lottie'
import loadingAnimationData from '../../public/assets/animations/loading.json'
import confirmedAnimationData from '@/public/assets/animations/confirmed.json'
import { useSettingModal } from '@/contexts/modal-setting'
import { useParams, useRouter } from 'next/navigation'

const BfCreatedModal = () => {
  const { modals, toggleModal, modalData } = useSettingModal()

  const isPending = false

  const router = useRouter()
  const groupId = useParams().groupId

  const setOpen = () => {
    if (modalData?.bfCreatedModal?.fundId) {
      router.replace(
        `/bf/settings/${groupId}/${modalData?.bfCreatedModal?.fundId}`
      )
      toggleModal('bfCreatedModal', {})
    }
  }

  return (
    <Dialog open={modals.bfCreatedModal} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[525px] py-10  bg-white'>
        <div className=' flex flex-col '>
          <div className='pb-10'>
            <div className='  flex flex-col items-center  justify-center'>
              <div className=' bg-[#C3DBEC] h-[150px] w-[150px] mb-8 rounded-full flex items-center justify-center'>
                <Lottie
                  options={{
                    loop: false,
                    autoplay: true,
                    animationData: confirmedAnimationData,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice'
                    }
                  }}
                  height={150}
                  width={150}
                />
              </div>
              <h1 className='  text-xl font-semibold text-center'>Great!</h1>
              <p className='  text-center text-divider-300 mt-2'>
                Your details have been updated successfully
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen()}
            disabled={isPending}
            className=' flex  items-center w-full p-4 rounded-[5px] justify-between bg-primary text-white'
          >
            <div className=' flex items-center gap-4'>
              <BsHash size={24} />
              <div className=' flex flex-col'>
                <span>Continue</span>
              </div>
            </div>
            <div>
              {isPending ? (
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: loadingAnimationData,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice'
                    }
                  }}
                  height={44}
                  width={44}
                />
              ) : (
                <GoChevronRight size={24} />
              )}
            </div>
          </button>
          <span className=' mt-2 text-[14px] justify-center text-center'>
            Remember to adhere to{' '}
            <span className=' underline text-primary'>Group guidelines</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BfCreatedModal
