import { Card } from '@/components/ui/card'
import { MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'
import { showError } from '@/ui/alerts'
import Button from '@/ui/button/Button'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MeterReadingValueForm from './MeterReadingValueForm'
import { MeterReadingFormState, TimezoneReadingState } from './ReadingForm/useMeterReadingForm'
import { verifyApparentEnergy, verifyFinalReadingDigits } from './valdiations/reading-validations'

interface Props {
  activeProfile: {
    meterIdx: number
    profileIdx: number
  } | null
  readingValues: MeterReadingFormState[]
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  updateReading: (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => void
  isFirstReading: boolean
  onErrorChange?: (hasError: boolean) => void
}

const getPercentageChange = (initialDiff: number, lastDiff: number) => {
  if (initialDiff === 0) return 0
  const diffChange = lastDiff - initialDiff
  return (diffChange / initialDiff) * 100
}

export interface ProfileReadingFormRef {
  handleUpdate: (skipWarnings?: boolean) => {
    hasErrors: boolean
    hasWarnings: boolean
  }
}

const ProfileReadingForm = ({
  activeProfile,
  readingValues,
  metersWithTimezonesAndProfiles,
  updateReading,
  isFirstReading,
  onErrorChange,
}: Props) => {
  const [readingErrors, setReadingErrors] = useState<Record<string, string | undefined>>({})
  const [readingWarnings, setReadingWarnings] = useState<Record<string, string | undefined>>({})
  const [showWarningModal, setShowWarningModal] = useState(false)

  const { meter, selectedParameter, parameterReading } = useMemo(() => {
    if (activeProfile == null) {
      return {
        meter: null,
        profile: null,
        parameterReading: null,
      }
    }

    const meter = metersWithTimezonesAndProfiles[activeProfile.meterIdx]
    const selectedParameter = meter.reading_parameters[activeProfile.profileIdx]
    const meterReadingData = readingValues.find((m) => m.meter_id === meter.meter_id)
    const parameterReading = meterReadingData?.parameters.find(
      (p) => p.meter_parameter_id === selectedParameter.meter_parameter_id
    )

    return {
      meter,
      selectedParameter,
      parameterReading,
    }
  }, [activeProfile, readingValues, metersWithTimezonesAndProfiles])

  const maxValue = useMemo(() => {
    const integerDigits = meter?.meter.digit_count ?? 0
    const decimalDigits = meter?.meter.decimal_digit_count ?? 0
    return Number.parseFloat(
      `${'9'.repeat(integerDigits)}${decimalDigits > 0 ? `.${'9'.repeat(2)}` : ''}`
    )
  }, [meter])

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const validateReadings = useCallback(
    (readings: TimezoneReadingState[]) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        if (!meter || !selectedParameter) return

        const errors: Record<string, string | undefined> = {}
        const warnings: Record<string, string | undefined> = {}

        const integerDigits = meter.meter.digit_count ?? 0
        const decimalDigits = meter.meter.decimal_digit_count ?? 0

        readings.forEach((reading) => {
          // -------- Errors --------
          if (reading.values.final === '') {
            errors[`${reading.timezone_id}.final`] = 'Final reading is required.'
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
                meter,
                readingValues
              )
            ) {
              errors[`${reading.timezone_id}.diff`] = 'kVAh should be greater than kWh.'
              return
            }
          }

          // -------- Warnings --------
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

        setReadingErrors(errors)
        setReadingWarnings(warnings)

        if (!readingErrors && readingWarnings) {
          setShowWarningModal(true)
        }
      }, 800)
    },
    [meter, selectedParameter, readingValues]
  )
  useEffect(() => {
    const hasError = Object.keys(readingErrors).length > 0
    onErrorChange?.(hasError)
  }, [readingErrors, onErrorChange])

  const updateData = useCallback(
    (timezoneId: number, value: string) => {
      if (!meter || !selectedParameter || !parameterReading) return

      const valueAsNumber = Number.parseFloat(value)
      if (value !== '' && Number.isNaN(valueAsNumber)) {
        showError('Invalid value')
        return
      }

      setReadingErrors((prev) => {
        const updated = { ...prev }
        delete updated[`${timezoneId}.final`]
        delete updated[`${timezoneId}.diff`]
        return updated
      })

      setReadingWarnings((prev) => {
        const updated = { ...prev }
        delete updated[`${timezoneId}.diff`]
        return updated
      })

      const updatedReadings = parameterReading.readings.map((reading) => {
        if (reading.timezone_id !== timezoneId) return reading

        let diff = 0
        if (value !== '') {
          if (reading.isRotation) {
            diff = Math.ceil(maxValue) - Number(reading.values.initial) + valueAsNumber
          } else {
            diff = valueAsNumber - Number(reading.values.initial)
          }
        }

        const updated = {
          ...reading,
          values: {
            ...reading.values,
            final: value,
            diff: diff.toString(),
            value: Number(
              ((meter.meter_mf ?? 1) * diff).toFixed(meter.meter.decimal_digit_count ?? 2)
            ),
          },
        }

        return updated
      })

      validateReadings(updatedReadings)

      updateReading(meter.meter_id, selectedParameter.meter_parameter_id, updatedReadings)
    },
    [meter, selectedParameter, parameterReading, maxValue, validateReadings, updateReading]
  )

  const updateInitialValue = useCallback(
    (timezoneId: number, value: string) => {
      if (!meter || !selectedParameter || !parameterReading) return

      const updatedReadings = parameterReading.readings.map((reading) => {
        if (reading.timezone_id !== timezoneId) return reading

        const normalized = value === '' ? '0' : value
        const num = Number.parseFloat(normalized)
        if (Number.isNaN(num)) return reading

        return {
          ...reading,
          values: {
            ...reading.values,
            initial: Number(normalized),
            final: '',
            diff: '0',
            value: 0,
          },
        }
      })

      updateReading(meter.meter_id, selectedParameter.meter_parameter_id, updatedReadings)
    },
    [meter, selectedParameter, parameterReading, updateReading]
  )

  const toggleRotation = useCallback(
    (timezoneId: number) => {
      if (!meter || !selectedParameter || !parameterReading) return

      const updatedReadings = parameterReading.readings.map((reading) => {
        if (reading.timezone_id !== timezoneId) return reading

        const finalNum = Number(reading.values.final)
        let diff = Number(reading.values.diff)

        if (!Number.isNaN(finalNum)) {
          diff = reading.isRotation
            ? finalNum - Number(reading.values.initial)
            : Math.ceil(maxValue) - Number(reading.values.initial) + finalNum
        }

        return {
          ...reading,
          isRotation: !reading.isRotation,
          values: {
            ...reading.values,
            diff: diff.toString(),
            value: (meter.meter_mf ?? 1) * diff,
          },
        }
      })

      updateReading(meter.meter_id, selectedParameter.meter_parameter_id, updatedReadings)
    },
    [meter, selectedParameter, parameterReading, maxValue, updateReading]
  )

  useEffect(() => {
    if (meter && selectedParameter && parameterReading && Object.keys(readingErrors).length === 0) {
      updateReading(meter.meter_id, selectedParameter.meter_parameter_id, parameterReading.readings)
    }
  }, [readingErrors])

  useEffect(() => {
    console.log('Form mounted')
    return () => console.log('Form unmounted')
  }, [])

  return (
    <>
      {meter == null || selectedParameter == null || parameterReading == null ? null : (
        <div className='flex flex-col gap-4'>
          <Card className='p-4'>
            <div
              className={`mt-2 ${
                parameterReading?.readings?.length > 2 ? 'overflow-y-auto pr-2' : ''
              }`}
            >
              <MeterReadingValueForm
                parameterReadingValues={parameterReading.readings ?? []}
                onChange={updateData}
                onToggleRotation={toggleRotation}
                meter={meter.meter}
                profileParameter={selectedParameter}
                errors={readingErrors}
                maxReadingValue={maxValue}
                isFirstReading={isFirstReading}
                updateInitialReading={updateInitialValue}
                mf={meter?.meter_mf ?? 1}
                warnings={readingWarnings}
              />
            </div>
          </Card>
        </div>
      )}
      {showWarningModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='w-full max-w-md rounded-lg bg-white p-6'>
            <h3 className='text-lg font-semibold text-yellow-600'>Warning detected</h3>
            <p className='mt-2 text-sm text-gray-700'>
              Reading difference is more than ±20%. Are you sure you want to continue?
            </p>

            <div className='mt-4 flex justify-end gap-2'>
              <Button
                variant='primary'
                label='ok'
                onClick={() => setShowWarningModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileReadingForm
