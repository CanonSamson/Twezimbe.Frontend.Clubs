'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const WelcomePage = () => {
  const groupId = useParams().groupId as string
  return (
    <main className='min-h-screen !min-h-[100dvh] max-w-[2300px] mx-auto w-full  flex'>
      {/* Left Side - Hero Section */}
      <div className='hidden lg:flex lg:w-[45%] p-8'>
        <div className='flex flex-col justify-center w-full bg-gradient-to-br p-12 relative overflow-hidden'>
          <div className='space-y-6'>
            <h1 className='text-5xl font-bold text-black leading-tight'>
              Automate
              <br />
              your club and
              <br />
              Grow your
              <br />
              results.
            </h1>
            <p className='text-gray-600 text-lg leading-relaxed max-w-md'>
              Easily collect subscriptions, manage members, and keep your club
              running without the usual headaches
            </p>
            <Link href={`/clubs/${groupId}/create`} className=' mt-10 flex'>
              <button  className='bg-primary text-white font-medium px-8 py-3 rounded-[16px] transition-colors duration-200 inline-block w-fit'>
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='w-full relative items-center lg:flex-1 flex max-tablet:flex-col tablet:justify-center  '>
        <div className='w-full h-full  flex justify-end items-center  '>
          <Image
            src={`/assets/club/welcome.png`}
            width={6000}
            height={10000}
            alt='welcome image '
            className=' max-h-screen py-4 object-contain object-right w-full'
          />
        </div>
      </div>
    </main>
  )
}

export default WelcomePage
