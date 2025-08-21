import * as React from 'react'

interface CustomNativeCustomSelectProps {
  label?: string
  placeholder?: string
  value: string
  onChange?: (value: string) => void // Updated type to directly handle string value
  className?: string
  error?: string | undefined | false
  options: { value: string; label: string }[]
  optionPlaceHolder?: string
  selectTriggerClassName?: string
  showStar?: boolean
  disabled?: boolean
}

const NativeCustomSelect: React.FC<CustomNativeCustomSelectProps> = ({
  placeholder,
  error,
  className,
  label,
  options,
  selectTriggerClassName,
  disabled = false,
  onChange,
  value,
  showStar
}) => {
  return (
    <div className={`flex flex-col relative ${className}`}>
      {label && (
        <label>
          {label} <span className=' text-red-600'>{showStar && '*'}</span>
        </label>
      )}
      <div className={`relative  rounded-[10px] overflow-hidden border border-gray-300  ${selectTriggerClassName}`} >
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`w-full ${selectTriggerClassName} p-2   bg-transparent focus:outline-none focus:ring-2 h-[50px]  rounded-[5px] focus:ring-primary`}
        >
          <option value="">{placeholder || 'Select'}</option>
          {options.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className='text-negative mt-2 capitalize'>{error}</p>}
    </div>
  )
}

export default NativeCustomSelect
