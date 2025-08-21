// project import
import AuthRegister from '@/sections/auth/auth-forms/AuthRegister'
import Image from 'next/image'

// ================================|| REGISTER ||================================ //

export default async function Register () {
  return (
    <main className=' lg:grid lg:grid-cols-2 h-screen overflow-y-auto overflow-x-hidden bg-[#F9F9F9]'>
      <div className='  font-inter hidden lg:flex sticky  top-0  h-screen p-5'>
        <div className=' bg-[#DEEAF3] flex flex-col  w-full h-full'>
          <div className=' px-10 mt-5'>
            <a href='https://twezimbe.com/'>
              <Image
                src={`/assets/images/logo/v2.svg`}
                className=' h-[80px] w-auto'
                width={100}
                height={100}
                alt='twezi logo'
              />
            </a>
          </div>

          <div className=' flex-1 items-center flex-col text-center  flex '>
            <div className=' flex flex-col  w-full px-20 min-[1400px]:max-w-[90%] mx-auto items-center'>
              <Image
                src={`/assets/images/logo/withImage.png`}
                className=' w-auto h-[45vh] object-contain'
                width={300}
                height={300}
                alt='twezi logo'
              />

              <div className=' min-[1400px]:px-10'>
                <h2 className=' text-3xl font-semibold'>
                  streamline operations and empower your community
                </h2>
                <h3 className=' xl:text-xl text-divider-200 mt-5'>
                  Transform how you manage your group with Twezi. From
                  seamless contribution tracking to efficient loan processing,
                  our platform is designed to enhance transparency, build trust,
                  and empower your community
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='  flex flex-col justify-between min-h-screen px-4  '>
        <div className=' flex-1  sm:max-w-[500px] mx-auto w-full justify-center flex flex-col'>
          <AuthRegister />
        </div>
      </div>
    </main>
  )
}
