'use client'

import { createCustomBfRole } from '@/api/bereavement-fund/roles'
import CustomTextInput from '@/components/input/CustomTextInput'
import { useSettingModal } from '@/contexts/modal-setting'
import { queryClient } from '@/contexts/ProviderWrapper'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { toast } from 'sonner'

const roles = [
  {
    id: 'ADMIN',
    label: 'Admin',
    description:
      'Has full control of the group, including roles, approvals, financials, and governance.'
  },
  {
    id: 'SUPERVISOR',
    label: 'Supervisor',
    description:
      'Can approve members, verify KYC, assign roles, manage settings, and send messages. Cannot access financials.'
  },
  {
    id: 'TREASURER',
    label: 'Treasurer',
    description:
      'Manages financial operations, transactions, and monetary oversight of the group.'
  }
]

const Access: React.FC<{
  handleToggleModal: () => void
}> = ({ handleToggleModal }) => {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [customRole, setCustomRole] = useState('')
  const [touched, setTouched] = useState(false)

  const { modalData, updateModalData, closeModal } = useSettingModal()

  const back = () => {
    updateModalData('customRoleModal', {
      customRoleModal: {
        ...modalData?.customRoleModal,
        step: modalData?.customRoleModal?.step
          ? modalData?.customRoleModal?.step - 1
          : 1
      }
    })
  }
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomRole(e.target.value)
  }

  const bfId = useParams()?.bfId as string
  const { mutate, isPending } = useMutation({
    mutationKey: ['customRole', bfId],
    mutationFn: () =>
      createCustomBfRole(bfId, {
        permission: selectedRole,
        name: customRole
      }),
    onSuccess: () => {
      toast.success('Custom role created successfully!')
      // Close the modal or navigate to next step
      closeModal('customRoleModal')
      // Optionally refresh any related queries
      queryClient.invalidateQueries({
        queryKey: ['bf-role-options-with-custom-roles', bfId]
      })
    },
    onError: (error: any) => {
      console.error('Error creating custom role:', error)
      toast.error(
        error?.response?.data?.message || 'Failed to create custom role'
      )
    }
  })

  const handleNext = () => {
    setTouched(true)
    if (customRole.trim() && selectedRole) {
      mutate()
    }
  }

  const error = touched && !customRole.trim() ? 'Role name is required.' : ''

  return (
    <>
      <div className='w-full max-h-[50vh] overflow-y-auto relative px-6 py-8'>
        <button
          onClick={handleToggleModal}
          className='absolute top-4 right-4 text-divider-200 hover:text-divider-300 transition-colors duration-300'
        >
          <IoClose size={34} />
        </button>

        <div className=''>
          <div className='text-start mt-5'>
            <h2 className='text-xl font-bold'>Create a custom role</h2>
          </div>

          <CustomTextInput
            type='text'
            id='customRole'
            value={customRole.toLocaleUpperCase()}
            onChange={handleChange}
            error={error}
            label='Role Name'
            placeholder='Add Role'
            inputClassName='bg-gray-50'
            className='flex-1 [&_label]:font-semibold mt-4'
          />

          <p className='text-[14px] text-divider-200 mb-6 mt-4 text-start'>
            Insert the role you want to include in your BF
          </p>
        </div>

        <div className='text-start space-y-1'>
          <h1 className='font-bold text-black text-lg mb-6'>
            Set access level for this role
          </h1>
          <p className='text-black text-[12px]'>
            Pick the access level this custom role should have by using any of
            Twezimbe&lsquo;s preset role types as a base.
          </p>
        </div>

        <div className='mt-6 space-y-4'>
          {roles.map(({ id, label, description }) => (
            <label
              key={id}
              htmlFor={id}
              className={`flex items-start gap-3 p-4 rounded-md cursor-pointer transition-all border ${
                selectedRole === id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-gray-100 border-transparent'
              }`}
            >
              <input
                type='radio'
                id={id}
                name='roleSelection'
                value={id}
                checked={selectedRole === id}
                onChange={handleSelect}
                className='mt-1 w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-500'
              />
              <div>
                <h1 className='text-[14px] font-semibold text-black'>
                  {label}
                </h1>
                <span className='text-[12px] text-black block'>
                  {description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className='flex justify-end gap-3 px-4 mb-6 pt-2'>
        <button
          className='px-4 py-2 bg-white text-primary border border-gray-300 rounded-md'
          onClick={back}
        >
          Cancel
        </button>
        <button
          className={`px-4 py-2 text-white rounded-md transition ${
            selectedRole && customRole.trim() && !isPending
              ? 'bg-primary hover:bg-primary-dark'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleNext}
          disabled={!selectedRole || !customRole.trim() || isPending}
        >
          {isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
    </>
  )
}

export default Access
