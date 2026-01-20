'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { FormFieldProp } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'

interface DatePickerProp extends FormFieldProp {
  min?: string // yyyy-mm-dd
  max?: string // yyyy-mm-dd
}

const isoToDate = (value?: string) => (value ? new Date(value) : undefined)
const dateToIso = (date?: Date) => {
  if (!date) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function DatePicker({
  label,
  value,
  error,
  setValue,
  placeholder = 'Pick a date',
  min,
  max,
  disabled = false,
  required,
}: DatePickerProp) {
  const selectedDate = isoToDate(value)

  return (
    <div className='flex flex-col gap-1'>
      {label && <label className='text-sm text-[#252c32]'>{required ? `${label} *` : label}</label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            disabled={disabled}
            className={cn(
              'justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {selectedDate ? format(selectedDate, 'dd-MM-yyyy') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='wmt-auto p-0'
          align='start'
        >
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={(date) => setValue(dateToIso(date))}
            fromDate={isoToDate(min)}
            toDate={isoToDate(max)}
            initialFocus
            className='kseb-primary w-full'
          />
        </PopoverContent>
      </Popover>

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
