'use client'

import { IoClose } from 'react-icons/io5'
import React, { useRef, useState } from 'react'

const Activate: React.FC<{
  next: () => void
  handleToggleModal: () => void
}> = ({ next, handleToggleModal }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [code, setCode] = useState<string[]>(Array(5).fill(''))

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value

    if (!/^[0-9a-zA-Z]{0,1}$/.test(value)) return

    const updatedCode = [...code]
    updatedCode[index] = value
    setCode(updatedCode)

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const isCodeComplete = code.every(char => char.trim() !== '')

  return (
    <>
      <div className='p-4'>
        <div className='flex justify-end items-center mb-4'>
          <button
            className='text-divider-200 hover:text-divider-300 duration-500 transition-colors'
            onClick={handleToggleModal}
          >
            <IoClose size={34} />
          </button>
        </div>

        <div className='text-center'>
          <h4 className='text-xl font-semibold'>Activate wallet</h4>
          <p className='text-[13px] mt-2 text-[#969696]'>
            To activate your global personal wallet, kindly input the code sent
            to your registered email address
          </p>

          <div className='flex flex-col items-center gap-3 mt-8'>
            <div className='flex gap-2'>
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  type='password'
                  maxLength={1}
                  ref={el => {
                    inputRefs.current[i] = el
                  }}
                  value={code[i]}
                  onChange={e => handleInputChange(e, i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  className='w-10 h-12 text-center border border-gray-300 text-lg focus:outline-none focus:ring-2 bg-divider-100'
                />
              ))}
            </div>
          </div>

          <p className='text-[#969696] mt-6 text-[13px]'>
            Didn&apos;t see the code?{' '}
            <span className='text-primary font-bold'>Resend Code</span>
          </p>
        </div>
      </div>

      <div className='flex bg-white p-3 gap-3 justify-end'>
        <button
          className='px-4 py-2 bg-white border border-gray-700 text-primary rounded-md'
          onClick={next}
        >
          Cancel
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            isCodeComplete
              ? 'bg-primary text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          onClick={next}
          disabled={!isCodeComplete}
        >
          Activate
        </button>
      </div>
    </>
  )
}

export default Activate
