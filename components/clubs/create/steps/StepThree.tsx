import AuthButton from '@/components/button/AuthButton'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useCallback, useEffect } from 'react'
import { FormDataType } from '@/app/(tabs)/clubs/[groupId]/create/page'

interface StepThreeProps {
  handleNext: () => void
  handleBack: () => void
  updateData: (data: FormDataType) => void
  data: FormDataType | undefined
}

// Security validation schema
const stepThreeSchema = yup.object().shape({
  clubGoal: yup
    .string()
    .required('Please select a club goal')
    .oneOf(
      ['manage', 'formalize', 'admin', 'grow', 'other'],
      'Invalid club goal selected'
    )
    .trim()
})

const StepThree: React.FC<StepThreeProps> = ({
  handleNext,
  handleBack,
  updateData,
  data
}) => {
  // Secure form submission handler
  const handleSecureSubmit = useCallback(
    async (values: { clubGoal: string }) => {
      // Create secure data payload
      const secureData = {
        clubGoal: values.clubGoal
      }
      // Call parent handler with validated data
      updateData(secureData)
      handleNext()
    },
    [handleNext, updateData]
  )

  const { values, errors, touched, handleSubmit, setFieldValue, isValid } =
    useFormik({
      initialValues: {
        clubGoal: ''
      },
      validationSchema: stepThreeSchema,
      onSubmit: handleSecureSubmit,
      validateOnChange: true,
      validateOnBlur: true
    })

  // Secure radio button change handler
  const handleRadioChange = useCallback(
    (value: string) => {
      if (['manage', 'formalize', 'admin', 'grow', 'other'].includes(value)) {
        setFieldValue('clubGoal', value)
      }
    },
    [setFieldValue]
  )

  useEffect(() => {
    if (data?.clubGoal) {
      setFieldValue('clubGoal', data.clubGoal)
    }
  }, [data, setFieldValue])

  return (
    <div className='flex w-full flex-col justify-start'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          What&apos;s your club&apos;s goal?
        </h1>
        <p className='text-gray-500 text-sm'>
          Don&apos;t worry- you can always change this information later.
        </p>
      </div>

      {/* Radio Options */}
      <div className='space-y-3 mb-8'>
        {/* Option 1 - Manage my club */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubGoal === 'manage'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('manage')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubGoal'
                value='manage'
                checked={values.clubGoal === 'manage'}
                onChange={() => handleRadioChange('manage')}
                className='sr-only'
                aria-describedby='manage-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubGoal === 'manage'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubGoal === 'manage' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>
              Manage my club
            </span>
          </label>
        </div>

        {/* Option 2 - Formalize activities */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubGoal === 'formalize'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('formalize')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubGoal'
                value='formalize'
                checked={values.clubGoal === 'formalize'}
                onChange={() => handleRadioChange('formalize')}
                className='sr-only'
                aria-describedby='formalize-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubGoal === 'formalize'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubGoal === 'formalize' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>
              Formalize activities
            </span>
          </label>
        </div>

        {/* Option 3 - Manage admin */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubGoal === 'admin'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('admin')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubGoal'
                value='admin'
                checked={values.clubGoal === 'admin'}
                onChange={() => handleRadioChange('admin')}
                className='sr-only'
                aria-describedby='admin-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubGoal === 'admin'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubGoal === 'admin' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>Manage admin</span>
          </label>
        </div>

        {/* Option 4 - Grow my club */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubGoal === 'grow'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('grow')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubGoal'
                value='grow'
                checked={values.clubGoal === 'grow'}
                onChange={() => handleRadioChange('grow')}
                className='sr-only'
                aria-describedby='grow-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubGoal === 'grow'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubGoal === 'grow' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>Grow my club</span>
          </label>
        </div>

        {/* Option 5 - Other */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubGoal === 'other'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('other')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubGoal'
                value='other'
                checked={values.clubGoal === 'other'}
                onChange={() => handleRadioChange('other')}
                className='sr-only'
                aria-describedby='other-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubGoal === 'other'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubGoal === 'other' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>Other</span>
          </label>
        </div>
      </div>

      {/* Validation Error Display */}
      {touched.clubGoal && errors.clubGoal && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-600 text-sm'>{errors.clubGoal}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className='space-y-4 pt-4'>
        {/* Continue Button */}
        <AuthButton
          handleClick={() => handleSubmit()}
          isLoading={false}
          disabled={!isValid || !values.clubGoal}
          text='Continue'
        />

        {/* Go Back Button */}
        <div className='flex justify-center'>
          <button
            type='button'
            onClick={handleBack}
            className='text-primary hover:text-primary/80 font-medium underline transition-colors duration-200'
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepThree
