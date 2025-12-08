import React from 'react'
import { FormFieldProp } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'

interface MonthPickerProp extends FormFieldProp {
  min?: string // Expected format "2024-01"
  max?: string // Expected format "2030-12"
}

export default function MonthPicker({
  label,
  value,
  error,
  setValue,
  placeholder,
  min,
  max,
  disabled = false,
}: MonthPickerProp) {
  return (
    <div className='flex flex-col'>
      {label && (
        <label className='font-inter text-left align-top text-sm leading-[1.4] tracking-[-0.006em] text-gray-800 dark:text-gray-200'>
          {label}
        </label>
      )}

      <input
        type='month'
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className='rounded-sm border border-gray-300 bg-transparent p-2 text-sm text-gray-800 shadow-xs focus:border-indigo-700 focus:outline-hidden disabled:bg-gray-100'
      />

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
