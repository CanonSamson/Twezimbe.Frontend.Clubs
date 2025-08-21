import React, { useState } from 'react'
import {
  FiUpload,
  FiFileText,
  FiUserPlus,
  FiSettings,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { LuBadgeCheck } from 'react-icons/lu'

interface SetupTask {
  id: number
  icon: IconType
  title: string
  description: string
  buttonText: string
  isCompleted?: boolean
  handleClick?: () => void
  count?: number
}

const QuickStartGuide = () => {
  const [tasks] = useState<SetupTask[]>([
    {
      id: 1,
      title: 'Club Created',
      description: 'You have successfully created a club on Twezi',
      icon: LuBadgeCheck,
      isCompleted: true,
      buttonText: 'Done'
    },
    {
      id: 2,
      title: 'Upload your club logo',
      description: 'Add a visual identity to your club',
      icon: FiUpload,
      isCompleted: false,
      buttonText: 'Upload'
    },
    {
      id: 3,
      title: 'Setup Club Rules',
      description: 'Define guidelines for your community',
      icon: FiFileText,
      isCompleted: false,
      buttonText: 'Setup'
    },
    {
      id: 4,
      title: 'Setup Membership & KYC Rules',
      description: 'Set membership plans and verification',
      icon: FiFileText,
      isCompleted: false,
      buttonText: 'Setup'
    },
    {
      id: 5,
      title: 'Invite Members',
      description:
        'Invite members to collaborate, contribute, and engage in your new club.',
      icon: FiUserPlus,
      isCompleted: false,
      buttonText: 'Setup'
    },
    {
      id: 6,
      title: 'Setup Officers Roles',
      description: 'Setup leadership structure.',
      icon: FiSettings,
      isCompleted: false,
      buttonText: 'Setup'
    }
  ])

  const completedTasks = tasks.filter(task => task.isCompleted).length
  const totalTasks = tasks.length

  return (
    <>
      {/* Progress Section */}
      <div className='  py-4 '>
        <h2 className='text-lg font-semibold text-gray-800 mb-2'>
          Setup progress
        </h2>
        <div className='flex items-center space-x-3'>
          <span className='text-2xl font-bold text-[#E88026]'>
            {completedTasks}
          </span>
          <span className='text-gray-600'>of {totalTasks} tasks completed</span>
        </div>

        {/* Progress Bar */}
        <div className='mt-3 w-full bg-gray-200 rounded-full h-3'>
          <div
            className='bg-[#E88026] h-3 rounded-full transition-all duration-300'
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className=' mt-4'>
        <div className=' w-full '>
          <div className='bg-white  p-2 tablet-lg:p-5 rounded-[14px] '>
            <div className='flex items-center justify-between tablet-lg:mb-5 mb-4'>
              <span className='text-sm tablet-lg:text-lg font-medium'>
                Quick Start Guide
              </span>
            
            </div>

            <div className='space-y-4'>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`flex justify-between items-center ${
                    task.isCompleted ? 'border border-[#108A00]' : ''
                  }  p-4 rounded-[14px]`}
                  onClick={() => task.handleClick?.()}
                  role={task.id === 2 ? 'button' : undefined}
                >
                  <div className='flex flex-1 items-center gap-4'>
                    <div className=' bg-[#F6F6F6] p-2 rounded-full'>
                        <task.icon
                      size={24}
                      className={task.isCompleted ? 'text-[#108A00]' : ''}
                    />
                    </div>
                    <div>
                      <span className='block text-[12px] tablet-lg:text-sm font-medium'>
                        {task.title}
                      </span>
                      <span className='block text-[10px] tablet-lg:text-sm font-light'>
                        {task.description}
                      </span>
                    </div>
                  </div>
                  <div className=' flex items-center gap-2'>
                    {!task.isCompleted && task?.count && task?.count >= 1 ? (
                      <span className='text-[#108A00] border border-white px-2 py-1 rounded-full text-xs'>
                        {task.count}
                      </span>
                    ) : null}
                    <button
                      className={`${
                        task.isCompleted
                          ? 'bg-[#108A00] text-white'
                          : 'bg-white border '
                      } px-5 py-2 rounded-[10px] text-[10px] tablet-lg:text-sm`}
                    >
                      {task.isCompleted ? 'Done' : task.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuickStartGuide
