'use client'

import { formatAmount } from '@/utils/functions/formatAmount'
import React from 'react'

interface CustomBfCurrencyInputProps {
  label?: string
  placeholder: string
  value: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined
  type: React.HTMLInputTypeAttribute | undefined
  className?: string
  inputClassName?: string
  error?: string | undefined | false
  id: string
  currency?: string
  disabled?:boolean
  inputMode?: "search" | "email" | "tel" | "text" | "url" | "none" | "numeric" | "decimal" | undefined
  pattern?: string
  allowNegative?: boolean
}

const CustomBfCurrencyInput: React.FC<CustomBfCurrencyInputProps> = ({
  id,
  type,
  label,
  placeholder,
  currency = 'UGX',
  value,
  error,
  onChange,
  onKeyDown,
  className,
  inputClassName,
  disabled,
  inputMode = undefined,
  pattern= undefined,
  allowNegative = false

}) => {
 

  const [displayValue, setDisplayValue] = React.useState(
    formatAmount(value?.toString() || '', allowNegative)
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const inputValue = e.target.value
      const formattedValue = formatAmount(inputValue, allowNegative)
      const numericValue = inputValue.replace(/,/g, '')

      setDisplayValue(formattedValue)

      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericValue
        }
      }

      onChange(newEvent as React.ChangeEvent<HTMLInputElement>)
    }
  }

  React.useEffect(() => {
    setDisplayValue(formatAmount(value?.toString() || '', allowNegative))
  }, [value, allowNegative])

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label>{label}</label>}
      <div
        className={`flex border rounded-[10px] border-divider mt-[2px] overflow-hidden relative ${inputClassName}`}
      >
        <div className=' bg-[#F2F2F2] items-center justify-center flex text-center m-[1px] rounded-l'>
          <span className=' px-2'>{currency}</span>
        </div>
        <input
          id={id}
          className=' px-4 flex flex-1 w-full h-[50px] focus:outline-none bg-transparent '
          type={type}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          inputMode={inputMode}
          pattern={pattern}
        />
      </div>
      {error && <p className=' text-negative mt-2 capitalize'>{error}</p>}
    </div>
  )
}

export default CustomBfCurrencyInput
