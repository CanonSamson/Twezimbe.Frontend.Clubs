import CustomDialog from '@/components/custom/CustomDialog'
import AuthButton from '@/components/button/AuthButton'
import { useState } from 'react'
import CustomTextarea from '@/components/input/CustomTextarea'
import { useSettingModal } from '@/contexts/modal-setting'

const items = [
  'I am no longer interested in the group',
  'The group is not for me',
  'Too many notifications',
  'There is no activity in the group',
  'I didn’t mean to join the group'
]

interface WhyAreYouLeavingModalProps {
  isOpen: boolean
  group: any
}

const Why: React.FC<WhyAreYouLeavingModalProps> = ({ isOpen, group }) => {
  const { updateModalData } = useSettingModal()

  const [checkedItem, setCheckedItem] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  const handleCheckboxChange = (item: string) => {
    setCheckedItem(prev => (prev === item ? null : item))
    if (checkedItem !== item) setReason('')
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value)
    setCheckedItem(null)
  }

  const handleSubmit = () => {
    if (checkedItem || reason) {
      updateModalData('leaveGroupModal', { step: 2 })
    } else {
      console.error('Please select a reason or fill in the text area.')
    }
  }

  return (
    <CustomDialog
      open={isOpen}
      close={() => {}}
      name='leaveGroupModal'
      contentClassName='sm:max-w-[525px] py-6 z-[55] bg-white'
    >
      <div className='text-center px-4'>
        <h4 className='text-[20px] font-inter'>Why are you leaving?</h4>
        <p className='text-[13px] mt-1 font-roboto text-[#969696]'>
          Tell us why you&apos;re leaving {group?.name}
        </p>

        <div className='mt-4 max-h-52 '>
          <div className='flex flex-col space-y-2'>
            {items.map((item, index) => (
              <div
                key={index}
                className='flex items-center w-full border border-gray-300 rounded-md p-2 bg-[#C6C6C9]/25'
              >
                <input
                  type='radio'
                  id={`checkbox-${index}`}
                  checked={checkedItem === item}
                  onChange={() => handleCheckboxChange(item)}
                  className='w-5 h-5 rounded-full border-gray-400'
                />
                <label
                  htmlFor={`checkbox-${index}`}
                  className='text-[14px] ml-2 font-inter'
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-8'>
          <CustomTextarea
            id='reason'
            placeholder='Other'
            className='w-full'
            textareaClassName='bg-divider-100 p-3 h-24 text-sm'
            value={reason}
            onChange={handleTextareaChange}
          />
        </div>

        <div className='mt-3'>
          <AuthButton
            text='Submit'
            handleClick={handleSubmit}
            className='py-2 text-sm'
          />
        </div>
      </div>
    </CustomDialog>
  )
}

export default Why
