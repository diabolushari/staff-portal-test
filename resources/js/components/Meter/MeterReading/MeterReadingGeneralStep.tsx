import { getMeterMappingForPeriod } from '@/components/Meter/MeterReading/valdiations/meter-reading-validation-helpers'
import Field from '@/components/ui/field'
import {
  Connection,
  ConsumerData,
  MeterConnectionMapping,
  MeteringTimezoneSlot,
  MeterProfileParameter,
  MeterReadingValueGroup,
  MeterTransformerAssignment,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import StrongText from '@/typography/StrongText'
import { handleHttpErrors, showError } from '@/ui/alerts'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import { getDisplayDate } from '@/utils'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { ConnectionDetailTooltip } from './ConnectionDetailTooltip'

interface Props {
  connectionWithConsumer: ConsumerData
  formData: MeterReadingForm
  setFormValue: <K extends keyof MeterReadingForm>(key: K) => (value: MeterReadingForm[K]) => void
  toggleBoolean: (key: keyof MeterReadingForm) => () => void
  errors?: Record<string, string | undefined>
  latestMeterReadings?: MeterReadingValueGroup[]
  interimReasons: ParameterValues[]
  meterConnectionMappings: MeterConnectionMapping[]
  onMetersWithTimezonesAndProfilesChange: (meters: MeterWithTimezoneAndProfile[]) => void
}

interface MeterRow {
  meterId: number
  meterSerial: string
  latestMeterReadingDate: string | null
  checked: boolean
}

interface MeterPeriodDetailsResponse {
  success: boolean
  data?: {
    connections: Connection[]
    meters?: MeterPeriodDetails[]
  }
}

interface MeterPeriodDetails {
  meter_id: number
  profiles: {
    profile: ParameterValues | null
    profile_parameters: MeterProfileParameter[]
  }[]
  timezones: {
    metering_timezones: MeteringTimezoneSlot[]
    timezone_type: ParameterValues | null
  }[]
  transformer_relations: MeterTransformerAssignment[]
}

const getSmallestDate = (dates: string[]): string | null => {
  const validDates = dates.filter((date) => dayjs(date).isValid())
  if (validDates.length === 0) {
    return null
  }

  return validDates.reduce((smallestDate, currentDate) => {
    if (dayjs(currentDate).isBefore(dayjs(smallestDate))) {
      return currentDate
    }

    return smallestDate
  })
}

const getLastReadingDate = (latestMeterReadingDate: string | null): string => {
  if (!latestMeterReadingDate) {
    return '-'
  }

  return getDisplayDate(latestMeterReadingDate)
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
  onMetersWithTimezonesAndProfilesChange,
}: Readonly<Props>) {
  const maxDate = dayjs().format('DD-MM-YYYY')
  const maxDateForReadingStartDate = dayjs(maxDate).subtract(1, 'day').format('DD-MM-YYYY')
  const [openDateField, setOpenDateField] = useState(true)
  const [meterRows, setMeterRows] = useState<MeterRow[]>([])
  const selectedMeterIds = useMemo(() => {
    return new Set(
      meterRows.filter((meterRow) => meterRow.checked).map((meterRow) => meterRow.meterId)
    )
  }, [meterRows])

  const smallestPreviousReadingEndDate = useMemo(() => {
    const previousReadingEndDates =
      latestMeterReadings
        ?.filter((latestMeterReading) => {
          const meterId = latestMeterReading?.meter?.meter_id

          if (meterId == null || !selectedMeterIds.has(meterId)) {
            return false
          }

          return latestMeterReading?.reading?.reading_end_date != null
        })
        .map((latestMeterReading) => latestMeterReading.reading?.reading_end_date ?? '') ?? []

    return getSmallestDate(previousReadingEndDates)
  }, [latestMeterReadings, selectedMeterIds])

  const smallestSelectedMeterEnergiseDate = useMemo(() => {
    const energiseDates =
      meterConnectionMappings
        ?.filter((meterConnectionMapping) => {
          return (
            selectedMeterIds.has(meterConnectionMapping.meter_id) &&
            meterConnectionMapping.is_current &&
            meterConnectionMapping.energise_date != null
          )
        })
        .map((meterConnectionMapping) => meterConnectionMapping.energise_date ?? '') ?? []
    return getSmallestDate(energiseDates)
  }, [meterConnectionMappings, selectedMeterIds])

  const isFirstReading = useMemo(() => {
    const hasPreviousReadingForSelectedMeter = latestMeterReadings?.some((latestMeterReading) => {
      const meterId = latestMeterReading?.meter?.meter_id

      if (meterId == null || !selectedMeterIds.has(meterId)) {
        return false
      }

      return latestMeterReading?.reading?.reading_end_date != null
    })

    return !hasPreviousReadingForSelectedMeter
  }, [latestMeterReadings, selectedMeterIds])

  useEffect(() => {
    if (isFirstReading && smallestSelectedMeterEnergiseDate != null) {
      setFormValue('reading_start_date')(smallestSelectedMeterEnergiseDate)
      setFormValue('reading_end_date')(smallestSelectedMeterEnergiseDate)
    }
    if (!isFirstReading && smallestPreviousReadingEndDate != null) {
      setFormValue('reading_start_date')(smallestPreviousReadingEndDate)
      setFormValue('reading_end_date')('')
    }
  }, [
    isFirstReading,
    smallestPreviousReadingEndDate,
    smallestSelectedMeterEnergiseDate,
    setFormValue,
  ])

  const handleMeterSelection = (meterId: number): void => {
    setMeterRows((previousMeterRows) => {
      return previousMeterRows.map((meterRow) => {
        if (meterRow.meterId !== meterId) {
          return meterRow
        }

        return {
          ...meterRow,
          checked: !meterRow.checked,
        }
      })
    })
  }

  const handleValidate = async (): Promise<void> => {
    try {
      const selectedMeterIds = meterRows
        .filter((meterRow) => meterRow.checked)
        .map((meterRow) => meterRow.meterId)

      const payload = {
        connection_id: formData.connection_id,
        meter_ids: selectedMeterIds,
        start_date: formData.reading_start_date ?? null,
        end_date: formData.reading_end_date ?? null,
      }

      const response = await axios.post<MeterPeriodDetailsResponse>(
        '/api/connections/period-details',
        payload
      )

      if (!response.data?.success) {
        showError('Validation Failed')
        return
      }

      console.log(response.data)

      //check if any meter has multiple timezones or profiles
      let hasError = false

      response.data?.data?.meters?.map((meter) => {
        if (meter.profiles.length !== 1) {
          showError(
            'Meter Should have only one profile during selected period. Please check the meter details.'
          )
          hasError = true
        }
        if (meter.timezones.length !== 1) {
          showError(
            'Meter Should have only one timezone during selected period. Please check the meter details.'
          )
          hasError = true
        }
        const mappings = getMeterMappingForPeriod(
          meterConnectionMappings.filter((mapping) => mapping.meter_id === meter.meter_id),
          payload.start_date ?? '',
          payload.end_date ?? ''
        )
        if (mappings.length !== 1) {
          showError('Meters data changed during this period. Please check the meter details.')
          hasError = true
        }
      })

      if (hasError) {
        return
      }
      //construct meterWith Profile + Timezone
      const meterWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[] =
        response.data?.data?.meters
          ?.map((meter) => {
            const latestMeterReading = latestMeterReadings?.find(
              (latestMeterReading) => latestMeterReading?.meter?.meter_id === meter.meter_id
            )
            if (latestMeterReading == null || latestMeterReading?.meter == null) {
              return null
            }
            const mapping = getMeterMappingForPeriod(
              meterConnectionMappings.filter((mapping) => mapping.meter_id === meter.meter_id),
              payload.start_date ?? '',
              payload.end_date ?? ''
            )
            return {
              meter_id: meter.meter_id,
              meter: {
                ...latestMeterReading.meter,
                transformers: meter.transformer_relations,
              },
              meter_serial: latestMeterReading.meter.meter_serial,
              reading_parameters: meter.profiles[0].profile_parameters,
              timezones: meter.timezones[0].metering_timezones.map((timezone) => {
                return {
                  timezone_id: timezone.timezone_name_id,
                  timezone_name: timezone.timezone_name?.parameter_value ?? '',
                }
              }),
              meter_mf: mapping[0].meter_mf,
              meter_profile: meter.profiles[0].profile,
            } as MeterWithTimezoneAndProfile
          })
          .filter((meterWithTimezoneAndProfile) => meterWithTimezoneAndProfile != null)

      onMetersWithTimezonesAndProfilesChange(meterWithTimezonesAndProfiles)
    } catch (error) {
      handleHttpErrors(error)
    }
  }

  useEffect(() => {
    const availableRows =
      latestMeterReadings
        ?.filter((latestMeterReading) => latestMeterReading?.meter != null)
        .map((latestMeterReading) => ({
          meterId: latestMeterReading.meter.meter_id,
          meterSerial: latestMeterReading.meter.meter_serial,
          latestMeterReadingDate: latestMeterReading?.reading?.reading_end_date ?? null,
        })) ?? []

    setMeterRows((previousMeterRows) => {
      if (availableRows.length === 0) {
        return []
      }

      const previousCheckedMap = new Map(
        previousMeterRows.map((meterRow) => [meterRow.meterId, meterRow.checked])
      )

      return availableRows.map((meterRow) => ({
        ...meterRow,
        checked: previousCheckedMap.get(meterRow.meterId) ?? true,
      }))
    })
  }, [latestMeterReadings])

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
              <div className='grid gap-3'>
                {meterRows?.map((meterRow) => {
                  return (
                    <label
                      key={meterRow.meterId}
                      className='flex cursor-pointer items-start gap-3 rounded-lg border border-[#e5e9eb] p-3'
                    >
                      <input
                        type='checkbox'
                        checked={meterRow.checked}
                        onChange={() => handleMeterSelection(meterRow.meterId)}
                        className='mt-1 h-4 w-4'
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-[#252c32]'>
                          Meter Serial: {meterRow.meterSerial}
                        </span>
                        <span className='text-xs text-[#5f6d79]'>
                          Last Reading Date: {getLastReadingDate(meterRow.latestMeterReadingDate)}
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
