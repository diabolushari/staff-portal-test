import {
  MeterProfileParameter,
  MeterReading,
  MeterReadingValue,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { showError } from '@/ui/alerts'
import { read } from 'fs'
import { useCallback, useEffect, useState } from 'react'


const KVAH_NAME = 'kvah'
const KWH_NAME = 'kwh'

const isValidMeterReading = (
  value: string,
  intDigits: number,
  decDigits: number
) => {
  if (value === '') return true

  const regex =
    decDigits > 0
      ? new RegExp(`^\\d{0,${intDigits}}(\\.\\d{0,${decDigits}})?$`)
      : new RegExp(`^\\d{0,${intDigits}}$`)

  return regex.test(value)
}

const getTimezoneDiff = (
  meterReading: MeterReadingFormState,
  parameterName: string,
  timezoneId: number
): number | null => {
  const parameter = meterReading.parameters.find(
    (p) => p.name?.toLowerCase() === parameterName
  )
  if (!parameter) return null

  const reading = parameter.readings.find(
    (r) => r.timezone_id === timezoneId
  )
  

  if (!reading || reading.values.final === '0') return null

  const finalVal = Number(reading.values.final)

  if (Number.isNaN(finalVal)) return null

  return finalVal - reading.values.initial
}
const validateKvahVsKwh = (
  meterReading: MeterReadingFormState,
  updatingParameterName: string,
  timezoneId: number,
  newFinalValue: number,
  readingValues: MeterReadingFormState[]
): boolean => {
  const kvahDiff =
    updatingParameterName === KVAH_NAME
      ? newFinalValue -
        (meterReading.parameters
          .find(p => p.name?.toLowerCase() === KVAH_NAME)
          ?.readings.find(r => r.timezone_id === timezoneId)
          ?.values.initial ?? 0)
      : getTimezoneDiff(meterReading, KVAH_NAME, timezoneId)


  const kwhDiff =
    updatingParameterName === KWH_NAME
      ? newFinalValue -
        (meterReading.parameters
          .find(p => p.name?.toLowerCase() === KWH_NAME)
          ?.readings.find(r => r.timezone_id === timezoneId)
          ?.values.initial ?? 0)
      : getTimezoneDiff(meterReading, KWH_NAME, timezoneId)

  if (kvahDiff == null || kwhDiff == null || kwhDiff === 0 || kvahDiff === 0) {
    return true // can't validate yet
  }

  return kvahDiff >= kwhDiff
}

export interface MeterReadingFormState {
  meter_id: number
  parameters: {
    meter_parameter_id: number
    display_name: string
    is_cumulative: boolean
    is_export: boolean
    readings: TimezoneReadingState[]
    name: string
  }[]
}

export interface TimezoneReadingState {
  timezone_id: number
  timezone_name: string
  isRotation: boolean
  values: {
    diff: string
    final: string
    initial: number
    value: number
  }
}

function transformToFormData(
  values: MeterReadingValue[],
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
): MeterReadingFormState[] {
  return metersWithTimezonesAndProfiles.map((meter) => {
    const meterReadings = values.filter((v) => v.meter_id === meter.meter_id)

    const parameters = meter.meter_profiles.map((profile: MeterProfileParameter) => {
      const parameterReadings = meterReadings.filter(
        (readingValue) => readingValue.parameter_id === profile.meter_parameter_id
      )

      const readings = meter.timezones.map((tz) => {
        const match = parameterReadings.find((r) => r.timezone_id === tz.timezone_id)
        return {
          timezone_id: tz.timezone_id,
          timezone_name: tz.timezone_name,
          isRotation: false,
          values: {
            initial: match?.initial_reading ?? 0,
            final: match?.final_reading?.toString() ?? '',
            diff: match?.difference?.toString() ?? '0',
            value: 0,
          },
        }
      })

      return {
        meter_parameter_id: profile.meter_parameter_id,
        display_name: profile.display_name,
        name: profile?.name,
        is_cumulative: profile.is_cumulative,
        is_export: profile.is_export,
        readings,
      }
    })

    return {
      meter_id: meter.meter_id,
      parameters,
    }
  })
}

const getPreviousFinalReading = (
  lastMeterReading: MeterReading | null,
  meterId: number,
  parameterId: number,
  timezoneId: number
) => {
  if (lastMeterReading == null) {
    return 0
  }
  return (
    lastMeterReading.values.find(
      (readingValue) =>
        readingValue.meter_id === meterId &&
        readingValue.timezone_id === timezoneId &&
        readingValue.parameter_id === parameterId
    )?.final_reading ?? 0
  )
}

export default function useMeterReadingForm(
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  lastMeterReading: MeterReading | null,
  oldReading: MeterReading | null
) {
  const [readingValues, setReadingValues] = useState<MeterReadingFormState[]>([])

const toggleRotation = (
  meterId: number,
  parameterId: number,
  timezoneId: number,
  checked: boolean
) => {
  setReadingValues(prev =>
    prev.map(m =>
      m.meter_id !== meterId ? m : {
        ...m,
        parameters: m.parameters.map(p =>
          p.meter_parameter_id !== parameterId ? p : {
            ...p,
            readings: p.readings.map(r =>
              r.timezone_id !== timezoneId ? r : {
                ...r,
                isRotation: checked,
              }
            ),
          }
        ),
      }
    )
  )
}


  useEffect(() => {
    if (readingValues?.length > 0) {
      return
    }

    if (oldReading != null && oldReading?.values?.length > 0) {
      const transformed = transformToFormData(oldReading.values, metersWithTimezonesAndProfiles)
      setReadingValues(transformed)
      return
    }
    const initializedMeters = metersWithTimezonesAndProfiles.map((meter) => ({
      meter_id: meter.meter_id,
      parameters: meter.meter_profiles.map((profile) => ({
        meter_parameter_id: profile.meter_parameter_id,
        display_name: profile.display_name,
        is_cumulative: profile.is_cumulative,
        is_export: profile.is_export,
        name: profile.name,
        readings: meter?.timezones?.map((tz) => ({
          timezone_id: tz.timezone_id,
          timezone_name: tz.timezone_name,
          isRotation: false,
          values: {
            initial: !profile.is_cumulative
              ? 0
              : getPreviousFinalReading(
                  lastMeterReading,
                  meter.meter_id,
                  profile.meter_parameter_id,
                  tz.timezone_id
                ),
            final: '',
            diff: '',
            value: 0,
          },
        })),
      })),
    }))

    

    setReadingValues(initializedMeters)
    
  }, [oldReading, metersWithTimezonesAndProfiles, readingValues, lastMeterReading])


  const updateReading = useCallback(
    (meterId: number, parameterId: number, timezoneId: number, value: string) => {
      const valueAsNumber = Number.parseFloat(value)
      if (value != '' && Number.isNaN(valueAsNumber)) {
        showError('Invalid value')
        return
      }
      const meterInfo = metersWithTimezonesAndProfiles.find((m) => m.meter_id === meterId)
      if (meterInfo == null) {
        showError('Meter not found')
        return
      }

    const digit_count = meterInfo.meter.digit_count ?? 0
    const decimal_digit_count = meterInfo.meter.decimal_digit_count ?? 0

    // HARD validation (final authority)
    if (!isValidMeterReading(value, digit_count, decimal_digit_count)) {
      showError(
        `Max ${digit_count} digits and ${decimal_digit_count} decimals allowed`
      )
      return
    }
    const parameterName =
  meterInfo.meter_profiles.find(
    (p) => p.meter_parameter_id === parameterId
  )?.name


if (parameterName?.toLowerCase() === KVAH_NAME || parameterName?.toLowerCase() === KWH_NAME) {
  const meterState = readingValues.find(
    (m) => m.meter_id === meterId
  )
  

  if (meterState) {
    const isValid = validateKvahVsKwh(
      meterState,
      parameterName,
      timezoneId,
      valueAsNumber,
      readingValues
    )

    if (!isValid) {
      showError('KVAH value cannot be less than KWH for the same timezone')
      return
    }
  }
}


  setReadingValues(prev =>
  prev.map(meterReading => {
    if (meterReading.meter_id !== meterId) return meterReading

    return {
      ...meterReading,
      parameters: meterReading.parameters.map(parameter => {
        if (parameter.meter_parameter_id !== parameterId) return parameter

        return {
          ...parameter,
          readings: parameter.readings.map(reading => {
            if (reading.timezone_id !== timezoneId) return reading

            const maxValue =
              Number('9'.repeat(digit_count)) +
              (decimal_digit_count > 0
                ? Number(`0.${'9'.repeat(decimal_digit_count)}`)
                : 0)

            let diff = 0

            if (value !== '') {
              if (valueAsNumber >= reading.values.initial) {
                diff = valueAsNumber - reading.values.initial
              } else if (reading.isRotation) {
                diff = (maxValue - reading.values.initial) + valueAsNumber
              } else {
                diff = 0
              }
            }

            return {
              ...reading,
              values: {
                initial: reading.values.initial,
                final: value,
                diff: diff.toString(),
                value: diff * (meterInfo.meter.meter_mf ?? 0),
              },
            }
          }),
        }
      }),
    }
  })
)


    },
    [metersWithTimezonesAndProfiles, readingValues]
  )

  return {
    readingValues,
    updateReading,
    toggleRotation,
  }
}
