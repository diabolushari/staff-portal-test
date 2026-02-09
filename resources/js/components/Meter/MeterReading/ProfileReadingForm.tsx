import { Card } from '@/components/ui/card'
import { MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MeterReadingValueForm from './MeterReadingValueForm'
import { MeterReadingFormState, TimezoneReadingState } from './ReadingForm/useMeterReadingForm'
import { showError } from '@/ui/alerts'
import { verifyApparentEnergy, verifyFinalReadingDigits } from './valdiations/reading-validations'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'

interface Props {
  activeProfile: {
    meterIdx: number
    profileIdx: number
  } | null
  readingValues: MeterReadingFormState[]
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  updateReading: (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => void
  setActiveProfile: (profile: { meterIdx: number; profileIdx: number } | null) => void
  isFirstReading: boolean
  hasMultipleMeters: boolean
  setIsOnParameterForm: (isOnParameterForm: boolean) => void
}

const isOutside20Percent = (initial: number, diff: number) => {
  if (initial === 0) return false
  const percentage = (diff / initial) * 100
  return Math.abs(percentage) > 20
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

const ProfileReadingForm = forwardRef<ProfileReadingFormRef, Props>(
  ({
    activeProfile,
    readingValues,
    metersWithTimezonesAndProfiles,
    updateReading,
    setActiveProfile,
    isFirstReading,
    hasMultipleMeters,
    setIsOnParameterForm,
  }) => {
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

    const debounceRef = useRef<number | null>(null)

    const validateReadingsDebounced = useCallback(
      (readings: TimezoneReadingState[]) => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }

        debounceRef.current = window.setTimeout(() => {
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

            const finalNum = Number(reading.values.final)
            const diffNum = Number(reading.values.diff)

            if (Number.isNaN(finalNum)) {
              errors[`${reading.timezone_id}.final`] = 'Final reading must be a number.'
              return
            }

            if (finalNum < 0) {
              errors[`${reading.timezone_id}.final`] = 'Final reading must not be less than 0.'
              return
            }

            if (Number.isNaN(diffNum) || diffNum < 0) {
              errors[`${reading.timezone_id}.diff`] =
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
        }, 800)
      },
      [meter, selectedParameter, readingValues]
    )

    const updateTimezoneReading = useCallback(
      (timezoneId: number, updater: (r: TimezoneReadingState) => TimezoneReadingState) => {
        if (!meter || !selectedParameter || !parameterReading) return

        const updatedReadings = parameterReading.readings.map((r) =>
          r.timezone_id === timezoneId ? updater(r) : r
        )

        updateReading(meter.meter_id, selectedParameter.meter_parameter_id, updatedReadings)
      },
      [meter, selectedParameter, parameterReading, updateReading]
    )

    const updateData = useCallback(
      (timezoneId: number, value: string) => {
        const valueAsNumber = Number.parseFloat(value)
        if (value !== '' && Number.isNaN(valueAsNumber)) {
          showError('Invalid value')
          return
        }

        updateTimezoneReading(timezoneId, (reading) => {
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
              value: Number((meter?.meter_mf ?? 1) * diff).toFixed(
                meter?.meter.decimal_digit_count ?? 2
              ),
            },
          }

          // Debounced validation after typing stops
          validateReadingsDebounced(
            parameterReading!.readings.map((r) => (r.timezone_id === timezoneId ? updated : r))
          )

          return updated
        })
      },
      [updateTimezoneReading, maxValue, meter, validateReadingsDebounced, parameterReading]
    )

    const updateInitialValue = useCallback(
      (timezoneId: number, value: string) => {
        updateTimezoneReading(timezoneId, (reading) => {
          const normalized = value === '' ? '0' : value
          const num = Number.parseFloat(normalized)

          if (Number.isNaN(num)) return reading

          return {
            ...reading,
            values: {
              ...reading.values,
              initial: normalized,
              final: '',
              diff: 0,
              value: 0,
            },
          }
        })
      },
      [updateTimezoneReading]
    )

    const toggleRotation = useCallback(
      (timezoneId: number) => {
        updateTimezoneReading(timezoneId, (reading) => {
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
              value: (meter?.meter_mf ?? 1) * diff,
            },
          }
        })
      },
      [updateTimezoneReading, maxValue, meter]
    )

    const handleUpdate = () => {
      if (meter == null || selectedParameter == null || parameterReading == null) {
        return
      }
      const errors: Record<string, string | undefined> = {}
      const integerDigits = meter.meter.digit_count ?? 0
      const decimalDigits = meter.meter.decimal_digit_count ?? 0
      let hasErrors = false

      parameterReading.readings.forEach((reading) => {
        if (reading.values.final === '') {
          errors[`${reading.timezone_id}.final`] = 'Final reading is required.'
          hasErrors = true
          return
        }

        const finalAsNumber = Number.parseFloat(reading.values.final)
        const diffAsNumber = Number.parseFloat(reading.values.diff)
        if (Number.isNaN(finalAsNumber)) {
          errors[`${reading.timezone_id}.final`] = 'Final reading must be a number.'
          hasErrors = true
          return
        }
        if (finalAsNumber < 0) {
          errors[`${reading.timezone_id}.final`] = 'Final reading must not be less than 0.'
          hasErrors = true
          return
        }

        if (Number.isNaN(diffAsNumber) || diffAsNumber < 0) {
          errors[`${reading.timezone_id}.diff`] =
            'Final reading must not be less than Initial reading.'
          hasErrors = true
          return
        }

        const isValidFinal = verifyFinalReadingDigits(
          reading.values.final,
          integerDigits,
          decimalDigits
        )

        if (!isValidFinal) {
          const decimalHint = decimalDigits > 0 ? ` and ${decimalDigits} decimals` : ''
          errors[`${reading.timezone_id}.final`] =
            `Final reading can only have up to ${integerDigits} digits${decimalHint}.`
          hasErrors = true
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
            hasErrors = true
          }
        }
      })
      const warnings: Record<string, string | undefined> = {}
      let hasWarnings = false

      parameterReading.readings.forEach((reading) => {
        const initialDiff = Number(reading.values.lastReadingDiff)
        const diff = Number(reading.values.diff)

        if (!Number.isNaN(initialDiff) && !Number.isNaN(diff) && initialDiff > 0) {
          const percentage = getPercentageChange(initialDiff, diff)

          if (Math.abs(percentage) >= 20) {
            const direction = percentage > 0 ? 'higher' : 'lower'
            const absPercent = Math.abs(percentage).toFixed(2)

            warnings[`${reading.timezone_id}.diff`] =
              `Difference is ${absPercent}% ${direction} than previous reading. (Previous: ${initialDiff} -> Current: ${diff})`
            hasWarnings = true
          }
        }
      })

      setReadingWarnings(warnings)

      setReadingErrors(errors)
      if (hasErrors) {
        showError('Please fix the highlighted reading values.')
        return
      }
      if (hasWarnings) {
        setShowWarningModal(true)
        return
      }

      updateReading(meter.meter_id, selectedParameter.meter_parameter_id, parameterReading.readings)
      setActiveProfile(null)
    }

    useEffect(() => {
      if (
        meter &&
        selectedParameter &&
        parameterReading &&
        Object.keys(readingErrors).length === 0
      ) {
        updateReading(
          meter.meter_id,
          selectedParameter.meter_parameter_id,
          parameterReading.readings
        )
      }
    }, [readingErrors])

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
                Some readings differ by more than ±20%. Are you sure you want to continue?
              </p>

              <div className='mt-4 flex justify-end gap-2'>
                <Button
                  variant='secondary'
                  label='Cancel'
                  onClick={() => setShowWarningModal(false)}
                />
                <Button
                  variant='primary'
                  label='Continue & Save'
                  onClick={() => {
                    setShowWarningModal(false)
                    updateReading(
                      meter!.meter_id,
                      selectedParameter!.meter_parameter_id,
                      parameterReading!.readings
                    )
                    setActiveProfile(null)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
)
export default ProfileReadingForm
