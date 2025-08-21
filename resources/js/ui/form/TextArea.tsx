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
      <div>
        {label != null && (
          <label className='font-inter text-left align-top text-sm leading-[1.4] tracking-[-0.006em] text-gray-800 dark:text-gray-200'>
            {label}
          </label>
        )}

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          name='description'
          disabled={disabled}
          className={getFormStyle(style)}
        ></textarea>
        {error && <ErrorText>{error}</ErrorText>}
      </div>
    </>
  )
}
