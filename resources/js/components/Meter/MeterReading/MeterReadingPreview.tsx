import {
  Meter,
  MeterProfileParameter,
  MeterTransformerAssignment,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import { useCallback, useEffect, useRef, useState } from 'react'
import PowerFactorBar from './MeterPowerFactor'
import ProfileReadingForm, { ProfileReadingFormRef } from './ProfileReadingForm'
import ReadingParameterPreviewCard from './ReadingForm/ReadingParameterPreviewCard'
import { MeterHealth } from './ReadingForm/useMeterHealthForm'
import { MeterReadingFormState, TimezoneReadingState } from './ReadingForm/useMeterReadingForm'

interface PowerFactorData {
  timezone_name: string
  timezone_id: number
  pf: string
}

const calculatePowerFactor = (
  readingValues: MeterReadingFormState[],
  meterId: number,
  timezones: { timezone_id: number; timezone_name: string }[],
  meterProfiles: MeterProfileParameter[]
): PowerFactorData[] => {
  const meterData = readingValues.find((m) => m.meter_id === meterId)
  if (!meterData) {
    return []
  }

  const kwhProfile = meterProfiles.find(
    (p) =>
      p.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )
  const kvahProfile = meterProfiles.find(
    (p) => p.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )

  if (kwhProfile == null || kvahProfile == null) {
    return []
  }

  const kwhParam = meterData.parameters.find(
    (p) => p.meter_parameter_id === kwhProfile.meter_parameter_id
  )
  const kvahParam = meterData.parameters.find(
    (p) => p.meter_parameter_id === kvahProfile.meter_parameter_id
  )

  return timezones?.map((tz) => {
    const kwhReading = kwhParam?.readings.find((r) => r.timezone_id === tz.timezone_id)
    const kvahReading = kvahParam?.readings.find((r) => r.timezone_id === tz.timezone_id)

    const kwhDiff = Number.parseFloat(kwhReading?.values?.value?.toString() ?? '')
    const kvahDiff = Number.parseFloat(kvahReading?.values?.value?.toString() ?? '')

    const pf =
      Number.isNaN(kwhDiff) || Number.isNaN(kvahDiff) || kvahDiff === 0
        ? 'N/A'
        : (kwhDiff / kvahDiff).toFixed(3)

    return {
      timezone_name: tz.timezone_name,
      timezone_id: tz.timezone_id,
      pf,
    }
  })
}
const averagePowerfactor = (
  readingValues: MeterReadingFormState[],
  meterId: number,
  meterProfiles: MeterProfileParameter[]
): number | null => {
  const kwhProfile = meterProfiles.find(
    (p) =>
      p.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )

  const kvahProfile = meterProfiles.find(
    (p) => p.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )

  if (!kwhProfile || !kvahProfile) {
    return null
  }

  let totalKwh = 0
  let totalKvah = 0

  readingValues
    .filter((r) => r.meter_id === meterId)
    .forEach((reading) => {
      reading.parameters.forEach((param) => {
        // kWh
        if (param.meter_parameter_id == kwhProfile.meter_parameter_id) {
          param.readings.forEach((tz) => {
            totalKwh += Number(tz.values?.diff) ?? 0
          })
        }

        // kVAh
        if (param.meter_parameter_id == kvahProfile.meter_parameter_id) {
          param.readings.forEach((tz) => {
            totalKvah += Number(tz.values?.diff) ?? 0
          })
        }
      })
    })

  if (totalKvah === 0) {
    return null
  }

  return Number((totalKwh / totalKvah).toFixed(4))
}

interface Props {
  meterIdx: number
  meterWithTimezoneAndProfile: MeterWithTimezoneAndProfile
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  updateReading: (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => void
  isFirstReading: boolean
  hasMultipleMeters: boolean
  formData: MeterReadingForm
  readingValues: MeterReadingFormState[]
  healthData: MeterHealth[]
  updateMeterHealth: (statusId: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, statusId: number) => void
  activeProfile: { meterIdx: number; profileIdx: number } | null
  setActiveProfile: (
    profile: {
      meterIdx: number
      profileIdx: number
    } | null
  ) => void
  meterHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  setIsOnParameterForm: (value: boolean) => void
  profileRefs: React.MutableRefObject<Record<string, ProfileReadingFormRef | null>>

  setProfileErrorExist: (value: boolean) => void
  setAllProfileHasData: (value: boolean) => void
  filteredMetersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
}

export interface MeterReadingPreviewRef {
  expandAll: () => void
}
const MeterReadingPreview = ({
  meterIdx,
  meterWithTimezoneAndProfile,
  healthData,
  readingValues,
  updateMeterHealth,
  updateCTPTHealth,
  metersWithTimezonesAndProfiles,
  updateReading,
  isFirstReading,
  meterHealthTypes,
  ctHealthTypes,
  setProfileErrorExist,
  setAllProfileHasData,
  filteredMetersWithTimezonesAndProfiles,
}: Props) => {
  const hasImportKwh = meterWithTimezoneAndProfile.reading_parameters.some(
    (p) =>
      p.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )
  const hasImportKvah = meterWithTimezoneAndProfile.reading_parameters.some(
    (p) => p.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )
  const shouldShowPowerFactor = hasImportKwh && hasImportKvah

  const powerFactorData = shouldShowPowerFactor
    ? calculatePowerFactor(
        readingValues,
        meterWithTimezoneAndProfile.meter_id,
        meterWithTimezoneAndProfile.timezones,
        meterWithTimezoneAndProfile.reading_parameters
      )
    : []

  const averagePF = averagePowerfactor(
    readingValues,
    meterWithTimezoneAndProfile.meter_id,
    meterWithTimezoneAndProfile.reading_parameters
  )

  const [openProfiles, setOpenProfiles] = useState<Set<number>>(new Set())
  const allProfileIds = meterWithTimezoneAndProfile.reading_parameters.map(
    (p) => p.meter_parameter_id
  )

  const expandAll = openProfiles.size === allProfileIds.length

  const previewRef = useRef<HTMLDivElement | null>(null)

  const [profileErrors, setProfileErrors] = useState<Record<number, boolean>>({})

  const handleProfileErrorChange = useCallback((parameterId: number, hasError: boolean) => {
    setProfileErrors((prev) => ({
      ...prev,
      [parameterId]: hasError,
    }))
  }, [])

  useEffect(() => {
    const hasAnyError = Object.values(profileErrors).some(Boolean)
    setProfileErrorExist(hasAnyError)
  }, [profileErrors, setProfileErrorExist])

  useEffect(() => {
    const filteredReadingvalues = readingValues?.filter((readingData) =>
      filteredMetersWithTimezonesAndProfiles?.find((m) => m.meter.meter_id === readingData.meter_id)
    )
    const meterReadingData = filteredReadingvalues?.find(
      (readingData) => readingData.meter_id === meterWithTimezoneAndProfile.meter_id
    )

    if (meterReadingData == null) {
      setAllProfileHasData(false)
      return
    }

    const dataExist = meterWithTimezoneAndProfile.reading_parameters.every((profile) => {
      const param = meterReadingData.parameters.find(
        (p) => p.meter_parameter_id === profile.meter_parameter_id
      )

      if (param == null || param.readings?.length === 0) return false
      if (isFirstReading) {
        return param.readings.every(
          (r) =>
            r.values?.initial !== undefined &&
            r.values?.initial !== null &&
            r.values?.initial.toString() !== ''
        )
      }
      return param.readings.every(
        (r) => r.values?.final !== undefined && r.values?.final !== null && r.values?.final !== ''
      )
    })

    setAllProfileHasData(dataExist)
  }, [readingValues, meterWithTimezoneAndProfile, setAllProfileHasData])

  return (
    <div
      key={meterWithTimezoneAndProfile.meter_id}
      className='flex flex-col gap-4'
    >
      <StrongText className='mb-2 block'>
        Meter {meterWithTimezoneAndProfile.meter.meter_serial}
      </StrongText>
      <span className='text-sm text-gray-500'>
        Multiplication Factor: {meterWithTimezoneAndProfile.meter_mf}
      </span>
      <div className='flex flex-col gap-2'>
        {meterHealthTypes && (
          <div className='flex items-center gap-2'>
            <SelectList
              label='Meter Health'
              value={
                healthData.find((m) => m.meter_id === meterWithTimezoneAndProfile.meter_id)
                  ?.meter_health_id ?? ''
              }
              setValue={(value) =>
                updateMeterHealth(Number(value), meterWithTimezoneAndProfile.meter)
              }
              list={meterHealthTypes}
              dataKey='id'
              displayKey='parameter_value'
            />
          </div>
        )}

        <StrongText className='mt-4 mb-2 block'>CT / PT Transformers</StrongText>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          {meterWithTimezoneAndProfile.meter.transformers.map(
            (ctpt: MeterTransformerAssignment) => {
              const existingHealth = healthData
                .find((m) => m.meter_id === meterWithTimezoneAndProfile.meter_id)
                ?.ctpts?.find((c) => c.ctpt_id === ctpt.ctpt?.meter_ctpt_id)?.health

              return (
                <div
                  key={ctpt.ctpt?.meter_ctpt_id}
                  className='rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm'
                >
                  <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                    {/* LEFT SIDE — Same info layout as ConnectionCardSection */}
                    <div className='flex flex-wrap items-center gap-4 text-sm'>
                      <div className='flex items-center gap-1'>
                        <span className='font-medium text-slate-700'>Serial:</span>
                        <span className='text-slate-600'>{ctpt.ctpt?.ctpt_serial ?? 'N/A'}</span>
                      </div>

                      <div className='flex items-center gap-1'>
                        <span className='font-medium text-slate-700'>Type:</span>
                        <span className='text-slate-600'>
                          {ctpt.ctpt?.type?.parameter_value ?? 'N/A'}
                        </span>
                      </div>

                      {ctpt.ctpt?.ratio_primary_value != null &&
                        ctpt.ctpt?.ratio_secondary_value != null && (
                          <div className='flex items-center gap-1'>
                            <span className='font-medium text-slate-700'>Ratio:</span>
                            <span className='text-slate-600'>
                              {ctpt.ctpt?.ratio_primary_value} / {ctpt.ctpt?.ratio_secondary_value}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* RIGHT SIDE — The SelectList for health */}
                    <div className='flex shrink-0 gap-2'>
                      <SelectList
                        label='CT/PT Health'
                        value={existingHealth ?? ''}
                        setValue={(value) =>
                          updateCTPTHealth(
                            meterWithTimezoneAndProfile.meter_id,
                            ctpt.ctpt?.meter_ctpt_id ?? 0,
                            Number(value)
                          )
                        }
                        list={ctHealthTypes}
                        dataKey='id'
                        displayKey='parameter_value'
                      />
                    </div>
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
      <div
        className='p-2'
        ref={previewRef}
      >
        <div
          className='flex justify-end p-5'
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Button
            label={expandAll ? 'Collapse All' : 'Expand All'}
            variant='tertiary'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              if (expandAll) {
                setOpenProfiles(new Set())
              } else {
                setOpenProfiles(new Set(allProfileIds))
              }
              requestAnimationFrame(() => {
                previewRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              })
            }}
          />
        </div>
        <div className='grid gap-4 md:grid-cols-1'>
          {meterWithTimezoneAndProfile.reading_parameters.map((profile, pIdx) => {
            const isOpen = openProfiles.has(profile.meter_parameter_id)

            return (
              <ReadingParameterPreviewCard
                key={profile.meter_parameter_id}
                isOpen={isOpen}
                onToggle={(open) => {
                  setOpenProfiles((prev) => {
                    const next = new Set(prev)
                    if (open) {
                      next.add(profile.meter_parameter_id)
                    } else {
                      next.delete(profile.meter_parameter_id)
                    }
                    return next
                  })
                }}
                meterWithTimezoneAndProfile={meterWithTimezoneAndProfile}
                readingValues={readingValues}
                profile={profile}
                profileIndex={pIdx}
                meterIndex={meterIdx}
                hasError={profileErrors[profile.meter_parameter_id] ?? false}
              >
                <ProfileReadingForm
                  activeProfile={{ meterIdx, profileIdx: pIdx }}
                  metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
                  updateReading={updateReading}
                  readingValues={readingValues}
                  isFirstReading={isFirstReading}
                  onErrorChange={(hasError) =>
                    handleProfileErrorChange(profile.meter_parameter_id, hasError)
                  }
                />
              </ReadingParameterPreviewCard>
            )
          })}
        </div>
      </div>

      {shouldShowPowerFactor && averagePF !== null && (
        <div className='mt-6'>
          <StrongText className='mb-3'>Power Factor</StrongText>
          <PowerFactorBar
            powerFactorsByMeter={{ factors: powerFactorData }}
            meterId={meterWithTimezoneAndProfile.meter_id}
            averagePF={averagePF}
          />
        </div>
      )}
    </div>
  )
}

export default MeterReadingPreview
