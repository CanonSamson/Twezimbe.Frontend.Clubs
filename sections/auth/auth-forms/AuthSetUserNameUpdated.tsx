import AuthButton from '@/components/button/AuthButton'
import confirmedAnimationData from '@/public/assets/animations/confirmed.json'
import Lottie from 'react-lottie'

const AuthSetUserNameUpdated = ({
  handleGoHome,
  isLoading,
  userName
}: {
  userName: string
  handleGoHome: () => void
  isLoading: boolean
}) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: confirmedAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  return (
    <>
      <div className='  flex flex-col items-center  justify-center'>
        <div>
          <Lottie options={defaultOptions} height={150} width={150} />
        </div>
        <h1 className='  text-xl font-semibold text-center'>Awesome!</h1>
        <p className='  text-center text-divider-300 mt-2'>
          Welcome @{userName}
        </p>
      </div>
      <AuthButton
        handleClick={handleGoHome}
        isLoading={isLoading}
        disabled={isLoading}
        text='Finish'
        className=' mt-5'
      />
    </>
  )
}

export default AuthSetUserNameUpdated
