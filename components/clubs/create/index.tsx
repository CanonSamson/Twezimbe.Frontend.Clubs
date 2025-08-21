'use client'

import { useParams, useRouter } from 'next/navigation'
import ProgressBar from './ProgressBar'
import StepFour from './steps/StepFour'
import StepOne from './steps/StepOne'
import StepThree from './steps/StepThree'
import StepTwo from './steps/StepTwo'
import { FormDataType } from '@/app/(tabs)/clubs/[groupId]/create/page'

const CreateClubForm = ({
  step,
  setStep,
  updateData,
  isExistingClub,
  data
}: {
  step: number
  setStep: (step: number) => void
  updateData: (data: FormDataType) => void
  isExistingClub: boolean
  data: FormDataType | undefined
}) => {
  const router = useRouter()
  const groupId = useParams()?.groupId as string

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step === 1) {
      router.push(`/clubs/${groupId}/create/welcome`)
      return
    }
    setStep(step - 1)
  }

  return (
    <>
      <div className='w-full py-8'>
        {/* Progress Indicators */}
        <ProgressBar step={step} />

        {step === 1 && (
          <StepOne
            handleNext={handleNext}
            handleBack={handleBack}
            updateData={updateData}
            data={data}
          />
        )}
        {step === 2 && (
          <StepTwo
            isExistingClub={isExistingClub}
            handleNext={handleNext}
            handleBack={handleBack}
            updateData={updateData}
            data={data}
          />
        )}
        {step === 3 && (
          <StepThree
            handleNext={handleNext}
            handleBack={handleBack}
            updateData={updateData}
            data={data}
          />
        )}
        {step === 4 && (
          <StepFour
            handleNext={handleNext}
            handleBack={handleBack}
            updateData={updateData}
            data={data}
          />
        )}
      </div>
    </>
  )
}

export default CreateClubForm
