import { Meter, MeterReading, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import React, { useEffect, useMemo, useState } from 'react'
import MeterReadingPreview from './MeterReadingPreview'
import ProfileReadingForm from './ProfileReadingForm'
import { MeterHealth } from './ReadingForm/useMeterHealthForm'
import { MeterReadingFormState, TimezoneReadingState } from './ReadingForm/useMeterReadingForm'
import Button from '@/ui/button/Button'

interface Props {
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  formData: MeterReadingForm
  healthData: MeterHealth[]
  setFormValue: (
    key: keyof MeterReadingForm
  ) => (value: MeterReadingForm[keyof MeterReadingForm]) => void
  setIsOnParameterForm: (value: boolean) => void
  latestMeterReading: MeterReading
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
  readingValues: MeterReadingFormState[]
  updateReading: (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => void
  updateMeterHealth: (meterHealthId: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, healthId: number) => void
  isFirstReading: boolean
  isOnparameterForm: boolean
}

export default function MeterReadingsStep({
  metersWithTimezonesAndProfiles,
  formData,
  updateMeterHealth,
  updateCTPTHealth,
  meterHealthTypes,
  ctptHealthTypes,
  ctHealthTypes,
  ptHealthTypes,
  readingValues,
  updateReading,
  healthData,
  setIsOnParameterForm,
  isOnparameterForm,
  isFirstReading,
}: Readonly<Props>) {
  const isSingleMeter = metersWithTimezonesAndProfiles.length === 1

  const [activeMeterIdx, setActiveMeterIdx] = useState<number | null>(isSingleMeter ? 0 : null)
  const [hasMultipleMeters, setHasMultipleMeters] = useState<boolean>(
    metersWithTimezonesAndProfiles.length > 1
  )

  const [activeProfile, setActiveProfile] = useState<{
    meterIdx: number
    profileIdx: number
  } | null>(null)

  useEffect(() => {
    if (hasMultipleMeters) {
      setIsOnParameterForm(true)
    } else {
      setIsOnParameterForm(activeProfile !== null)
    }
  }, [activeProfile, setIsOnParameterForm])

  const metersToRender = useMemo(() => {
    if (isSingleMeter) {
      return metersWithTimezonesAndProfiles.map((m, idx) => ({
        meter: m,
        meterIdx: idx,
      }))
    }

    if (activeMeterIdx !== null) {
      return [
        {
          meter: metersWithTimezonesAndProfiles[activeMeterIdx],
          meterIdx: activeMeterIdx,
        },
      ]
    }

    return []
  }, [isSingleMeter, activeMeterIdx, metersWithTimezonesAndProfiles])

  useEffect(() => {
    setIsOnParameterForm(false)
  }, [])

  return (
    <div className='flex flex-col gap-6'>
      {/* ---------- MULTIPLE METERS : SELECTOR ---------- */}
      {!isSingleMeter && activeMeterIdx === null && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {metersWithTimezonesAndProfiles?.map((meter, idx) => (
            <div
              key={meter.meter_id}
              className='hover:bg-muted cursor-pointer rounded-xl border p-4 transition'
              onClick={() => {
                setActiveMeterIdx(idx)
                setIsOnParameterForm(true)
              }}
            >
              <div className='font-semibold'>
                Meter #{meter?.meter?.meter_serial ?? meter?.meter_id}
              </div>
              <div className='text-muted-foreground text-sm'>
                {' '}
                Meter MF: {meter?.meter?.meter_mf}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- BACK TO METER LIST ---------- */}
      {!isSingleMeter && activeMeterIdx !== null && activeProfile === null && (
        <div>
          <Button
            variant='secondary'
            label='Back to meters'
            onClick={() => {
              setActiveMeterIdx(null)
              setIsOnParameterForm(false)
            }}
          />
        </div>
      )}

      {/* ---------- PREVIEW + PROFILE FOR SELECTED METER ---------- */}
      {metersToRender?.map(({ meter, meterIdx }) => (
        <React.Fragment key={meter.meter_id}>
          {(!activeProfile || activeProfile.meterIdx !== meterIdx) && (
            <MeterReadingPreview
              healthData={healthData}
              meterHealthTypes={meterHealthTypes}
              ctptHealthTypes={ctptHealthTypes}
              ctHealthTypes={ctHealthTypes}
              ptHealthTypes={ptHealthTypes}
              updateMeterHealth={updateMeterHealth}
              updateCTPTHealth={updateCTPTHealth}
              meterIdx={meterIdx}
              meterWithTimezoneAndProfile={meter}
              formData={formData}
              readingValues={readingValues}
              setActiveProfile={setActiveProfile}
            />
          )}

          {activeProfile && activeProfile.meterIdx === meterIdx && (
            <ProfileReadingForm
              activeProfile={activeProfile}
              metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
              updateReading={updateReading}
              readingValues={readingValues}
              setActiveProfile={setActiveProfile}
              isFirstReading={isFirstReading}
              hasMultipleMeters={hasMultipleMeters}
              setIsOnParameterForm={setIsOnParameterForm}
            />
          )}
          {hasMultipleMeters && activeProfile === null && (
            <div className='flex justify-between'>
              <Button
                variant='secondary'
                label='Cancel'
                onClick={() => {
                  setActiveMeterIdx(null)
                  setIsOnParameterForm(false)
                }}
              />
              <Button
                variant='primary'
                label='Update'
                onClick={() => {
                  setActiveMeterIdx(null)
                  setIsOnParameterForm(false)
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
