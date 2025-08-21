// project import
import Image from 'next/image'
import AuthLogin from '@/sections/auth/auth-forms/AuthLogin'

const AuthSvg = '/assets/images/icons/auth.svg'

export default async function SignIn () {
  return (
    <main className=' lg:grid lg:grid-cols-2  overflow-y-auto overflow-x-hidden h-screen bg-[#F9F9F9] '>
      <div className='  flex flex-col justify-between min-h-screen px-4  '>
        <div className=' flex-1  sm:max-w-[500px] mx-auto w-full justify-center pb-10 flex flex-col'>
          <AuthLogin />
        </div>
      </div>

      <div className='  font-inter hidden lg:flex sticky  top-0 bg-primary h-screen  text-white'>
        <div className=' px-[10%] items-center justify-center flex flex-col w-full flex-1'>
          <div className='  relative h-full my-[20%]  flex flex-col items-center justify-center '>
            <div className='  relative h-full my-16  flex flex-col items-center justify-center '>
              <div className='  absolute  z-20 left-[16px] top-0  flex justify-center   h-[60px] w-[60px] bg-white items-center mx-auto rounded-full px-2'>
                <a href='https://twezimbe.com/'>
                  <Image
                    src={AuthSvg}
                    className=' flex items-center  justify-center mx-auto'
                    width={34}
                    height={34}
                    alt=''
                  />
                </a>
              </div>
              <span className=' h-full  absolute w-[1px] bg-divider-100/25 left-[46px] bottom-0  ' />
              <div className=' '>
                <div className='flex flex-col w-full'>
                  <span className=' text-[120px] leading-none  font-black'>
                    Connect.
                  </span>
                  <span className=' text-[120px] relative mt-[-20px] leading-none font-black'>
                    Grow.
                  </span>
                </div>
                <div className='pl-[200px] relative mt-5'>
                  <span className=' h-[1px]  absolute w-[134px] bg-divider-100/25 left-[46px] top-[14px]' />
                  <span className='  text-[16px]'>
                    Simplify operations, boost transparency, and empower your
                    community to thrive—seamlessly with our all-in-one community
                    fund management solution
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
