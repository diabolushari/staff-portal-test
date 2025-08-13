import ErrorText from '@/typography/ErrorText'
import React from 'react'
import { FormFieldProp } from '../ui_interfaces'

export const getFormStyle = (style: 'normal' | 'bottom-border' | 'dark') => {
  switch (style) {
    case 'normal': {
      return (
        ' rounded-lg border border-gray-300 py-3 pl-3 text-sm text-gray-800\n' +
        '            shadow-xs focus:border-indigo-700 focus:outline-hidden disabled:bg-gray-100'
      )
    }
    case 'bottom-border': {
      return `mt-0 block w-full border-0 border-b-2 border-gray-200
        px-0.5 font-nav text-sm focus:border-black focus:ring-0`
    }

    case 'dark': {
      return 'flex h-11 items-center rounded-sm border border-gray-300 bg-white pr-20 pl-10 text-sm body-1stop text-gray-600 shadow-sm focus:border focus:border-indigo-700 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:pr-52'
    }
    default: {
      return ''
    }
  }
}

export default function Input({
  label,
  value,
  error,
  setValue,
  placeholder,
  disabled = false,
  readonly = false,
  preventFormSubmit = false,
  style = 'normal',
  required = false,
  type = 'text',
  formatter,
  showClearButton = false,
}: FormFieldProp) {
  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (preventFormSubmit && event.key === 'Enter') {
      event.preventDefault()
    }
  }

  return (
    <>
      {label != null && (
        <label className='small-1stop mb-1 tracking-normal text-gray-800'>{label}</label>
      )}
      <input
        type={type}
        value={value}
        onKeyDown={handleKeydown}
        onChange={(event) =>
          formatter ? setValue(formatter(event.target.value)) : setValue(event.target.value)
        }
        placeholder={placeholder}
        className={getFormStyle(style)}
        disabled={disabled}
        readOnly={readonly}
        required={required}
      />
      {showClearButton && value && (
        <button
          type='button'
          onClick={() => setValue('')}
          className='absolute top-8 right-2 text-2xl text-gray-500 hover:text-red-500'
        >
          ✕
        </button>
      )}
      {error && <ErrorText>{error}</ErrorText>}
    </>
  )
}
