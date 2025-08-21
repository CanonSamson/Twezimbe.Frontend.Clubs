'use client'
import CreateClubForm from '@/components/clubs/create'
import Image from 'next/image'
import { useState } from 'react'

export type FormDataType = {
  clubType?: string
  clubName?: string
  clubDescription?: string
  memberCount?: string
  isExistingClub?: boolean
  clubGoal?: string
}
const CreateClub = () => {

  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormDataType>()

  const updateData = (newData: FormDataType) => {
    setData(prevData => ({
      ...prevData,
      ...newData
    }))
  }

  return (
    <main className='min-h-screen !min-h-[100dvh] bg-gray-50 max-w-[2300px] mx-auto w-full  flex'>
      {/* Left Side - Hero Section */}
      <div className='hidden lg:flex lg:w-[45%] p-4 '>
        <div className=' flex bg-gradient-to-br w-full rounded-lg from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden'>
          {/* Background Image/Pattern */}
          <div className='absolute inset-0 bg-black/20'></div>

          {/* Dental Tools Illustration */}
          <Image
            className='absolute inset-0 object-cover opacity-30'
            src={
              step === 1
                ? '/assets/club/create-2.png'
                : '/assets/club/create-1.png'
            }
            alt='create club illustration'
            fill
          />

          <div
            className={`${
              step > 1 ? 'flex justify-center items-center mx-auto' : 'hidden'
            }`}
          >
            {/* Community Profile Section */}
            <div className='relative z-10 flex flex-col justify-center p-12 rounded-lg text-gray-900 bg-white '>
              {/* Header */}
              <div className='mb-8'>
                <p className=' text-sm uppercase tracking-wider mb-2'>
                  COMMUNITY PROFILE
                </p>
                <h2 className='text-3xl font-bold mb-6'>Your club name</h2>
              </div>

              {/* Profile Details */}
              <div className='space-y-6'>
                {/* Short Description */}
                <div>
                  <h3 className=' font-medium mb-2'>Short description</h3>
                  <p className=' text-sm'>Your description will appear here</p>
                </div>

                {/* Number of Users */}
                <div>
                  <h3 className=' font-medium mb-2'>
                    Number of existing users
                  </h3>
                  <p className='text-lg font-semibold'>0</p>
                </div>

                {/* Contact Info */}
                <div className='pt-4'>
                  <h3 className=' font-bold text-lg mb-1'>John Doe</h3>
                  <p className=' text-sm'>johndoe@example.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`relative z-10 flex flex-col justify-end p-12 text-white ${
              step === 1 ? 'block' : 'hidden'
            }`}
          >
            {/* Logo */}
            <div className='absolute top-8 left-8 flex items-center space-x-2'></div>

            <h1 className='text-4xl lg:text-5xl font-semibold mb-4'>
              Smooth operations.
              <br />
              Steady growth.
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='w-full lg:flex-1 bg-white flex max-tablet:flex-col items-center tablet:justify-center tablet:p-8 '>
        <div className='w-full  max-w-md'>
          <CreateClubForm
            step={step}
            setStep={setStep}
            updateData={updateData}
            data={data}
            isExistingClub={data?.isExistingClub || false}
          />
        </div>
      </div>
    </main>
  )
}

export default CreateClub
