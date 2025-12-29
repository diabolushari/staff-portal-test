import { Card } from '@/components/ui/card'
import { MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
}

export default function ProfileReadingForm({
  activeProfile,
  readingValues,
  metersWithTimezonesAndProfiles,
  updateReading,
  setActiveProfile,
  isFirstReading,
}: Readonly<Props>) {
  const [currentReadingState, setCurrentReadingState] = useState<TimezoneReadingState[]>([])
  const [readingErrors, setReadingErrors] = useState<Record<string, string | undefined>>({})

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

  useEffect(() => {
    if (parameterReading == null) {
      return
    }
    const timezoneReadingStates = parameterReading.readings.map((reading) => {
      return {
        ...reading,
        values: {
          ...reading.values,
        },
      }
    })
    setCurrentReadingState(timezoneReadingStates)
  }, [parameterReading])

  const maxValue = useMemo(() => {
    const integerDigits = meter?.meter.digit_count ?? 0
    const decimalDigits = meter?.meter.decimal_digit_count ?? 0
    return Number.parseFloat(
      `${'9'.repeat(integerDigits)}${decimalDigits > 0 ? `.${'9'.repeat(2)}` : ''}`
    )
  }, [meter])

  const updateData = useCallback(
    (timeZoneId: number, value: string) => {
      const valueAsNumber = Number.parseFloat(value)
      if (value != '' && Number.isNaN(valueAsNumber)) {
        showError('Invalid value')
        return
      }
      setCurrentReadingState((prevState) => {
        return prevState.map((tzReading) => {
          if (tzReading.timezone_id !== timeZoneId) {
            return tzReading
          }
          let diff: number
          if (tzReading.isRotation) {
            diff = maxValue - tzReading.values.initial + valueAsNumber
          } else {
            diff = valueAsNumber - tzReading.values.initial
          }
          return {
            ...tzReading,
            values: {
              ...tzReading.values,
              final: value,
              diff: diff.toString(),
              value: (meter?.meter.meter_mf ?? 0) * diff,
            },
          }
        })
      })
    },
    [meter, maxValue]
  )

  const updateInitialValue = useCallback((timeZoneId: number, value: string) => {
    setCurrentReadingState((prevState) => {
      return prevState.map((tzReading) => {
        if (tzReading.timezone_id !== timeZoneId) {
          return tzReading
        }
        const valueAsNumber = Number.parseFloat(value)
        if (value != '' && Number.isNaN(valueAsNumber)) {
          return tzReading
        }
        return {
          ...tzReading,
          values: {
            ...tzReading.values,
            initial: value,
            final: value,
            diff: '0',
            value: 0,
          },
        }
      })
    })
  }, [])

  const toggleRotation = useCallback(
    (timezoneId: number) => {
      setCurrentReadingState((prevState) => {
        return prevState.map((tzReading) => {
          if (tzReading.timezone_id !== timezoneId) {
            return tzReading
          }
          if (tzReading.values.final === '') {
            return {
              ...tzReading,
              isRotation: !tzReading.isRotation,
            }
          }
          const finalValue = Number.parseFloat(tzReading.values.final)
          if (Number.isNaN(finalValue)) {
            return {
              ...tzReading,
              isRotation: !tzReading.isRotation,
            }
          }
          let diff: number
          if (!tzReading.isRotation) {
            diff = maxValue - tzReading.values.initial + finalValue
          } else {
            diff = finalValue - tzReading.values.initial
          }
          return {
            ...tzReading,
            isRotation: !tzReading.isRotation,
            values: {
              ...tzReading.values,
              diff: diff.toString(),
              value: (meter?.meter.meter_mf ?? 0) * diff,
            },
          }
        })
      })
    },
    [maxValue, meter]
  )

  const handleUpdate = () => {
    if (meter == null || selectedParameter == null || parameterReading == null) {
      return
    }
    const errors: Record<string, string | undefined> = {}
    const integerDigits = meter.meter.digit_count ?? 0
    const decimalDigits = meter.meter.decimal_digit_count ?? 0
    let hasErrors = false

    currentReadingState.forEach((reading) => {
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

    setReadingErrors(errors)
    if (hasErrors) {
      showError('Please fix the highlighted reading values.')
      return
    }

    updateReading(meter.meter_id, selectedParameter.meter_parameter_id, currentReadingState)
    setActiveProfile(null)
  }

  return (
    <>
      {meter == null || selectedParameter == null || parameterReading == null ? null : (
        <div className='flex flex-col gap-4'>
          <Card className='p-4'>
            <StrongText>{selectedParameter?.display_name}</StrongText>
            <div
              className={`mt-2 ${
                parameterReading?.readings?.length > 2 ? 'overflow-y-auto pr-2' : ''
              }`}
            >
              <MeterReadingValueForm
                parameterReadingValues={currentReadingState ?? []}
                onChange={updateData}
                onToggleRotation={toggleRotation}
                meter={meter.meter}
                profileParameter={selectedParameter}
                errors={readingErrors}
                maxReadingValue={maxValue}
                isFirstReading={isFirstReading}
                updateInitialReading={updateInitialValue}
              />
            </div>
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                variant='secondary'
                onClick={() => setActiveProfile(null)}
                label='Cancel'
              />
              <Button
                onClick={handleUpdate}
                type='button'
                label='UPDATE READING'
              />
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
