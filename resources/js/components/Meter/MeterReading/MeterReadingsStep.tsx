import { Meter, MeterReading, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import React, { useState } from 'react'
import MeterWithProfile from './MeterWithProfile'
import ProfileReadingForm from './ProfileReadingForm'
import { MeterHealth } from './ReadingForm/useMeterHealthForm'
import { MeterReadingFormState } from './ReadingForm/useMeterReadingForm'

interface Props {
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  formData: MeterReadingForm
  healthData: MeterHealth[]
  setFormValue: (
    key: keyof MeterReadingForm
  ) => (value: MeterReadingForm[keyof MeterReadingForm]) => void
  latestMeterReading: MeterReading
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
  readingValues: MeterReadingFormState[]
  updateReading: (meterId: number, parameterId: number, timezoneId: number, value: string) => void
  updateMeterHealth: (meterHealthId: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, healthId: number) => void
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
}: Readonly<Props>) {
  const [activeProfile, setActiveProfile] = useState<{
    meterIdx: number
    profileIdx: number
  } | null>(null)

  return (
    <div className='flex flex-col gap-6'>
      {metersWithTimezonesAndProfiles.map((meter, mIdx) => (
        <React.Fragment key={meter.meter_id}>
          {(!activeProfile || activeProfile.meterIdx !== mIdx) && (
            <MeterWithProfile
              healthData={healthData}
              meterHealthTypes={meterHealthTypes}
              ctptHealthTypes={ctptHealthTypes}
              ctHealthTypes={ctHealthTypes}
              ptHealthTypes={ptHealthTypes}
              updateMeterHealth={updateMeterHealth}
              updateCTPTHealth={updateCTPTHealth}
              meterIdx={mIdx}
              meterWithTimezoneAndProfile={meter}
              formData={formData}
              readingValues={readingValues}
              setActiveProfile={setActiveProfile}
            />
          )}
          {activeProfile && activeProfile.meterIdx === mIdx && (
            <ProfileReadingForm
              activeProfile={activeProfile}
              metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
              updateReading={updateReading}
              readingValues={readingValues}
              setActiveProfile={setActiveProfile}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
