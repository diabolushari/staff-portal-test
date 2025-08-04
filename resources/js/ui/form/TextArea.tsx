import React from 'react'
import { FormFieldProp } from '../ui_interfaces'
import { getFormStyle } from './Input'
import ErrorText from '@/typography/ErrorText'

export default function TextArea({
  label,
  value,
  error,
  setValue,
  placeholder,
  disabled,
  style = 'normal',
}: FormFieldProp) {
  return (
    <>
      <label className='small-1stop mb-1 text-sm tracking-normal text-gray-800'>{label}</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        name='description'
        disabled={disabled}
        className={getFormStyle(style)}
      ></textarea>
      {error && <ErrorText>{error}</ErrorText>}
    </>
  )
}
