'use client'

import React from 'react'
import { IoClose } from 'react-icons/io5'
import QuickStartGuide from './_components/QuickStartGuide'
import { IoIosSearch } from 'react-icons/io'
import Image from 'next/image'
import { useAppSelector } from '@/lib/hooks'
import { useParams } from 'next/navigation'

const SetupWizardComponents = () => {
  const club = useAppSelector(state => state.club.club)
  const clubId = useParams()?.clubId as string

  const clubData = club?.[clubId]

  return (
    <div className='min-h-screen bg-[#F6F6F6]'>
      <div className=' max-w-[1300px] pb-[100px] px-2 sm:px-5 mx-auto pt-3 sm:pt-5  w-full'>
        <div className=' pt-3  flex justify-end'>
          <button className=' '>
            <IoClose className='w-[32px] h-[32px] text-gray-400' />
          </button>
        </div>
        {/* Search Bar */}
        <div className='  py-3  mt-10'>
          <div className='relative flex h-[45px]  bg-white items-center border border-gray-200 rounded-lg overflow-hidden '>
            <div className=' px-2 '>
              <IoIosSearch size={24} className='text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search'
              className=' px-1 flex-1 pr-4 py-2  focus:outline-none '
            />
          </div>
        </div>

        {/* Header Section */}
        <div className=' bg-gradient-to-br mt-10 from-[#259BED] to-[#005AA9] rounded-[8px] text-white p-6 relative overflow-hidden'>
          <div className='relative z-10'>
            <h1 className='text-2xl font-bold mb-4'>Club Setup Wizard</h1>
            <div className='grid max-w-[500px] w-full grid-cols-2 gap-4'>
              <div>
                <p className=' text-sm mb-1'>Club Name</p>
                <p className='font-semibold'>{clubData?.name}</p>
              </div>
              <div>
                <p className=' text-sm mb-1 '>Type</p>
                <p className='font-semibold'>{clubData?.clubType || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className='absolute right-0 bottom-0 '>
            <Image
              src='/assets/club/hands.svg'
              width={100}
              height={100}
              alt=''
              className=' w-auto h-[140px]'
            />
          </div>
        </div>

        {/* Progress Section */}
        <QuickStartGuide />
        {/* Skip Button */}
        <div className='mt-8 text-center flex justify-end'>
          <button className='text-gray-500 bg-white rounded-[10px] border border-gray-200 h-[50px] px-5 font-medium transition-colors hover:bg-gray-100'>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupWizardComponents
