import { getMetersWithTimezonesAndProfiles } from '@/components/Meter/MeterReading/ReadingForm/meter-reading-helpers'
import {
  canSelectMeterWithNextReadingDate,
  getSelectedMeterNextReadingDate,
} from '@/components/Meter/MeterReading/ReadingForm/meter-selection-helpers'
import { getLastDayOfMonth } from '@/components/Meter/MeterReading/valdiations/meter-reading-validation-helpers'
import Field from '@/components/ui/field'
import {
  ConsumerData,
  MeterConnectionMapping,
  MeterReadingValueGroup,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { ConnectionDetailTooltip } from '../ConnectionDetailTooltip'

interface Props {
  connectionWithConsumer: ConsumerData
  formData: MeterReadingForm
  setFormValue: <K extends keyof MeterReadingForm>(key: K) => (value: MeterReadingForm[K]) => void
  toggleBoolean: (key: keyof MeterReadingForm) => () => void
  errors?: Record<string, string | undefined>
  latestMeterReadings?: MeterReadingValueGroup[]
  interimReasons: ParameterValues[]
  meterConnectionMappings: MeterConnectionMapping[]
  selectedMeters: number[]
  onSelectedMetersChange: (meterIds: number[]) => void
  onMetersWithTimezonesAndProfilesChange: (meters: MeterWithTimezoneAndProfile[]) => void
  setActiveStep: (step: number) => void
}

interface MeterRow {
  meter_id: number
  meter_serial: string
  next_reading_date: string | null
  is_first_reading_flag: boolean
}

function getEnergiseDate(
  meterConnectionMappings: MeterConnectionMapping[],
  meterId: number
): string | null {
  const mappings = meterConnectionMappings?.filter((meterConnectionMapping) => {
    return (
      meterConnectionMapping.meter_id === meterId &&
      meterConnectionMapping.energise_date != null &&
      meterConnectionMapping.is_current
    )
  })

  if (mappings.length === 0) {
    return null
  }

  if (mappings.length === 1) {
    return mappings[0].energise_date ?? null
  }

  //get energise date for record with Highest END date
  const latestRecord = mappings.reduce(
    (latestRecord, currentRecord) => {
      if (latestRecord == null || currentRecord.effective_end_ts == null) {
        return currentRecord
      }
      if (latestRecord.effective_end_ts == null) return latestRecord

      const currentEndDate = dayjs(currentRecord.effective_end_ts)
      const latestEndDate = dayjs(latestRecord.effective_end_ts)

      if (currentEndDate.isAfter(latestEndDate)) {
        return currentRecord
      }
      return latestRecord
    },
    null as MeterConnectionMapping | null
  )

  return latestRecord?.energise_date ?? null
}

export default function MeterReadingGeneralStep({
  connectionWithConsumer,
  formData,
  setFormValue,
  toggleBoolean,
  errors,
  latestMeterReadings,
  interimReasons,
  meterConnectionMappings,
  selectedMeters,
  onSelectedMetersChange,
  onMetersWithTimezonesAndProfilesChange,
  setActiveStep,
}: Readonly<Props>) {
  const maxDate = dayjs().format('DD-MM-YYYY')
  const maxDateForReadingStartDate = dayjs(maxDate).subtract(1, 'day').format('DD-MM-YYYY')
  const openDateField = true
  const [meterRows, setMeterRows] = useState<MeterRow[]>([])

  useEffect(() => {
    let dateOfFirstMeter: string | null = null

    const availableRows =
      latestMeterReadings
        ?.filter((latestMeterReading) => latestMeterReading?.meter != null)
        .map((latestMeterReading, index) => {
          const isFirstReading = latestMeterReading?.reading == null
          let nextReadingDate: string | null = null

          if (isFirstReading) {
            nextReadingDate = getEnergiseDate(
              meterConnectionMappings,
              latestMeterReading.meter.meter_id
            )
          } else {
            nextReadingDate = latestMeterReading?.reading?.reading_end_date ?? null
          }

          if (index === 0) {
            dateOfFirstMeter = nextReadingDate
          }

          return {
            meter_id: latestMeterReading.meter.meter_id,
            meter_serial: latestMeterReading.meter.meter_serial,
            next_reading_date: nextReadingDate,
            is_first_reading_flag: isFirstReading,
            checked: dateOfFirstMeter === nextReadingDate,
          }
        }) ?? []

    onSelectedMetersChange(availableRows.filter((row) => row.checked).map((row) => row.meter_id))
    setMeterRows(availableRows)
  }, [latestMeterReadings, meterConnectionMappings, onSelectedMetersChange])

  const isFirstReading = useMemo(() => {
    return selectedMeters.every((meterId) => {
      const row = meterRows.find((meterRow) => meterRow.meter_id === meterId)
      if (!row?.is_first_reading_flag) {
        return false
      }
      return true
    })
  }, [meterRows, selectedMeters])

  const selectedMeterNextReadingDate = useMemo(() => {
    return getSelectedMeterNextReadingDate(meterRows, selectedMeters)
  }, [meterRows, selectedMeters])

  useEffect(() => {
    if (selectedMeters.length < 2 || selectedMeterNextReadingDate === undefined) {
      return
    }

    const filteredSelectedMeters = selectedMeters.filter((meterId) => {
      const meterRow = meterRows.find((row) => row.meter_id === meterId)

      if (meterRow == null) {
        return false
      }

      return meterRow.next_reading_date === selectedMeterNextReadingDate
    })

    if (filteredSelectedMeters.length !== selectedMeters.length) {
      onSelectedMetersChange(filteredSelectedMeters)
    }
  }, [meterRows, onSelectedMetersChange, selectedMeterNextReadingDate, selectedMeters])

  useEffect(() => {
    const readingStartDate =
      meterRows.find((meterRow) => meterRow.meter_id === selectedMeters[0])?.next_reading_date ??
      null

    if (readingStartDate == null) {
      return
    }

    if (isFirstReading) {
      setFormValue('reading_start_date')(readingStartDate)
      setFormValue('reading_end_date')(getLastDayOfMonth(readingStartDate))
    }
    if (!isFirstReading) {
      const nextDay = dayjs(readingStartDate).add(1, 'day')
      setFormValue('reading_start_date')(nextDay.format('YYYY-MM-DD'))
      setFormValue('reading_end_date')(getLastDayOfMonth(nextDay.format('YYYY-MM-DD')))
    }
  }, [isFirstReading, selectedMeters, meterRows, setFormValue])

  const handleMeterSelection = (meterId: number): void => {
    if (selectedMeters.includes(meterId)) {
      onSelectedMetersChange(
        selectedMeters.filter((selectedMeterId) => selectedMeterId !== meterId)
      )
      return
    }

    if (!canSelectMeterWithNextReadingDate(meterRows, selectedMeters, meterId)) {
      return
    }

    onSelectedMetersChange([...selectedMeters, meterId])
  }

  const handleValidate = async (): Promise<void> => {
    const { hasError, meterWithTimezonesAndProfiles } = await getMetersWithTimezonesAndProfiles({
      connectionId: formData.connection_id,
      meterIds: selectedMeters,
      startDate: formData.reading_start_date ?? null,
      endDate: formData.reading_end_date ?? null,
      latestMeterReadings,
      meterConnectionMappings,
    })

    if (hasError) {
      return
    }

    onMetersWithTimezonesAndProfilesChange(meterWithTimezonesAndProfiles)
    setActiveStep(1)
  }

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
            <CheckBox
              label='Use For Billing'
              toggleValue={toggleBoolean('is_billable')}
              value={formData.is_billable}
              error={errors?.is_billable}
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

            <div className='col-span-2'>
              <div className='mb-2 text-sm font-medium text-[#252c32]'>Meters</div>
              {selectedMeters.length > 0 && (
                <div className='mb-2 text-xs text-[#5f6d79]'>
                  Only meters with the same last reading date can be selected together.
                </div>
              )}
              <div className='grid gap-3'>
                {meterRows?.map((meterRow) => {
                  const isSelected = selectedMeters.includes(meterRow.meter_id)
                  const isSelectable = canSelectMeterWithNextReadingDate(
                    meterRows,
                    selectedMeters,
                    meterRow.meter_id
                  )

                  return (
                    <label
                      key={meterRow.meter_id}
                      className={`flex items-start gap-3 rounded-lg border border-[#e5e9eb] p-3 ${
                        isSelectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => handleMeterSelection(meterRow.meter_id)}
                        className='mt-1 h-4 w-4'
                        disabled={!isSelectable && !isSelected}
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-[#252c32]'>
                          Meter Serial: {meterRow.meter_serial}
                        </span>
                        <span className='text-xs text-[#5f6d79]'>
                          Next Reading Date:{' '}
                          {meterRow.next_reading_date != null
                            ? dayjs(meterRow.next_reading_date).format('DD-MM-YYYY')
                            : '-'}
                        </span>
                      </div>
                    </label>
                  )
                })}

                {(!meterRows || meterRows.length === 0) && (
                  <div className='rounded-lg border border-dashed border-[#d8dde0] p-3 text-sm text-[#5f6d79]'>
                    No meters available
                  </div>
                )}
              </div>
            </div>

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
              />
            )}

            <div className='col-span-2 flex justify-end'>
              <Button
                type='button'
                label='Validate & Continue'
                onClick={handleValidate}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
