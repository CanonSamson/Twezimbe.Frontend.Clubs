import AuthButton from '@/components/button/AuthButton'
import CustomTextInput from '@/components/input/CustomTextInput'
import CustomTextarea from '@/components/input/CustomTextarea'
import CustomSelect from '@/components/input/CustomSelect'
import { FormDataType } from '@/app/(tabs)/clubs/[groupId]/create/page'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useCallback, useEffect } from 'react'

interface StepTwoProps {
  isExistingClub: boolean
  handleNext: () => void
  handleBack: () => void
  updateData: (data: FormDataType) => void
  data: FormDataType | undefined
}

// Security validation schema
const stepTwoSchema = yup.object().shape({
  clubName: yup
    .string()
    .required('Club name is required')
    .min(2, 'Club name must be at least 2 characters')
    .max(100, 'Club name must be less than 100 characters')
    .matches(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Club name can only contain letters, numbers, spaces, hyphens, and underscores'
    )
    .trim(),
  clubDescription: yup
    .string()
    .required('Club description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  memberCount: yup
    .string()
    .optional()
    .when('$isExistingClub', {
      is: true,
      then: schema => schema.required('Please select member count range'),
      otherwise: schema => schema.notRequired()
    })
    .oneOf(
      ['1-10', '11-50', '51-100', '100+', ''],
      'Invalid member count range selected'
    ),
  clubType: yup.string().trim()
})

const StepTwo: React.FC<StepTwoProps> = ({
  handleNext,
  handleBack,
  updateData,
  data
}) => {
  // Secure form submission handler
  const handleSecureSubmit = useCallback(
    async (values: {
      clubName: string
      clubDescription: string
      memberCount: string
      clubType: string
    }) => {
      // Create secure data payload
      const secureData = {
        clubName: values.clubName.trim(),
        clubDescription: values.clubDescription.trim(),
        memberCount: values.memberCount,
        clubType: values.clubType.trim()
      }
      // Call parent handler with validated data
      updateData(secureData)
      handleNext()
    },
    [handleNext, updateData]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    isValid
  } = useFormik({
    initialValues: {
      clubName: '',
      clubDescription: '',
      memberCount: '',
      clubType: ''
    },
    validationSchema: stepTwoSchema,
    onSubmit: handleSecureSubmit,
    validateOnChange: true,
    validateOnBlur: true
  })

  // Secure select change handler
  const handleSelectChange = useCallback(
    (value: string) => {
      if (['1-10', '11-50', '51-100', '100+'].includes(value)) {
        setFieldValue('memberCount', value)
      }
    },
    [setFieldValue]
  )

  useEffect(() => {
    if (data) {
      setFieldValue('clubName', data.clubName || '')
      setFieldValue('clubDescription', data.clubDescription || '')
      setFieldValue('memberCount', data.memberCount || '')
      setFieldValue('clubType', data.clubType || '')
    }
  }, [data, setFieldValue])

  return (
    <div className='flex w-full flex-col justify-start space-y-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Your club belongs here — let&apos;s set it up
        </h1>
      </div>

      {/* Club Name Field */}
      <div>
        <CustomTextInput
          type='text'
          id='clubName'
          onChange={handleChange}
          value={values.clubName}
          error={
            touched.clubName && errors.clubName ? errors.clubName : undefined
          }
          label='Club name'
          placeholder='e.g. Unity Circle, Friends Investment Group'
          className='mt-5'
        />
        <p className='text-sm text-gray-500 mt-1'>
          Keep it simple and clear. Avoid symbols or emojis.
        </p>
      </div>

      {/* Club Description Field */}
      <div>
        <CustomTextarea
          id='clubDescription'
          onChange={handleChange}
          value={values.clubDescription}
          error={
            touched.clubDescription && errors.clubDescription
              ? errors.clubDescription
              : undefined
          }
          label='Club description'
          placeholder='Tell us about your club'
          className='mt-5'
        />
        <p className='text-sm text-gray-500 mt-1'>
          A brief description of your club.
        </p>
      </div>

      {/* Member Count Field */}

      {data?.isExistingClub && (
        <div className='space-y-2'>
          <CustomSelect
            options={[
              { value: '1-10', label: '1-10 members' },
              { value: '11-50', label: '11-50 members' },
              { value: '51-100', label: '51-100 members' },
              { value: '100+', label: '100+ members' }
            ]}
            onChange={handleSelectChange}
            value={values.memberCount || ''}
            error={
              touched.memberCount && errors.memberCount
                ? errors.memberCount
                : undefined
            }
            label='Number of existing members'
            placeholder='Select range'
            selectTriggerClassName='border-gray-300 rounded-lg'
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className='space-y-4 pt-4'>
        {/* Continue Button */}
        <AuthButton
          handleClick={() => handleSubmit()}
          isLoading={false}
          disabled={
            !isValid ||
            !values.clubName ||
            !values.clubDescription ||
            (!values.memberCount && data?.isExistingClub)
          }
          type='submit'
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

export default StepTwo
