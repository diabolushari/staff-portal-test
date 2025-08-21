import ErrorText from '@/typography/ErrorText'
import React from 'react'
import { FormFieldProp } from '../ui_interfaces'

export const getFormStyle = (
  style: 'normal' | 'bottom-border' | 'dark' | 'google' | 'disabled'
) => {
  switch (style) {
    case 'normal': {
      return 'w-full rounded border text-sm border-[#8EA6BE] bg-[#F9FAFB]/50 dark:bg-[#F9FAFB]/10 text-[#000000] dark:text-white font-inter font-medium p-2'
    }
    case 'bottom-border': {
      return (
        'mt-0 block w-full border-0 border-b-2 border-gray-200 px-0.5 font-nav text-sm ' +
        'focus:border-black focus:ring-0 dark:border-gray-600 dark:text-gray-300 dark:focus:border-indigo-500'
      )
    }
    case 'dark': {
      return (
        'flex h-11 items-center rounded-sm border border-gray-300 bg-white pr-20 pl-10 text-sm body-1stop ' +
        'text-gray-600 shadow-sm focus:border-indigo-700 focus:outline-hidden ' +
        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:pr-52'
      )
    }
    case 'google': {
      return (
        'w-full rounded-sm border border-[#8EA6BE]  py-2 pl-6 pr-12 text-black-1000 shadow-sm ' +
        'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ' +
        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900'
      )
    }
    case 'disabled': {
      return (
        'w-full font-medium text-sm rounded border border-transparent bg-[#F9FAFB] opacity-100 py-2 pl-6 pr-12 text-black-1000 shadow-sm ' +
        'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ' +
        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900'
      )
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
  className = '',
}: FormFieldProp) {
  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (preventFormSubmit && event.key === 'Enter') {
      event.preventDefault()
    }
  }

  return (
    <>
      <div className={style === 'google' ? 'w-full' : ''}>
        {label != null && (
          <label className='font-inter text-left align-top text-sm leading-[1.4] tracking-[-0.006em] text-gray-800 dark:text-gray-200'>
            {label}
          </label>
        )}

        <div className={`relative ${style === 'google' ? 'w-full' : ''}`}>
          <input
            type={type}
            value={value}
            onKeyDown={handleKeydown}
            onChange={(event) =>
              formatter ? setValue(formatter(event.target.value)) : setValue(event.target.value)
            }
            placeholder={placeholder}
            className={getFormStyle(style) + '' + (className ? ' ' + className : '')}
            disabled={disabled}
            readOnly={readonly}
            required={required}
          />

          {showClearButton && value && (
            <button
              type='button'
              onClick={() => setValue('')}
              className='absolute top-1/2 right-2 -translate-y-1/2 text-xl text-gray-500 hover:text-red-500'
            >
              ✕
            </button>
          )}
        </div>

        {error && <ErrorText>{error}</ErrorText>}
      </div>
    </>
  )
}
