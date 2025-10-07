import React, { useEffect, useState } from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import StrongText from '@/typography/StrongText'
import { route } from 'ziggy-js'
import Card from '@/ui/Card/Card'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import { meterNavItems, meterTimezoneNavItems } from '@/components/Navbar/navitems'
import { Save, ArrowLeft } from 'lucide-react'
import { router } from '@inertiajs/react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Enable custom parse format plugin for strict validation
dayjs.extend(customParseFormat)

interface MeteringTimezone {
  metering_timezone_id?: number
  pricing_type?: { id: number; parameter_value: string }
  timezone_type?: { id: number; parameter_value: string }
  timezone_name?: { id: number; parameter_value: string }
  from_hrs?: number
  from_mins?: number
  to_hrs?: number
  to_mins?: number
  created_by?: number
  updated_by?: number
}

interface Props {
  timezone?: MeteringTimezone
  pricingTypes: ParameterValues[]
  timezoneTypes: ParameterValues[]
  timezoneNames: ParameterValues[]
  isEdit?: boolean
}

export default function MeteringTimezoneFormPage({
  timezone,
  pricingTypes,
  timezoneTypes,
  timezoneNames,
  isEdit = false,
}: Props) {
  console.log(timezone)
  console.log(timezoneTypes, pricingTypes, timezoneNames)

  // Time validation state
  const [timeErrors, setTimeErrors] = useState<{
    timeFormat?: string
    timeRange?: string
  }>({})

  // --- BREADCRUMBS ---
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Metering Timezones', href: route('metering-timezone.index') },
    {
      title: isEdit ? 'Edit Timezone' : 'Create Timezone',
      href: isEdit
        ? route('metering-timezone.edit', timezone?.metering_timezone_id)
        : route('metering-timezone.create'),
    },
  ]

  const { formData, setFormValue } = useCustomForm({
    pricing_type_id: timezone?.pricing_type?.id?.toString() ?? '',
    timezone_type_id: timezone?.timezone_type?.id?.toString() ?? '',
    timezone_name_id: timezone?.timezone_name?.id?.toString() ?? '',
    from_hrs: timezone?.from_hrs?.toString() ?? '',
    from_mins: timezone?.from_mins?.toString() ?? '',
    to_hrs: timezone?.to_hrs?.toString() ?? '',
    to_mins: timezone?.to_mins?.toString() ?? '',
    _method: isEdit ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    isEdit
      ? route('metering-timezone.update', timezone?.metering_timezone_id)
      : route('metering-timezone.store'),
    {
      onComplete: () => {
        // Redirect handled by controller
      },
    }
  )

  // Helper function to create Day.js time object for comparison
  const createTimeObject = (hours: string, minutes: string) => {
    if (!hours || !minutes) return null

    // Pad with zeros for consistent format
    const paddedHours = hours.padStart(2, '0')
    const paddedMinutes = minutes.padStart(2, '0')
    const timeString = `${paddedHours}:${paddedMinutes}`

    // Parse with strict validation using base date
    return dayjs(`2000-01-01 ${timeString}`, 'YYYY-MM-DD HH:mm', true)
  }

  // Validate individual time components
  const validateTimeComponents = (hours: string, minutes: string): boolean => {
    const h = parseInt(hours)
    const m = parseInt(minutes)

    return !isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59
  }

  // Cross-field validation using useEffect with Day.js
  useEffect(() => {
    const newTimeErrors: typeof timeErrors = {}

    const fromHours = formData.from_hrs
    const fromMins = formData.from_mins
    const toHours = formData.to_hrs
    const toMins = formData.to_mins

    // Only validate if all fields have values
    if (fromHours && fromMins && toHours && toMins) {
      // Validate basic format first
      const fromValid = validateTimeComponents(fromHours, fromMins)
      const toValid = validateTimeComponents(toHours, toMins)

      if (!fromValid || !toValid) {
        newTimeErrors.timeFormat = 'Please enter valid time in 24-hour format (00-23:00-59)'
      } else {
        // Create Day.js objects for comparison
        const fromTime = createTimeObject(fromHours, fromMins)
        const toTime = createTimeObject(toHours, toMins)

        // Check if Day.js objects are valid
        if (!fromTime?.isValid() || !toTime?.isValid()) {
          newTimeErrors.timeFormat = 'Invalid time format detected'
        } else {
          // Compare times using Day.js - fromTime should be before toTime
          if (!fromTime.isBefore(toTime) && !fromTime.isSame(toTime)) {
            // If fromTime is not before toTime and not same, then it's after
            newTimeErrors.timeRange = 'From time must be earlier than To time'
          } else if (fromTime.isSame(toTime)) {
            // If times are the same, that's also invalid for a range
            newTimeErrors.timeRange = 'From time and To time cannot be the same'
          }

          // Optional: Check for reasonable time ranges (e.g., not too short)
          const diffMinutes = toTime.diff(fromTime, 'minutes')
          if (diffMinutes < 1 && diffMinutes >= 0) {
            newTimeErrors.timeRange = 'Time range must be at least 1 minute'
          }
        }
      }
    }

    setTimeErrors(newTimeErrors)
  }, [formData.from_hrs, formData.from_mins, formData.to_hrs, formData.to_mins])

  // Enhanced handleSubmit with Day.js validation
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check for time validation errors
    if (Object.keys(timeErrors).length > 0) {
      return // Don't submit if there are time validation errors
    }

    post(formData)
  }

  const handleBack = () => {
    router.get(route('metering-timezone.index'))
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterTimezoneNavItems}
    >
      <div className='container mx-auto py-8'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold text-gray-800'>
              {isEdit ? 'Edit Metering Timezone' : 'Create New Metering Timezone'}
            </h1>
            <p className='text-gray-500'>
              {isEdit ? 'Update timezone configuration' : 'Configure a new metering timezone'}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              label='Back to List'
              onClick={handleBack}
              variant='outline'
              icon={<ArrowLeft className='mr-2 h-4 w-4' />}
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-6'
        >
          <Card className='overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
            <div className='border-b-2 border-gray-200 px-6 py-3'>
              <StrongText className='text-base font-semibold'>Basic Information</StrongText>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-2'>
              <SelectList
                label='Pricing Type'
                list={pricingTypes}
                dataKey='id'
                displayKey='parameterValue'
                setValue={setFormValue('pricing_type_id')}
                value={formData.pricing_type_id}
                error={errors?.pricing_type_id}
                required
              />
              <SelectList
                label='Timezone Type'
                list={timezoneTypes}
                dataKey='id'
                displayKey='parameterValue'
                setValue={setFormValue('timezone_type_id')}
                value={formData.timezone_type_id}
                error={errors?.timezone_type_id}
                required
              />
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-1'>
              <SelectList
                label='Timezone Name'
                list={timezoneNames}
                dataKey='id'
                displayKey='parameterValue'
                setValue={setFormValue('timezone_name_id')}
                value={formData.timezone_name_id}
                error={errors?.timezone_name_id}
                required
              />
            </div>
          </Card>

          <Card className='overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
            <div className='border-b-2 border-gray-200 px-6 py-3'>
              <StrongText className='text-base font-semibold'>Time Range Configuration</StrongText>
            </div>

            {/* Display time validation errors */}
            {(timeErrors.timeFormat || timeErrors.timeRange) && (
              <div className='mx-6 mt-4 rounded-md border border-red-200 bg-red-50 p-3'>
                {timeErrors.timeFormat && (
                  <p className='mb-1 text-sm text-red-600'> {timeErrors.timeFormat}</p>
                )}
                {timeErrors.timeRange && (
                  <p className='text-sm text-red-600'> {timeErrors.timeRange}</p>
                )}
              </div>
            )}

            {/* Show time preview when valid */}
            {!Object.keys(timeErrors).length &&
              formData.from_hrs &&
              formData.from_mins &&
              formData.to_hrs &&
              formData.to_mins && (
                <div className='mx-6 mt-4 rounded-md border border-green-200 bg-green-50 p-3'>
                  <p className='text-sm text-green-700'>
                    Time Range: {formData.from_hrs.padStart(2, '0')}:
                    {formData.from_mins.padStart(2, '0')} - {formData.to_hrs.padStart(2, '0')}:
                    {formData.to_mins.padStart(2, '0')}
                    {(() => {
                      const fromTime = createTimeObject(formData.from_hrs, formData.from_mins)
                      const toTime = createTimeObject(formData.to_hrs, formData.to_mins)
                      if (fromTime?.isValid() && toTime?.isValid()) {
                        const duration = toTime.diff(fromTime, 'minutes')
                        const hours = Math.floor(duration / 60)
                        const minutes = duration % 60
                        return ` (Duration: ${hours}h ${minutes}m)`
                      }
                      return ''
                    })()}
                  </p>
                </div>
              )}

            <div className='mt-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <StrongText className='text-sm font-medium text-gray-700'>From Time</StrongText>
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    label='Hours (00-23)'
                    type='number'
                    min={0}
                    max={23}
                    setValue={setFormValue('from_hrs')}
                    value={formData.from_hrs}
                    error={errors?.from_hrs}
                    placeholder='00'
                    required
                  />
                  <Input
                    label='Minutes (00-59)'
                    type='number'
                    min={0}
                    max={59}
                    setValue={setFormValue('from_mins')}
                    value={formData.from_mins}
                    error={errors?.from_mins}
                    placeholder='00'
                    required
                  />
                </div>
              </div>
              <div className='space-y-4'>
                <StrongText className='text-sm font-medium text-gray-700'>To Time</StrongText>
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    label='Hours (00-23)'
                    type='number'
                    min={0}
                    max={23}
                    setValue={setFormValue('to_hrs')}
                    value={formData.to_hrs}
                    error={errors?.to_hrs}
                    placeholder='00'
                    required
                  />
                  <Input
                    label='Minutes (00-59)'
                    type='number'
                    min={0}
                    max={59}
                    setValue={setFormValue('to_mins')}
                    value={formData.to_mins}
                    error={errors?.to_mins}
                    placeholder='00'
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className='flex justify-end gap-4'>
            <Button
              label='Cancel'
              onClick={handleBack}
              variant='outline'
              disabled={loading}
              type='button'
            />
            <Button
              label={isEdit ? 'Update Timezone' : 'Create Timezone'}
              type='submit'
              disabled={loading || Object.keys(timeErrors).length > 0}
              variant='primary'
              icon={<Save className='mr-2 h-4 w-4' />}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
