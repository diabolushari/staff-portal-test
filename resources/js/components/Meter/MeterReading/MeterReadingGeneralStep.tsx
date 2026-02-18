import Field from '@/components/ui/field'
import {
  ConsumerData,
  MeterReadingValueGroup,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import RadioGroup from '@/ui/form/RadioGroup'
import { ConnectionDetailTooltip } from './ConnectionDetailTooltip'
import dayjs from 'dayjs'
import Datepicker from '@/ui/form/DatePicker'
import { ParameterValues } from '@/interfaces/parameter_types'
import SelectList from '@/ui/form/SelectList'
import MultiSelectList from '@/ui/form/MultiSelect'
import CheckBox from '@/ui/form/CheckBox'
import { useEffect, useState } from 'react'
import { getNextDay } from '@/utils/DateService'

interface Props {
  connectionWithConsumer: ConsumerData
  formData: any
  setFormValue: any
  toggleBoolean: any
  errors?: any
  latestMeterReading?: MeterReadingValueGroup[]
  isFirstReading?: boolean
  isInterimReading?: boolean
  interimReasons: ParameterValues[]
  metersListForInterimReading: MeterWithTimezoneAndProfile[]
  availableMeterIds: number[]
  hasInterimReading: boolean
}

export default function MeterReadingGeneralStep({
  connectionWithConsumer,
  formData,
  setFormValue,
  toggleBoolean,
  errors,
  latestMeterReading,
  isFirstReading,
  interimReasons,
  metersListForInterimReading,
  hasInterimReading,
}: Props) {
  const maxDate = dayjs().format('DD-MM-YYYY')
  const maxDateForReadingStartDate = dayjs(maxDate).subtract(1, 'day').format('DD-MM-YYYY')
  const [openDateField, setOpenDateField] = useState(
    hasInterimReading == false || formData.meters.length > 0
  )

  useEffect(() => {
    if (formData?.meters?.length > 0) {
      const meterReadingEndDates = latestMeterReading
        ?.filter((groupedReading) => {
          if (formData.meters.includes(groupedReading.meter.meter_id)) {
            return groupedReading.reading?.reading_end_date ?? []
          }
        })
        .map((groupedReading) => groupedReading.reading?.reading_end_date)

      const isSameBillEndDate = meterReadingEndDates?.every(
        (date) => date === meterReadingEndDates[0]
      )
      if (isSameBillEndDate && meterReadingEndDates?.length > 0) {
        setOpenDateField(true)
        setFormValue('reading_start_date')(getNextDay(meterReadingEndDates[0]))
      } else {
        setOpenDateField(false)
      }
    }
  }, [formData.meters.length, hasInterimReading])

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Organization: {connectionWithConsumer?.consumer?.organization_name}
        </StrongText>
      </div>
      <hr className='mb-6 border-[#e5e9eb]' />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Field
          label='Tariff'
          value={connectionWithConsumer?.connection?.tariff?.parameter_value}
        />
        <Field
          label='Purpose'
          value={connectionWithConsumer?.connection?.primary_purpose?.parameter_value}
        />
        <ConnectionDetailTooltip connectionWithConsumer={connectionWithConsumer} />

        <div className='col-span-3'>
          <div className='grid gap-4 md:grid-cols-2'>
            <CheckBox
              label='Interim Reading'
              toggleValue={toggleBoolean('is_interim_reading')}
              value={formData.is_interim_reading}
              error={errors?.is_interim_reading}
            />
            {formData.is_interim_reading && (
              <SelectList
                label='Interim Reason'
                list={interimReasons}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('interim_reason_id')}
                value={formData?.interim_reason_id}
                error={errors?.interim_reason_id}
              />
            )}

            <MultiSelectList
              label='Meters'
              list={metersListForInterimReading}
              dataKey='meter_id'
              displayKey='meter_serial'
              setValue={setFormValue('meters')}
              value={formData?.meters}
              error={errors?.meters}
            />

            <div className='col-span-2 grid md:grid-cols-2'>
              <Datepicker
                label='Meter Reading Date'
                value={formData?.metering_date}
                setValue={setFormValue('metering_date')}
                error={errors?.metering_date}
                max={maxDate}
              />
            </div>

            {openDateField && (
              <Datepicker
                label='Billing Period Start'
                value={formData.reading_start_date}
                setValue={(value) => {
                  setFormValue('reading_start_date')(value)
                  if (isFirstReading) {
                    setFormValue('reading_end_date')(value)
                  }
                }}
                error={errors?.reading_start_date}
                disabled={!isFirstReading}
                max={maxDateForReadingStartDate}
              />
            )}
            {openDateField && (
              <Datepicker
                label='Billing Period End'
                value={formData.reading_end_date}
                setValue={setFormValue('reading_end_date')}
                error={errors?.reading_end_date}
                max={maxDate}
                disabled={!isFirstReading && !formData.is_interim_reading}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
