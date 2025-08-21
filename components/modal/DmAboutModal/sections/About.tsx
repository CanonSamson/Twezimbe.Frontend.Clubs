'use client'

import { UserProfileResponse } from '@/api/user'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { CiClock2 } from 'react-icons/ci'
import { useState, useEffect } from 'react'
import moment from 'moment'

interface AboutProps {
  openEditModal: () => void
  user: undefined | UserProfileResponse['data']['user']
  topic: string | undefined
}

const About: React.FC<AboutProps> = ({ user, topic, openEditModal }) => {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const timeString = moment().format('h:mm A')
      setCurrentTime(`${timeString} local time`)
    }

    // Update time immediately
    updateTime()

    // Update time every minute
    const interval = setInterval(updateTime, 60000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className='max-h-[40vh] w-full overflow-y-auto p-4'>
        <div className='border border-gray-700 rounded-md p-4 mb-4'>
          <div className='flex items-center justify-between'>
            <h1 className='font-inter text-black'>Topic</h1>
            <span
              className='font-inter text-primary cursor-pointer'
              onClick={openEditModal}
            >
              Edit
            </span>
          </div>
          <p className='text-gray-500 text-sm mt-2'>
            {topic ? topic : 'Add topic'}
          </p>
        </div>
        <div className='border border-gray-700 rounded-md p-4 mb-4'>
          <h1 className='font-inter text-gray-500 mb-2'>
            {user?.groups?.length} groups in common
          </h1>

          <div className='flex flex-col gap-2 ml-4'>
            {user?.groups?.map((group, index) => (
              <div
                key={index}
                className='flex items-center gap-2 cursor-pointer'
              >
                <CustomAvatar
                  image={user?.profileImage}
                  className='justify-start'
                  imageClassName='h-[20px] w-[20px] overflow-hidden rounded-full border object-top text-[32px] font-bold text-primary'
                  labelClassName='flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full'
                  alt='profile image'
                  showText={false}
                  disabled={true}
                  iconClassName='size-[28px]'
                  isCurrentUser={false}
                  userFullName={`${group?.name}`}
                />
                <span className='font-inter text-black'>{group.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='border border-gray-700 rounded-md p-4 mb-4'>
          <div className='flex items-center gap-x-2 text-black text-md'>
            <CiClock2 size={24} />
            <span className='font-inter'>{currentTime}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
