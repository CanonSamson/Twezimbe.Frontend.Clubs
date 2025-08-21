'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
// types
import AuthButton from '@/components/button/AuthButton'
import { useFormik } from 'formik'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as yup from 'yup'
import { getSuggectedUserName, updateUserName } from '@/api/user'
import CustomTextInput from '@/components/input/CustomTextInput'
import { APP_DEFAULT_PATH } from '@/config'
import { UserContext, UserContextType } from '@/contexts/user'
import AuthSetUserNameUpdated from './AuthSetUserNameUpdated'
import { useContextSelector } from 'use-context-selector'

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const userNameSchema = yup.object().shape({
  userName: yup
    .string()
    .required('Username is required')
    .transform(value => value.replace(/^@+/, '')) // Remove leading @ symbols
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    )
    .matches(/^(?![0-9])/, 'Username cannot start with a number')
    .lowercase('Username must be lowercase')
})

const AuthSetUserName = () => {
  const isLoggingOut = false
  const [isGoingHome, setIsGoingHome] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [invitationId, setInvitationId] = useState<undefined | string>('')
  const router = useRouter()
  const fetchCurrentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.fetchCurrentUser
  )
  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  )
  const logout = useContextSelector(
    UserContext,
    (state: UserContextType) => state.logout
  )
  const setAllowRedirect = useContextSelector(
    UserContext,
    (state: UserContextType) => state.setAllowRedirect
  )

  const handleLogout = async () => {
    logout()
  }

  const { data, isLoading: isLoadingNames } = useQuery({
    queryKey: ['getSuggectedUserName', currentUser?.profile?.email],
    queryFn: () => getSuggectedUserName(currentUser?.profile.email || ''),
    enabled: !!currentUser?.profile?.email,
    refetchOnWindowFocus: false
  })

  const { mutate: updateUser, isPending } = useMutation({
    mutationKey: ['updateUserName'],
    mutationFn: updateUserName,
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
    },
    onSuccess: async data => {
      const response = data.data
      const inviteId = data?.data?.updatedProfile?.inviteId
      if (inviteId) {
        setInvitationId(inviteId)
      }
      console.log(response, 'response')
      if (response) setUpdated(true)
    }
  })

  const onSubmit = () => {
    // Strip any leading @ before submitting
    const cleanUsername = values.userName.replace(/^@+/, '')
    updateUser({
      userName: cleanUsername
    })
  }

  const { errors, touched, values, setFieldValue, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        userName: ''
      },
      validationSchema: userNameSchema,
      onSubmit
    })

  const verify = () => {
    if (touched.userName && Object.values(errors)[0]) {
      toast.error(Object.values(errors)[0])
    }
  }

  const handleGoHome = async () => {
    try {
      setIsGoingHome(true)
      await fetchCurrentUser({ load: false })

      if (invitationId) {
        router.replace(`/g/${invitationId}`)
        toast.success('Welcome to the app!')

        return
      }
      toast.success('Welcome to the app!')
      router.replace(APP_DEFAULT_PATH)
    } finally {
      setIsGoingHome(false)
      setAllowRedirect(true)
    }
  }
  useEffect(() => {
    if (invitationId) {
      setAllowRedirect(false)
    }
  }, [invitationId])

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
          {updated ? (
            <>
              <AuthSetUserNameUpdated
                handleGoHome={handleGoHome}
                isLoading={isGoingHome}
                userName={values.userName}
              />
            </>
          ) : (
            <>
              <div className='  flex flex-col items-center  justify-center'>
                <h1 className='  text-xl font-semibold text-center'>
                  Select a username
                </h1>
                <p className='  text-center text-divider-300 mt-2'>
                  Choose one of the suggestions or create your own.
                </p>
                <div className='flex w-full justify-center mt-5 items-center gap-2 '>
                  {!data?.data || isLoadingNames ? (
                    <>
                      {['testing', 'testing', 'testing'].map((name, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex-1 flex items-center justify-center py-2 px-2 rounded-[5px] text-[11px] bg-divider-100 text-divider-100`}
                          >
                            <span className='text-[11px]'>{name}</span>
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <>
                      {data?.data?.map((name, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => setFieldValue('userName', name)}
                            className={` flex items-center justify-center py-2 px-2 rounded-[5px] text-[11px] cursor-pointer ${
                              values.userName === name
                                ? 'border-primary border text-primary'
                                : 'bg-divider-100 text-divider-300'
                            }`}
                          >
                            <span className='text-[11px]'>{name}</span>
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
              <div className=' w-full'>
                <CustomTextInput
                  type='text'
                  id='userName'
                  onChange={handleChange}
                  value={values.userName.replace(/^@+/, '')}
                  error={touched.userName ? errors?.userName : undefined}
                  label='Enter a custom username'
                  placeholder='username'
                  className='mt-4'
                />
              </div>

              <AuthButton
                handleClick={() => {
                  verify()
                  handleSubmit()
                }}
                isLoading={isPending}
                disabled={isPending}
                text='Confirm'
                className=' mt-5'
              />
            </>
          )}
        </div>

        <div className=' text-center flex-1 justify-center items-center mt-10'>
          <span
            className={` cursor-default text-divider-300 ${
              updated ? ' hidden' : ' block '
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
                </button>
              </span>
            </div>
          </span>
        </div>
      </main>
    </>
  )
}

export default AuthSetUserName
