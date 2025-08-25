import React, { useMemo } from 'react'
import { FormFieldProp as FormFieldProperty } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'

export interface Properties<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
> extends FormFieldProperty {
  list: T[]
  dataKey: K
  displayKey: G
  showAllOption?: boolean
  allOptionText?: string
  showLabel?: boolean
  style?: 'normal' | 'bottom-border' | 'dark' | 'disabled'
  disabled?: boolean
}

const getStyle = (style: 'normal' | 'bottom-border' | 'dark' | 'disabled') => {
  switch (style) {
    case 'normal':
      return 'w-full rounded border text-sm border-[#8EA6BE] bg-[#F9FAFB]/50 dark:bg-[#F9FAFB]/10 text-[#000000] dark:text-white font-inter font-medium p-2'

    case 'bottom-border':
      return `mt-0 block w-full border-0 border-b-2 border-gray-200 bg-neutral-50 px-0.5 bodybold text-sm
        focus:border-black focus:ring-0
        dark:border-gray-600 dark:text-gray-300 dark:focus:border-indigo-500`

    case 'disabled':
      return `w-full appearance-none rounded-sm border border-transparent bg-white opacity-50 py-3 pl-3
        text-sm text-gray-800 focus:border-indigo-700 focus:outline-none
        dark:bg-gray-800 dark:text-gray-100`

    default:
      return ''
  }
}

export default function SelectList<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
>({
  value,
  label,
  error,
  setValue,
  list,
  dataKey,
  displayKey,
  showAllOption = false,
  allOptionText,
  showLabel = true,
  style = 'normal',
  disabled = false,
}: Properties<K, G, U, V, T>) {
  const selectedOption = useMemo(() => {
    const index = list.findIndex((item) => item[dataKey] == value)
    return index === -1 ? '' : value
  }, [value, dataKey, list])

  return (
    <div>
      {label != null && showLabel && (
        <label className='font-inter text-left align-top text-sm leading-[1.4] tracking-[-0.006em] text-gray-800 dark:text-gray-200'>
          {label}
        </label>
      )}
      <select
        name='type'
        value={selectedOption}
        onChange={(e) => setValue(e.target.value)}
        className={getStyle(style)}
        disabled={disabled}
      >
        {showAllOption && <option value=''>{allOptionText}</option>}
        {!showAllOption && label != null && (
          <option
            value=''
            disabled
          >
            Select {label}
          </option>
        )}
        {list.map((item: T) => (
          <option
            value={item[dataKey]}
            key={item[dataKey]}
          >
            {item[displayKey]}
          </option>
        ))}
      </select>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
