import React from 'react'
import { FormFieldProp } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'

interface DatePickerProp extends FormFieldProp {
  min?: string
  max?: string
}

export default function DatePicker({
  label,
  value,
  error,
  setValue,
  placeholder,
  min,
  max,
  disabled = false,
  required,
}: DatePickerProp) {
  return (
    <>
      <div className='flex flex-col'>
        {label != null && (
          <label className='text-sm leading-6 font-normal text-[#252c32]'>
            {required ? `${label} *` : label}
          </label>
        )}

        <input
          type='date'
          value={value}
          min={min}
          max={max}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className='rounded-sm border border-gray-300 bg-transparent p-2 text-sm text-gray-800 shadow-xs focus:border-indigo-700 focus:outline-hidden disabled:bg-gray-100'
          disabled={disabled}
        />
        {error && <ErrorText>{error}</ErrorText>}
      </div>
    </>
  )
}
