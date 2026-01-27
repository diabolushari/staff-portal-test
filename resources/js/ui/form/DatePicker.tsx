import React from 'react'
import { FormFieldProp } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerProp extends FormFieldProp {
  min?: string
  max?: string
}

export default function Datepicker({
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
  const safeDate = (value?: string | Date | null): Date | null => {
    if (!value) return null

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value
    }

    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  }

  const formatForDB = (date: Date): string => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
  }
  return (
    <>
      <div className='flex flex-col'>
        {label != null && (
          <label className='text-sm leading-6 font-normal text-[#252c32]'>
            {required ? `${label} *` : label}
          </label>
        )}

        <DatePicker
          selected={safeDate(value)}
          onChange={(date: Date | null) => setValue(date ? formatForDB(date) : '')}
          placeholderText={placeholder}
          minDate={safeDate(min)}
          maxDate={safeDate(max)}
          disabled={disabled}
          dateFormat='dd/MM/yyyy'
          className='rounded border px-3 py-2'
        />
        {error && <ErrorText>{error}</ErrorText>}
      </div>
    </>
  )
}
