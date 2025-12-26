import { cn } from '@/lib/utils'
import ErrorText from '@/typography/ErrorText'
import { useMemo } from 'react'
import { FormFieldProp as FormFieldProperty } from '../ui_interfaces'

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
  displayKey2?: G
  showAllOption?: boolean
  allOptionText?: string
  showLabel?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
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
  displayKey2,
  showAllOption = false,
  allOptionText,
  showLabel = true,
  disabled = false,
  required = false,
  className = '',
}: Properties<K, G, U, V, T>) {
  const selectedOption = useMemo(() => {
    const index = list.findIndex((item) => item[dataKey] == value)
    return index === -1 ? '' : value
  }, [value, dataKey, list])

  // Figma-based styling matching Input component
  const selectClasses = cn(
    'w-full bg-white px-3 py-2 pr-10 rounded border border-gray-200 text-sm font-normal text-black',
    'appearance-none',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kseb-primary focus-visible:border-kseb-primary',
    'disabled:bg-gray-50 disabled:text-black disabled:cursor-not-allowed disabled:opacity-100',
    className
  )

  return (
    <div className='space-y-1'>
      {label != null && showLabel && (
        <label className='text-sm leading-6 font-normal text-[#252c32]'>
          {required ? `${label} *` : label}
        </label>
      )}
      <select
        name='type'
        value={selectedOption}
        onChange={(e) => setValue(e.target.value)}
        className={selectClasses}
        disabled={disabled}
        required={required}
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
            className='hover:bg-kseb-primary'
          >
            {`${item[displayKey]} ${displayKey2 ? ` - ${item[displayKey2]}` : ''}`}
          </option>
        ))}
      </select>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
