'use client'

import {
  assignRole,
  getBfRolesOptionsWithCustomRoles,
  assignCustomBfRoleToUser
} from '@/api/bereavement-fund/roles'
import CustomAvatar from '@/components/custom/CustomAvatar'
import CustomSelect from '@/components/input/CustomSelect'
import { useSettingModal } from '@/contexts/modal-setting'
import { queryClient } from '@/contexts/ProviderWrapper'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const AssignRole = () => {
  const { closeModal, modalData, updateModalData } = useSettingModal()
  const [selected, setSelected] = useState('')

  const bfId = useParams().bfId as string
  const handleToggleModal = () => {
    closeModal('assignRoleModal')
  }

  const member = modalData?.assignRoleModal?.member

  const { data: roleOptions, isLoading: isLoadingRoleOptions } = useQuery({
    queryKey: ['bf-role-options-with-custom-roles', bfId],
    queryFn: () => getBfRolesOptionsWithCustomRoles(bfId),
    enabled: !!bfId && !!member
  })

  const options = useMemo(() => {
    return (
      roleOptions?.data?.roles
        ?.filter(role => role.permission !== 'PRINCIPAL')
        .map(role => {
          return {
            value: role.id, // Use role.id for custom roles, role.permission for regular roles
            label:
              role.name.toLocaleUpperCase() ||
              role.permission.toLocaleUpperCase(),
            isCustom: role.isCustom,
            permission: role.permission
          }
        }) || []
    )
  }, [roleOptions?.data?.roles])

  // Find the selected role object to determine if it's custom
  const selectedRoleOption = options.find(option => option.value === selected)

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (selectedRoleOption?.isCustom) {
        // For custom roles, use assignCustomBfRoleToUser
        return await assignCustomBfRoleToUser(bfId, {
          customBfRoleOptionId: selected,
          userId: member?.userId
        })
      } else {
        // For regular roles, use assignRole with permission
        return await assignRole(bfId, {
          role: selectedRoleOption?.permission || selected,
          userId: member?.userId
        })
      }
    },
    onSuccess: data => {
      console.log(data, 'datadatadatadata')
      queryClient.invalidateQueries({
        queryKey: ['-bf-members-', bfId, 'PRINCIPAL', 'strict-mode']
      })
      queryClient.invalidateQueries({
        queryKey: ['-bf-members-', bfId]
      })
      updateModalData('assignRoleModal', {
        ...modalData?.assignRoleModal,
        state: 2
      })
    },
    onError: (data: any) => {
      toast.error(data.message || JSON.stringify(data?.error || data))
    }
  })

  return (
    <>
      <div className='w-full flex justify-between'>
        <span className='font-bold text-[25px] leading-[150%] tracking-[0.03px] text-[#1d1c1d]'>
          Assign role
        </span>
        <button onClick={() => handleToggleModal()}>
          <svg
            width='13'
            height='14'
            viewBox='0 0 13 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8.96409 6.99996L12.6599 3.43463C13.1134 2.99711 13.1134 2.28775 12.6599 1.84988L11.8385 1.05751C11.385 0.619991 10.6497 0.619991 10.1958 1.05751L6.5 4.62284L2.80423 1.05751C2.35071 0.619991 1.6154 0.619991 1.16151 1.05751L0.340142 1.84988C-0.113381 2.2874 -0.113381 2.99676 0.340142 3.43463L4.03591 6.99996L0.340142 10.5653C-0.113381 11.0028 -0.113381 11.7122 0.340142 12.15L1.16151 12.9424C1.61503 13.3799 2.35071 13.3799 2.80423 12.9424L6.5 9.37708L10.1958 12.9424C10.6493 13.3799 11.385 13.3799 11.8385 12.9424L12.6599 12.15C13.1134 11.7125 13.1134 11.0032 12.6599 10.5653L8.96409 6.99996Z'
              fill='#808080'
            />
          </svg>
        </button>
      </div>
      <div className='mt-9 py-3 px-5 rounded-[10px] bg-[#f5f5f5] flex justify-start items-center gap-4'>
        <div className='pt-1'>
          <CustomAvatar
            image={member?.profileImage}
            userFullName={`${member?.firstName} ${member?.lastName}`}
            className='relative top-0'
            imageClassName='w-[50px] h-[50px] rounded-[10px] border overflow-hidden object-top text-[32px] font-bold text-primary'
            labelClassName='flex w-[50px] h-[50px] items-center justify-center overflow-hidden rounded-[10px]'
            alt='profile image'
            showText={false}
            disabled={true}
            isCurrentUser={false}
            iconClassName='size-[28px]'
          />
        </div>
        <div className='flex flex-col justify-start items-start'>
          <p className='font-medium text-base leading-[150%] tracking-[0.03px] text-[#1d1c1d]'>
            {member?.firstName} {member?.lastName}
          </p>
          <p className='font-normal text-[13px] leading-[150%] tracking-[0.03px] text-[#1d1c1d]'>
            @{member?.userName}
          </p>
        </div>
      </div>
      <div className='mt-5 w-full'>
        <CustomSelect
          label='Role'
          value={selected}
          onChange={setSelected}
          className='w-full [&>label]:mb-3 [&>label]:font-semibold [&>label]text-base [&>label]leading-[150%] [&>label]tracking-[-0.03px]'
          options={options}
          placeholder='Choose one'
          optionPlaceHolder='Options'
          showStar={false}
          isLoading={isLoadingRoleOptions}
        />
        <p className='mt-5 text-[12px] leading-[150%] tracking-[0%] text-[#1a1a1a]'>
          Select a role you want to assign to this user.{' '}
        </p>
      </div>
      <div className='mt-9 w-full flex justify-end items-center gap-4'>
        <button
          onClick={() => handleToggleModal()}
          className='py-3 px-6 border duration-500 transition-all border-[#969696] rounded-md text-primary hover:border-primary  '
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (selected === '') {
              toast.error('Please select a role before assigning.')
              return
            }
            mutate()
          }}
          className={`py-3 px-6 bg-primary rounded-md text-white duration-500 transition-all filter hover:brightness-125 ${
            selected === '' ? 'opacity-85' : ''
          }`}
        >
          {isPending ? 'Assigning...' : 'Assign'}
        </button>
      </div>
    </>
  )
}

export default AssignRole
