'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface CustomTextareaProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  textareaClassName?: string;
  inputClassName?: string
  error?: string | undefined| false;
disabled?: boolean;
maxLength?: number;
  id: string;
  rows?: number;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  id,
  label,
  placeholder,
  value,
  error,
  onChange,
  className,
  textareaClassName,
  inputClassName,
  disabled,
  maxLength,
  rows
}) => {
  return (
    <div className={`flex flex-col w-full ${className} ${disabled ? "opacity-50" : ""}`}>
      {label && <label className=' text-start' htmlFor={id}>{label}</label>}
      <div className={`flex border rounded-[10px] border-divider  ${textareaClassName}`}>
        <textarea
          id={id}
          className={cn("p-4 flex-1 w-full h-[100px] focus:outline-none bg-transparent resize-none", inputClassName)}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
        />
      </div>
      {error && <p className="text-negative mt-2 capitalize">{error}</p>}
    </div>
  );
};

export default CustomTextarea;
