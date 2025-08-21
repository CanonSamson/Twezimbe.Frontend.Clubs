'use client'

import { uploadFiles } from '@/api/file-upload'
import {
  getDeclarationInfo,
  updateDeclarationInfo
} from '@/api/user-ekyc/declaration'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { useSettingModal } from '@/contexts/modal-setting'
import { UserContext, UserContextType } from '@/contexts/user'
import { hasChanges } from '@/utils/functions/check'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'sonner'
import { useContextSelector } from 'use-context-selector'

const Declaration = () => {
  const { toggleModal } = useSettingModal()
  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  )
  const fetchCurrentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.fetchCurrentUser
  )

  const [isSubmiting, setIsSubmiting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const submit = async () => {
    try {
      setIsSubmiting(true)
      if (
        !hasChanges(
          {
            agreed,
            signature
          },
          {
            agreed: data?.data.data.agreed,
            signature: data?.data.data.signature
          }
        )
      ) {
        toast.info('No changes to update')
        return
      }
      const response = await updateDeclarationInfo({
        agreed,
        signature
      })

      if (response?.data?.success) {
        const modalData: any = {
          description: 'Declaration Information has been Updated Successfully',
          title: 'Great'
        }

        if (!!response?.data.completed) {
          toggleModal('detailsUpdatedModal', { completed: true })
        } else {
          toggleModal('detailsUpdatedModal', modalData)
        }
        fetchCurrentUser({ load: false })

        // Exit edit mode after successful submission
        setIsEditing(false)
      }
      // Exit edit mode after successful submission
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update declaration information')
      console.error('Error updating declaration:', error)
    } finally {
      setIsSubmiting(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset values to original data
    if (data) {
      setAgreed(data.data.data.agreed)
      setSignature(data.data.data.signature)
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['kyc-declaration', currentUser?.id],
    queryFn: () => getDeclarationInfo()
  })
  const [agreed, setAgreed] = useState(data?.data.data.agreed || false)
  const [signature, setSignature] = useState(data?.data.data.signature || '')

  const disabled = (data?.data && isLoading) || isSubmiting

  const uploadFile = async (image: File) => {
    try {
      const response = await uploadFiles([image])
      if (!response?.data?.success) {
        throw new Error('Failed to upload image')
      }
      return response.data.files[0].url
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Failed to upload image')
    }
  }

  useEffect(() => {
    if (data) {
      setAgreed(data.data.data.agreed)
      setSignature(data.data.data.signature)
    }
  }, [data])

  // Determine if inputs should be disabled
  const inputsDisabled = disabled || !isEditing

  return (
    <div className=' tablet:px-10 pb-20'>
      <div className=' flex items-center gap-2'>
        <h4 className=' text-[22px]   font-semibold '>
          Declaration statement{' '}
        </h4>
      </div>

      <p className=' mt-5'>
        {`"I hereby declare that the information given in this form is, to the
        best of my knowledge, true and accurate. I fully understand that giving
        false information may call for adverse actions against my membership
        including rejecting my application or termination of my membership if
        discovered later, after admission to the Twezimbe platform I commit to
        notify the Management of the Twezimbe Platform should the information in
        this form change from time to time. If admitted, I commit to fully abide
        by the Rules and Regulations governing the Twezimbe platform as may be
        formulated from time to time."`}
      </p>

      <div className=' mt-10 flex gap-2'>
        <input
          type='checkbox'
          checked={agreed}
          onChange={() => !inputsDisabled && setAgreed(!agreed)}
          className='h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isLoading || inputsDisabled}
        />
        <span>
          I agree to the above declaration and the platform&lsquo;s{' '}
          <a
            href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/terms`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary'
          >
            Terms & Conditions.
          </a>
        </span>
      </div>

      <div className=' mt-10'>
        <div className=' flex items-center gap-4 w-full'>
          <CustomAvatar
            image={signature || data?.data.data.signature}
            className=' justify-start'
            labelClassName=' h-[50px] w-[50px]'
            alt='signature'
            showText={false}
            disabled={isLoading || inputsDisabled}
            onFileChange={async file => {
              if (file && isEditing) {
                toast.promise(uploadFile(file), {
                  loading: 'Uploading document...',
                  success: response => {
                    setSignature(response)
                    return 'Document uploaded successfully'
                  },
                  error: 'Failed to upload document'
                })
              }
            }}
          />
          <span className=' flex text-[16px]'>
            {inputsDisabled ? 'Signature' : 'Upload signature'}
          </span>
        </div>
      </div>

      <div className='flex justify-start max-tablet:justify-between items-center gap-4 mt-10'>
        <button
          type='button'
          className='text-primary px-5 py-3 hidden max-tablet:flex items-center gap-2 duration-500 transition-all'
          onClick={() => window.history.back()}
        >
          Back
        </button>

        {!isEditing && !disabled ? (
          <button
            type='button'
            onClick={handleEdit}
            className='border-divider px-5 py-3 flex items-center gap-2 border rounded duration-500 transition-all max-tablet:ml-auto max-tablet:bg-primary max-tablet:text-white max-tablet:rounded-md max-tablet:border-none max-tablet:font-inter'
          >
            Edit
          </button>
        ) : (
          <div className='flex items-center gap-3'>
            {isEditing && (
              <button
                type='button'
                onClick={handleCancel}
                className='text-gray-600 px-5 py-3 flex items-center gap-2 border border-gray-300 rounded duration-500 transition-all max-tablet:rounded-md max-tablet:font-inter'
              >
                Cancel
              </button>
            )}
            <button
              type='button'
              disabled={disabled || isSubmiting || !isEditing}
              className='border-divider px-5 py-3 flex items-center gap-2 border rounded duration-500 transition-all max-tablet:ml-auto max-tablet:bg-primary max-tablet:text-white max-tablet:rounded-md max-tablet:border-none max-tablet:font-inter disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={() => submit()}
            >
              Save Changes{' '}
              {isSubmiting && (
                <AiOutlineLoading3Quarters
                  size={20}
                  className='animate-spin duration-500 transition-all'
                />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Declaration
