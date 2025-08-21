import AuthButton from '@/components/button/AuthButton'
import Lottie from 'react-lottie'
import  confirmedAnimationData from '@/public/assets/animations/confirmed.json'

const AuthCodeVerified = ({
  handleGoHome,
  isLoading
}: {
  handleGoHome: () => void
  isLoading: boolean
}) => {


    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: confirmedAnimationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        },
        height: 150,
        width: 150
      }

  return (
    <>
      <div className='  flex flex-col items-center  justify-center'>
        <div>
          <Lottie
            options={defaultOptions}
            height={150}
            width={150}
          />
        </div>
        <h1 className='  text-xl font-semibold text-center'>
          Verification successful
        </h1>
        <p className='  text-center text-divider-300 mt-2'>
          Welcome to Twezi! You have successfully verified your email
        </p>
      </div>

      <AuthButton
        handleClick={handleGoHome}
        isLoading={isLoading}
        text='Continue'
        className=' mt-5'
      />
    </>
  )
}

export default AuthCodeVerified
