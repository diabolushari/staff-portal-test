import {
  MeterConnectionMapping,
  MeterProfileParameter,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { MeterReadingFormState, TimezoneReadingState } from '../ReadingForm/useMeterReadingForm'
import { verifyApparentEnergy, verifyFinalReadingDigits } from './reading-validations'

export function getMeterMappingForPeriod(
  mappings: MeterConnectionMapping[],
  start: string,
  end: string
): MeterConnectionMapping[] {
  const startDate = dayjs(start)
  const endDate = dayjs(end)

  if (!startDate.isValid() || !endDate.isValid()) {
    return []
  }

  return mappings
    .filter((mapping) => mapping.effective_start_ts != mapping.effective_end_ts)
    .filter((mapping) => {
      const mappingStart =
        mapping.effective_start_ts == null ? null : dayjs(mapping.effective_start_ts)
      const mappingEnd = mapping.effective_end_ts == null ? null : dayjs(mapping.effective_end_ts)

      if (mappingStart == null) {
        return false
      }

      return (
        (mappingStart.isBefore(endDate) || mappingStart.isSame(endDate)) &&
        (mappingEnd == null || mappingEnd.isAfter(startDate) || mappingEnd.isSame(startDate))
      )
    })
}

export function getLastDayOfMonth(date: string): string {
  return dayjs(date).endOf('month').format('YYYY-MM-DD')
}

const getPercentageChange = (initialDiff: number, lastDiff: number) => {
  if (initialDiff === 0) return 0
  const diffChange = lastDiff - initialDiff
  return (diffChange / initialDiff) * 100
}

function validateReading(
  readingValues: MeterReadingFormState[],
  readings: TimezoneReadingState[],
  selectedMeter: MeterWithTimezoneAndProfile,
  selectedParameter: MeterProfileParameter
) {
  const errors: Record<string, string | undefined> = {}
  const warnings: Record<string, string | undefined> = {}

  const integerDigits = selectedMeter.meter.digit_count ?? 0
  const decimalDigits = selectedMeter.meter.decimal_digit_count ?? 0

  readings.forEach((reading) => {
    if (reading.values.final === '') {
      return
    }

    const finalNum = Number.parseFloat(reading.values.final)
    const diffNum = Number.parseFloat(reading.values.diff)

    if (Number.isNaN(finalNum)) {
      errors[`${reading.timezone_id}.final`] = 'Final reading must be a number.'
      return
    }

    if (finalNum < 0) {
      errors[`${reading.timezone_id}.final`] = 'Final reading must not be less than 0.'
      return
    }

    if (Number.isNaN(diffNum) || diffNum < 0) {
      errors[`${reading.timezone_id}.final`] =
        'Final reading must not be less than Initial reading.'
      return
    }

    if (!verifyFinalReadingDigits(reading.values.final, integerDigits, decimalDigits)) {
      const decimalHint = decimalDigits > 0 ? ` and ${decimalDigits} decimals` : ''
      errors[`${reading.timezone_id}.final`] =
        `Final reading can only have up to ${integerDigits} digits${decimalHint}.`
      return
    }

    if (
      selectedParameter.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() ||
      selectedParameter.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase()
    ) {
      if (
        !verifyApparentEnergy(
          reading.timezone_id,
          selectedParameter.name,
          Number(reading.values.diff),
          selectedMeter,
          readingValues
        )
      ) {
        errors[`${reading.timezone_id}.diff`] = 'kVAh should be greater than kWh.'
        return
      }
    }

    const prevDiff = Number(reading.values.lastReadingDiff)
    if (!Number.isNaN(prevDiff) && prevDiff > 0) {
      const percentage = getPercentageChange(prevDiff, diffNum)
      if (Math.abs(percentage) >= 20) {
        const direction = percentage > 0 ? 'higher' : 'lower'
        warnings[`${reading.timezone_id}.diff`] =
          `Difference is ${Math.abs(percentage).toFixed(2)}% ${direction} than previous reading.`
      }
    }
  })

  return { errors, warnings }
}

export default function useMeterReadingValidation(
  selectedMeter: MeterWithTimezoneAndProfile | null,
  selectedParameter: MeterProfileParameter | null,
  readingValues: MeterReadingFormState[]
) {
  const [readingErrors, setReadingErrors] = useState<Record<string, string | undefined>>({})
  const [readingWarnings, setReadingWarnings] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    if (selectedMeter == null || selectedParameter == null || readingValues.length === 0) {
      setReadingErrors({})
      setReadingWarnings({})
      return
    }

    const debounceRef = setTimeout(() => {
      setReadingErrors({})
      setReadingWarnings({})
      readingValues.forEach((reading) => {
        if (reading.meter_id !== selectedMeter.meter_id) {
          return
        }

        const parameterReading = reading.parameters.find(
          (p) => p.meter_parameter_id === selectedParameter.meter_parameter_id
        )

        if (parameterReading == null) {
          return
        }

        const { errors, warnings } = validateReading(
          readingValues,
          parameterReading.readings,
          selectedMeter,
          selectedParameter
        )
        setReadingErrors(errors)
        setReadingWarnings(warnings)
      })
    }, 700)

    return () => {
      if (debounceRef != null) {
        clearTimeout(debounceRef)
      }
    }
  }, [selectedMeter, selectedParameter, readingValues])

  return { readingErrors, readingWarnings }
}
