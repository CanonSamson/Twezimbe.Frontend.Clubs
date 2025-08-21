'use client'
import React from 'react'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useUser } from '@/contexts/user'

const HomeHeader = () => {
  const { currentUser } = useUser({})

  return (
    <>
      <div className='px-10'>
        <div className='w-full h-full p-5 bg-white   rounded-lg mt-[30px]'>
          <div className='w-full inline-flex justify-between items-center'>
            <div>
              <p className='text-[12px] capitalize'>
                Hello, {currentUser?.profile.firstName}{' '}
                {currentUser?.profile.lastName}!
              </p>
              <p className='text-[20px]'>How are you today ?</p>
            </div>
            <button
              className='flex items-center relative justify-center px-[12px] text-white rounded-[12px] bg-primary h-[40px] '
              onClick={() => {}}
            >
              <span className='w-[5px] h-[5px] bg-secondary rounded-full absolute left-2 top-2' />
              <IoNotificationsOutline size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default HomeHeader
