'use client'

import { useMutation } from '@tanstack/react-query'
import { resendSignupOtp, validateSignupOtp } from '@/api/signup'
// types
import AuthButton from '@/components/button/AuthButton'
import { InputOTPControlled } from '@/components/input/InputOTPControlled'
import { useFormik } from 'formik'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { maskEmail } from '@/utils/functions/user/maskEmail'
import * as yup from 'yup'
import { useUser } from '@/contexts/user'
import AuthCodeVerified from './AuthCodeVerified'

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = () => {
  const isLoggingOut = false

  const [feedback, setFeedback] = useState<string | null>(null)
  const [isGoingHome, setIsGoingHome] = useState(false)
  const [verified, setVerified] = useState(false)
  const router = useRouter()

  const { fetchCurrentUser, logout, currentUser } = useUser({})
  const handleLogout = async () => {
    logout()
    router.replace('/login')
  }

  const { mutate, isPending } = useMutation({
    mutationFn: validateSignupOtp,
    onError: (error: any) => {
      console.log(error)
      setFeedback(error.message)
      toast.error(error.message)
    },
    onSuccess: async data => {
      const response = data.data

      console.log(response, 'response')
      if (response.success) {
        setVerified(true)
      }
    }
  })
  const { mutate: resendOtp, isPending: resendIsPending } = useMutation({
    mutationFn: resendSignupOtp,
    onError: (error: any) => {
      console.log(error)
      setFeedback(error.message)
      toast.error(error.message)
    },
    onSuccess: async data => {
      const response = data.data
      console.log(response, 'response')
      if (response.success) {
        toast.success(response.message)
      }
    }
  })
  const handleResendOtp = async () => {
    resendOtp({
      email: currentUser?.profile.email || ''
    })
  }

  const onSubmit = () => {
    mutate({
      otp: values.otp,
      email: currentUser?.profile.email || '',
      userId: currentUser?.id || ''
    })
  }

  const emailOtpSchema = yup.object().shape({
    otp: yup
      .string()
      .length(6, 'OTP must be 6 characters')
      .required('OTP is required')
  })

  const { errors, touched, values, setFieldValue } = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: emailOtpSchema,
    onSubmit
  })

  const verify = () => {
    if (touched.otp && Object.values(errors)[0]) {
      toast.error(Object.values(errors)[0])
    }
  }
  console.log(feedback)

  const handleGoHome = async () => {
    try {
      setIsGoingHome(true)
      await fetchCurrentUser({ load: false })

      router.replace('/register/complete-profile')
    } finally {
      setIsGoingHome(false)
    }
  }

  return (
    <>
      <main className=' sm:bg-primary z-40 pt-5 min-h-screen flex justify-center items-center flex-col'>
        <div className=' sm:hidden'>
          <Image
            src={`/assets/images/logo/v1.svg`}
            className=' h-[50px] w-auto'
            width={40}
            height={40}
            alt='twezi logo'
          />
        </div>
        <div className=' hidden md:flex flex-1  ' />
        <div className=' justify-center   shadow-md flex flex-col font-inter px-4 sm:max-w-[450px] mx-auto w-full bg-white rounded-[10px] rounded-bl-none  flex-1 md:justify-center '>
          {verified ? (
            <AuthCodeVerified
              handleGoHome={() => handleGoHome()}
              isLoading={isGoingHome}
            />
          ) : (
            <>
              <div className='  flex flex-col items-center  justify-center'>
                <h1 className='  text-xl font-semibold text-center'>
                  Verify your email
                </h1>
                <p className='  text-center text-divider-300 mt-2'>
                  Please enter the code that was just sent to your email{' '}
                  <strong className=' text-primary'>
                    {currentUser?.profile?.email &&
                      maskEmail(
                        {
                          email: currentUser?.profile?.email,
                          role: currentUser.role[0]
                        },
                        {
                          email: currentUser?.profile.email,
                          role: currentUser.role[0]
                        }
                      )}
                  </strong>{' '}
                </p>
              </div>
              <div className=' flex justify-center  mt-5 text-black'>
                <InputOTPControlled
                  value={values.otp}
                  setValue={otp => {
                    console.log(otp)
                    setFieldValue('otp', otp)
                  }}
                />
              </div>
              <div className=' text-center justify-center items-center mt-10'>
                <span className=' cursor-default text-divider-300'>
                  {'Didn’t'} see the code?{' '}
                  <button
                    disabled={resendIsPending || isPending}
                    onClick={handleResendOtp}
                  >
                    <span className='text-primary font-semibold'>
                      {resendIsPending ? 'Resending Code' : 'Resend Code'}
                    </span>
                  </button>
                </span>
              </div>
              <AuthButton
                handleClick={() => {
                  verify()
                  onSubmit()
                }}
                isLoading={isPending}
                disabled={resendIsPending || isPending}
                text='Verify'
                className=' mt-5'
              />
            </>
          )}
        </div>

        <div className=' text-center flex-1 justify-center items-center mt-10'>
          <span
            className={` cursor-default text-divider-300 ${
              verified ? ' hidden' : ' block '
            }`}
          >
            <div className='text-primary sm:text-white'>
              <span>
                Having Issues?{' '}
                <button
                  onClick={() => handleLogout()}
                  disabled={isLoggingOut}
                  className='ont-semibold underline'
                >
                  Log Out
                </button>{' '}
                or{' '}
                <button
                  onClick={() => handleLogout()}
                  disabled={isLoggingOut}
                  className='ont-semibold underline'
                >
                  Update Email
                </button>{' '}
              </span>
            </div>
          </span>
        </div>
      </main>
    </>
  )
}

export default AuthCodeVerification
