'use client'

import { updateUserConversationTopic } from '@/api/dms'
import CustomTextarea from '@/components/input/CustomTextarea'
import { refetchDm } from '@/lib/features/dms/dmSlice'
import { useAppDispatch } from '@/lib/hooks'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'

interface EditProps {
  onClose: () => void
  initialTopic?: string
  conversationId?: string
}

const Edit: React.FC<EditProps> = ({
  onClose,
  initialTopic = '',
  conversationId
}) => {
  const [topic, setTopic] = useState(initialTopic)

const  otherUserId = useParams()?.otherUserId as string

  const dispatch = useAppDispatch()
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ topic }: { topic: string }) =>
      updateUserConversationTopic({
        conversationId: conversationId!,
        topic: topic.trim()
      }),
    onSuccess: data => {
      console.log('Topic updated successfully:', data)

      dispatch(refetchDm({ otherUserId }))
      onClose()
    },
    onError: error => {
      console.error('Failed to update topic:', error)
    }
  })

  const handleSave = () => {
    if (topic.trim().length === 0) return

    mutate({ topic: topic.trim() })
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-[20px] font-bold text-[#1D1C1D]'>Edit Topic</h2>
        <button onClick={onClose} className='text-gray-500 hover:text-primary'>
          <IoCloseOutline size={30} />
        </button>
      </div>

      <div className='mb-6'>
        <CustomTextarea
          id='topic-input'
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder='Add topic'
          className='w-full rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black'
          disabled={isPending}
        />
        <p className='mt-2 text-sm text-gray-500'>
          Add a topic to your conversation with Jenny Lodie. This will be
          visible to both of you
        </p>
        {error && (
          <p className='mt-2 text-sm text-red-500'>
            Failed to update topic. Please try again.
          </p>
        )}
      </div>

      <div className='flex justify-end space-x-3'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 rounded-md text-primary bg-white border border-gray-300 hover:bg-gray-50 transition-colors'
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={handleSave}
          className='px-4 py-2 rounded-md text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50'
          disabled={topic.trim().length === 0 || isPending}
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default Edit
