import {
  MeterProfileParameter,
  MeterReading,
  MeterReadingValue,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { showError } from '@/ui/alerts'
import { useCallback, useEffect, useState } from 'react'

export interface MeterReadingFormState {
  meter_id: number
  parameters: {
    meter_parameter_id: number
    display_name: string
    readings: TimezoneReadingState[]
  }[]
}

export interface TimezoneReadingState {
  timezone_id: number
  timezone_name: string
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

  useEffect(() => {
    if (readingValues?.length > 0) {
      return
    }

    console.log('lastMeterReading', lastMeterReading)

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
        readings: meter?.timezones?.map((tz) => ({
          timezone_id: tz.timezone_id,
          timezone_name: tz.timezone_name,
          values: {
            initial: getPreviousFinalReading(
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
      setReadingValues((prev) => {
        return prev.map((meterReading) => {
          if (meterReading.meter_id !== meterId) {
            return meterReading
          }
          return {
            ...meterReading,
            parameters: meterReading.parameters.map((parameter) => {
              if (parameter.meter_parameter_id !== parameterId) {
                return parameter
              }
              return {
                ...parameter,
                readings: parameter.readings.map((reading) => {
                  if (reading.timezone_id !== timezoneId) {
                    return reading
                  }
                  return {
                    ...reading,
                    values: {
                      initial: reading.values.initial,
                      final: value,
                      diff: (valueAsNumber - reading.values.initial).toString(),
                      value:
                        (valueAsNumber - reading.values.initial) * (meterInfo.meter.meter_mf ?? 0),
                    },
                  }
                }),
              }
            }),
          }
        })
      })
    },
    [metersWithTimezonesAndProfiles]
  )

  return {
    readingValues,
    updateReading,
  }
}
