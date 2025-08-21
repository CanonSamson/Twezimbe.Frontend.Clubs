import AuthButton from '@/components/button/AuthButton'
import { useSettingModal } from '@/contexts/modal-setting'
import { FormDataType } from '@/app/(tabs)/clubs/[groupId]/create/page'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useCallback, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createClub } from '@/api/club'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useAppDispatch } from '@/lib/hooks'
import { fetchClubBasicInfo } from '@/lib/features/clubs/clubSlice'

interface StepFourProps {
  handleNext: () => void
  handleBack: () => void
  updateData: (data: FormDataType) => void
  data: FormDataType | undefined
}

// Security validation schema
const stepFourSchema = yup.object().shape({
  clubType: yup
    .string()
    .required('Please select a club type')
    .oneOf(
      [
        'professional',
        'social',
        'investment',
        'family',
        'educational',
        'other'
      ],
      'Invalid club type selected'
    )
    .trim()
})

const StepFour: React.FC<StepFourProps> = ({
  handleBack,
  updateData,
  data
}) => {
  const { openModal } = useSettingModal()
  const groupId = useParams().groupId as string

  // Secure form submission handler
  const onSubmit = async (values: { clubType: string }) => {
    // Create secure data payload with all form data
    const secureData = {
      ...data, // Include all previous step data
      clubType: values.clubType
    }
    // Call parent handler with validated data
    updateData(secureData)

    // Prepare data for API call
    const apiData = {
      clubType: values.clubType,
      clubName: data?.clubName || '',
      clubDescription: data?.clubDescription || '',
      memberCount: data?.memberCount || '', // Provide empty string as default
      isExistingClub: data?.isExistingClub || false,
      clubGoal: data?.clubGoal || '',
      groupId: groupId
    }

    createClubMutation.mutate(apiData)
  }

  const dispatch = useAppDispatch()

  const createClubMutation = useMutation({
    mutationFn: createClub,
    onSuccess: data => {
      console.log(data?.data.data, 'data?.data.data')
      openModal('clubCreatedModal', {
        club: data?.data.data
      })
      dispatch(
        fetchClubBasicInfo({
          clubId: data?.data.data?.id as string
        })
      )
    },
    onError: error => {
      console.log(error, 'error')
      toast.error(error.message || JSON.stringify(error))
    }
  })

  const { values, errors, touched, handleSubmit, setFieldValue, isValid } =
    useFormik({
      initialValues: {
        clubType: ''
      },
      validationSchema: stepFourSchema,
      onSubmit,
      validateOnChange: true,
      validateOnBlur: true
    })

  // Secure radio button change handler
  const handleRadioChange = useCallback(
    (value: string) => {
      if (
        [
          'professional',
          'social',
          'investment',
          'family',
          'educational',
          'other'
        ].includes(value)
      ) {
        setFieldValue('clubType', value)
      }
    },
    [setFieldValue]
  )

  useEffect(() => {
    if (data?.clubType) {
      setFieldValue('clubType', data.clubType)
    }
  }, [data, setFieldValue])

  return (
    <div className='flex w-full flex-col justify-start'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          What type of club is this?
        </h1>
        <p className='text-gray-500 text-sm'>
          Don&apos;t worry- you can always change this information later.
        </p>
      </div>

      {/* Radio Options */}
      <div className='space-y-3 mb-8'>
        {/* Option 1 - Professional network */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubType === 'professional'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('professional')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubType'
                value='professional'
                checked={values.clubType === 'professional'}
                onChange={() => handleRadioChange('professional')}
                className='sr-only'
                aria-describedby='professional-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubType === 'professional'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubType === 'professional' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>
              Professional network
            </span>
          </label>
        </div>

        {/* Option 2 - Social and recreational */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubType === 'social'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('social')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubType'
                value='social'
                checked={values.clubType === 'social'}
                onChange={() => handleRadioChange('social')}
                className='sr-only'
                aria-describedby='social-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubType === 'social'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubType === 'social' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>
              Social and recreational
            </span>
          </label>
        </div>

        {/* Option 3 - Investment group */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubType === 'investment'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('investment')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubType'
                value='investment'
                checked={values.clubType === 'investment'}
                onChange={() => handleRadioChange('investment')}
                className='sr-only'
                aria-describedby='investment-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubType === 'investment'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubType === 'investment' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>
              Investment group
            </span>
          </label>
        </div>

        {/* Option 4 - Family */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubType === 'family'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('family')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubType'
                value='family'
                checked={values.clubType === 'family'}
                onChange={() => handleRadioChange('family')}
                className='sr-only'
                aria-describedby='family-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubType === 'family'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubType === 'family' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>Family</span>
          </label>
        </div>

        {/* Option 5 - Educational */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubType === 'educational'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('educational')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubType'
                value='educational'
                checked={values.clubType === 'educational'}
                onChange={() => handleRadioChange('educational')}
                className='sr-only'
                aria-describedby='educational-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubType === 'educational'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubType === 'educational' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>Educational</span>
          </label>
        </div>

        {/* Option 6 - Other */}
        <div
          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
            values.clubType === 'other'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleRadioChange('other')}
        >
          <label className='flex items-center cursor-pointer'>
            <div className='relative'>
              <input
                type='radio'
                name='clubType'
                value='other'
                checked={values.clubType === 'other'}
                onChange={() => handleRadioChange('other')}
                className='sr-only'
                aria-describedby='other-club-desc'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  values.clubType === 'other'
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {values.clubType === 'other' && (
                  <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                )}
              </div>
            </div>
            <span className='ml-3 text-gray-900 font-medium'>Other</span>
          </label>
        </div>
      </div>

      {/* Validation Error Display */}
      {touched.clubType && errors.clubType && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-600 text-sm'>{errors.clubType}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className='space-y-4 pt-4'>
        {/* Continue Button */}
        <AuthButton
          handleClick={() => handleSubmit()}
          isLoading={false}
          disabled={!isValid || !values.clubType}
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

export default StepFour
