import AuthButton from '@/components/button/AuthButton'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useCallback, useEffect } from 'react'

import { FormDataType } from '@/app/(tabs)/clubs/[groupId]/create/page'

interface StepOneProps {
  handleNext: () => void
  handleBack: () => void
  updateData: (data: FormDataType) => void
  data: FormDataType | undefined
}

// Security validation schema
const stepOneSchema = yup.object().shape({
  isExistingClub: yup
    .boolean()
    .required('Please select a club type')
})

const StepOne: React.FC<StepOneProps> = ({
  handleNext,
  handleBack,
  updateData,
  data
}) => {
  // Secure form submission handler
  const onSubmit = (values: { isExistingClub: boolean }) => {
    // Create secure data payload
    const secureData = {
      isExistingClub: values.isExistingClub
    }
    // Call parent handler with validated data
    updateData(secureData)
    handleNext()
  }
  
  const { values, errors, touched, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        isExistingClub: false
      },
      validationSchema: stepOneSchema,
      onSubmit,
      validateOnChange: true,
      validateOnBlur: true
    })

  // Secure radio button change handler
  const handleRadioChange = useCallback(
    (value: boolean) => {
      setFieldValue('isExistingClub', value)
    },
    [setFieldValue]
  )

  useEffect(() => {
    if (data?.isExistingClub !== undefined) {
      setFieldValue('isExistingClub', data.isExistingClub)
    }
  }, [data, setFieldValue])

  return (
    <div className='flex w-full flex-col justify-start'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          Tell us about your club
        </h1>
        <p className='text-gray-600 text-base leading-relaxed'>
          Are you creating a brand new club, or bringing an existing one to
          Twezimbe?
        </p>
      </div>

      {/* Radio Options */}
      <div className='space-y-4 mb-8'>
        {/* Option 1 - Existing Club */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.isExistingClub
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange(true)}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='isExistingClub'
                value='true'
                checked={values.isExistingClub === true}
                onChange={() => handleRadioChange(true)}
                className='sr-only'
                aria-describedby='existing-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.isExistingClub
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.isExistingClub && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>
              Yes, I have an existing club
            </span>
          </label>
          <p
            id='existing-club-desc'
            className='ml-8 text-sm text-gray-500 mt-1'
          >
            Import your existing club data and members
          </p>
        </div>

        {/* Option 2 - New Club */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            !values.isExistingClub
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange(false)}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='isExistingClub'
                value='false'
                checked={values.isExistingClub === false}
                onChange={() => handleRadioChange(false)}
                className='sr-only'
                aria-describedby='new-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  !values.isExistingClub
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {!values.isExistingClub && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>
              No, I want to create a new club
            </span>
          </label>
          <p id='new-club-desc' className='ml-8 text-sm text-gray-500 mt-1'>
            Start fresh with a brand new club
          </p>
        </div>
      </div>

      {/* Validation Error Display */}
      {touched.isExistingClub && errors.isExistingClub && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-600 text-sm'>{errors.isExistingClub}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className='space-y-4 pt-4'>
        {/* Continue Button */}
        <AuthButton
          handleClick={() => handleSubmit()}
          isLoading={false}
          text={'Continue'}
        />

        {/* Cancel Button */}
        <div className='flex justify-center'>
          <button
            type='button'
            onClick={handleBack}
            className='text-primary hover:text-primary/80 font-medium underline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepOne
