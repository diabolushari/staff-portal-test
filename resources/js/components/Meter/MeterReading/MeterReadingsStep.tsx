import React, { useEffect, useState } from 'react'
import { Meter, MeterReading, meterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import MeterWithProfile from './MeterWithProfile'
import ProfileReadingForm from './ProfileReadingForm'
import { ParameterValues } from '@/interfaces/parameter_types'

interface Props {
  metersWithTimezonesAndProfiles: meterWithTimezoneAndProfile[]
  formData: any
  setFormValue: (key: string) => (value: any) => void
  latestMeterReading: MeterReading
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
  updateMeterHealth: (meterHealthId: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, healthId: number, meter: Meter) => void
}

export default function MeterReadingsStep({
  metersWithTimezonesAndProfiles,
  formData,
  setFormValue,
  latestMeterReading,
  updateMeterHealth,
  updateCTPTHealth,
  meterHealthTypes,
  ctptHealthTypes,
  ctHealthTypes,
  ptHealthTypes,
}: Readonly<Props>) {
  const [activeProfile, setActiveProfile] = useState<{
    meterIdx: number
    profileIdx: number
  } | null>(null)

  const getPrevFinal = (meterId: number, parameterId: number, timezoneId: number, latest: any) => {
    return (
      latest?.values?.find(
        (v: any) =>
          v.meter_id === meterId && v.parameter_id === parameterId && v.timezone_id === timezoneId
      )?.final_reading ?? 0
    )
  }

  useEffect(() => {
    if (Array.isArray(formData.readings_by_meter) && formData.readings_by_meter.length > 0) {
      return
    }
    const initializedMeters = metersWithTimezonesAndProfiles.map((meter) => ({
      meter_id: meter.meter_id,
      parameters: meter.meter_profiles.map((profile: any) => ({
        meter_parameter_id: profile.meter_parameter_id,
        display_name: profile.display_name,
        readings: meter.timezones.map((tz: any) => ({
          timezone_id: tz.timezone_id,
          timezone_name: tz.timezone_name,
          values: {
            initial:
              getPrevFinal(
                meter.meter_id,
                profile.meter_parameter_id,
                tz.timezone_id,
                latestMeterReading
              ) ?? 0,
            final: '',
            diff: '',
            mf: '',
          },
        })),
      })),
    }))
    setFormValue('readings_by_meter')(initializedMeters)
  }, [])

  const updateReading = (
    meterId: number,
    meterParameterId: number,
    timezoneId: number,
    rowKey: string,
    value: any,
    meter: Meter
  ) => {
    const updatedMeters = formData.readings_by_meter.map((m: any) => {
      if (m.meter_id !== meterId) return m
      return {
        ...m,
        parameters: m.parameters.map((p: any) => {
          if (p.meter_parameter_id !== meterParameterId) return p
          return {
            ...p,
            readings: p.readings.map((r: any) => {
              if (r.timezone_id !== timezoneId) return r
              const newValues = { ...r.values, [rowKey]: value }
              const initial = parseFloat(newValues.initial || 0)
              const final = parseFloat(newValues.final || 0)
              newValues.diff = (final - initial).toString()
              newValues.mf = (final - initial) * (meter.meter_mf || 1)
              return { ...r, values: newValues }
            }),
          }
        }),
      }
    })
    setFormValue('readings_by_meter')(updatedMeters)
  }

  return (
    <div className='flex flex-col gap-6'>
      {metersWithTimezonesAndProfiles.map((meter, mIdx) => (
        <React.Fragment key={meter.meter_id}>
          {(!activeProfile || activeProfile.meterIdx !== mIdx) && (
            <MeterWithProfile
              meterHealthTypes={meterHealthTypes}
              ctptHealthTypes={ctptHealthTypes}
              ctHealthTypes={ctHealthTypes}
              ptHealthTypes={ptHealthTypes}
              updateMeterHealth={updateMeterHealth}
              updateCTPTHealth={updateCTPTHealth}
              meterIdx={mIdx}
              meterWithTimezoneAndProfile={meter}
              formData={formData}
              setActiveProfile={setActiveProfile}
            />
          )}
          {activeProfile && activeProfile.meterIdx === mIdx && (
            <ProfileReadingForm
              activeProfile={activeProfile}
              metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
              formData={formData}
              updateReading={updateReading}
              setActiveProfile={setActiveProfile}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
