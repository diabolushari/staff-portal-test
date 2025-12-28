import {
  MeterProfileParameter,
  MeterReading,
  MeterReadingValue,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { useCallback, useEffect, useState } from 'react'

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

    const parameters = meter.reading_parameters.map((profile: MeterProfileParameter) => {
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

  useEffect(() => {
    if (readingValues?.length > 0) {
      return
    }

    if (
      metersWithTimezonesAndProfiles == null ||
      metersWithTimezonesAndProfiles.length === 0 ||
      lastMeterReading == null
    ) {
      return
    }

    if (oldReading != null && oldReading?.values?.length > 0) {
      const transformed = transformToFormData(oldReading.values, metersWithTimezonesAndProfiles)
      setReadingValues(transformed)
      return
    }
    const initializedMeters = metersWithTimezonesAndProfiles.map((meter) => ({
      meter_id: meter.meter_id,
      parameters: meter.reading_parameters.map((profile) => ({
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
<<<<<<< HEAD

=======
>>>>>>> 3b81ee96d2b4c3caf5b4088a371d44d6e36d52ee

  const updateReading = useCallback(
    (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => {
      setReadingValues((prev) =>
        prev.map((meterReading) => {
          if (meterReading.meter_id !== meterId) return meterReading

          return {
            ...meterReading,
            parameters: meterReading.parameters.map((parameter) => {
              if (parameter.meter_parameter_id !== parameterId) return parameter

              return {
                ...parameter,
                readings: newReading,
              }
            }),
          }
        })
      )
    },
    []
  )

  return {
    readingValues,
    updateReading,
  }
}
