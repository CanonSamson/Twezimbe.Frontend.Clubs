'use client'

import CustomTextInput from '@/components/input/CustomTextInput'
import { useState } from 'react'
import { IoClose, IoCheckmark } from 'react-icons/io5'
import { useSettingModal } from '@/contexts/modal-setting'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createChannel } from '@/api/channel'

export type NewChannelBodyType = {
  name: string
  type: 'TEXT'
  privacy: 'PUBLIC' | 'PRIVATE'
}

const CreateChannelModal = () => {
  const groupId = useParams()?.groupId as string
  const [isCreating, setIsCreating] = useState(false)

  const [channel, setChannel] = useState<NewChannelBodyType>({
    name: '',
    type: 'TEXT',
    privacy: 'PUBLIC'
  })
  const router = useRouter()

  const { toggleModal, modals } = useSettingModal()

  const handleCreateChannel = async () => {
    const channelData = {
      ...channel,
      name: channel.name.trim().toLowerCase().replace(/\s+/g, '-'),
      groupId
    }
    try {
      if (!channelData.name.trim()) {
        toast.error('Channel name is required')
        return
      }
      setIsCreating(true)
      const res = await createChannel(channelData)
      if (res.data.success) {
        toast.success(res.data.message)
        toggleModal('createChannelModal')
        setChannel({
          name: '',
          type: 'TEXT',
          privacy: 'PUBLIC'
        })
        router.push(`/groups/${groupId}/${res.data.channel.id}`)
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(
          error?.response?.data?.message || 'Failed to create channel'
        )
      }
      if (error?.response?.data?.error) {
        toast.error(error?.response?.data?.error || 'Failed to create channel')
      }
      if (error?.message) {
        toast.error(error?.message)
      }
    } finally {
      setIsCreating(false)
    }
  }
  return (
    <div
      className={`fixed inset-0 z-[55]  items-center justify-center ${
        modals.createChannelModal ? 'flex' : ' hidden'
      }`}
    >
      <button
        disabled={isCreating}
        className='fixed inset-0 bg-black opacity-50'
        onClick={() => toggleModal('createChannelModal')}
      />

      <div className='relative bg-white rounded-lg shadow-lg z-10 w-full max-w-md mx-auto'>
        <div className='p-6'>
          <div className='flex flex-col'>
            <div className='flex items-center justify-between text-[#444444]'>
              <h2 className='text-xl font-bold'>Create channel</h2>
              <button
                disabled={isCreating}
                className='text-divider-200 hover:text-divider-300 duration-500 transition-colors'
                onClick={() => toggleModal('createChannelModal')}
              >
                <IoClose size={24} />
              </button>
            </div>
            <p className='text-[14px]  text-[#B0B0B0]'>In public channels</p>
          </div>

          <CustomTextInput
            type='text'
            id='group-name'
            onChange={e => {
              setChannel({
                ...channel,
                name: e.target.value
              })
            }}
            value={channel.name}
            label='CHANNEL NAME'
            LeftIcon={
              <div>
                <span className=' text-xl font-bold'>#</span>
              </div>
            }
            placeholder='new-channel'
            className='py-4  text-[#444444]  font-bold'
            inputClassName=' items-center pl-4 border-2 border-[#9B9B9B] rounded-none '
          />

          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Image
                  src='/icon/padlock.svg'
                  alt='Padlock'
                  width={20}
                  height={20}
                />
                <h1 className='text-sm font-medium text-[#444444]'>
                  Private Channel
                </h1>
              </div>
              <SlideToggle setChannel={setChannel} privacy={channel.privacy} />
            </div>
            <p className='mt-1 text-xs  text-[#444444]'>
              Only selected members and roles would be able to view
            </p>
          </div>
        </div>
        <div className='flex bg-primary justify-end p-3 space-x-2'>
          <button
            disabled={isCreating}
            className='px-4 py-2 text-white  rounded-md'
            onClick={() => toggleModal('createChannelModal')}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateChannel}
            disabled={isCreating}
            className='px-4 py-2 text-primary bg-white rounded-md'
          >
            {isCreating ? 'Creating...' : 'Create Channel'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateChannelModal

const SlideToggle = ({
  privacy,
  setChannel
}: {
  privacy: 'PUBLIC' | 'PRIVATE'
  setChannel: React.Dispatch<React.SetStateAction<NewChannelBodyType>>
}) => {
  const toggle = () => {
    if (privacy === 'PUBLIC') {
      setChannel(prev => {
        return {
          ...prev,
          privacy: 'PRIVATE'
        }
      })
    } else {
      setChannel(prev => {
        return {
          ...prev,
          privacy: 'PUBLIC'
        }
      })
    }
  }

  const isOn = privacy === 'PRIVATE'
  return (
    <div onClick={toggle} className='w-10 h-5 relative cursor-pointer'>
      <div
        className={`w-full h-full rounded-full transition-colors duration-300 ${
          isOn ? 'bg-green-500' : 'bg-gray-500'
        }`}
      />

      <div
        className={`absolute top-0 left-0 h-5 w-5 flex items-center justify-center rounded-full transition-transform duration-300 transform ${
          isOn ? 'translate-x-5' : 'translate-x-0'
        }`}
      >
        <Image
          src='/icon/Ellipse.svg'
          alt='toggle'
          width={20}
          height={20}
          className='absolute inset-0'
        />
      </div>

      {isOn ? (
        <div className='absolute inset-y-0 left-0 flex items-center pl-1'>
          <IoCheckmark size={14} className='text-white' />
        </div>
      ) : (
        <div className='absolute inset-y-0 right-0 flex items-center pr-1'>
          <IoClose size={14} className='text-white' />
        </div>
      )}
    </div>
  )
}
