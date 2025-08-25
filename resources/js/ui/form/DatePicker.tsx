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
}: DatePickerProp) {
  return (
    <>
      <div className='flex flex-col'>
        {label != null && (
          <label className='font-inter text-left align-top text-sm leading-[1.4] tracking-[-0.006em] text-gray-800 dark:text-gray-200'>
            {label}
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
