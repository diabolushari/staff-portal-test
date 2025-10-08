import { Card } from '@/components/ui/card'
import StrongText from '@/typography/StrongText'
import { useState, useEffect } from 'react'
import MeterReadingValueForm from './MeterReadingValueForm'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import MeterReadingValueTooltip from './MeterReadingValueTooltip'

interface Props {
  metersWithTimezonesAndProfiles: any[]
  formData: any
  setFormValue: (key: string) => (value: any) => void
  latestMeterReading: any
}

export default function MeterReadingsStep({
  metersWithTimezonesAndProfiles,
  formData,
  setFormValue,
  latestMeterReading,
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

  // Initialize readings structure if empty
  useEffect(() => {
    if (!Array.isArray(formData.readings_by_meter) || formData.readings_by_meter.length > 0) {
      return // ✅ prevent reinitialization
    }

    const initializedMeters = metersWithTimezonesAndProfiles.map((meter) => ({
      meter_id: meter.meter_id,
      parameters: meter.meter_profile.map((profile: any) => ({
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
          },
        })),
      })),
    }))

    setFormValue('readings_by_meter')(initializedMeters)
  }, []) // ✅ run only once

  // Update reading in new structure
  const updateReading = (
    meterId: number,
    meterParameterId: number,
    timezoneId: number,
    rowKey: string,
    value: any
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

              // Recalculate diff automatically
              const initial = parseFloat(newValues.initial || 0)
              const final = parseFloat(newValues.final || 0)
              newValues.diff = (final - initial).toString()

              return { ...r, values: newValues }
            }),
          }
        }),
      }
    })

    setFormValue('readings_by_meter')(updatedMeters)
  }

  // Edit profile mode
  if (activeProfile !== null) {
    const meter = metersWithTimezonesAndProfiles[activeProfile.meterIdx]
    const profile = meter.meter_profile[activeProfile.profileIdx]
    const meterData = formData.readings_by_meter.find((m: any) => m.meter_id === meter.meter_id)
    const paramData = meterData?.parameters.find(
      (p: any) => p.meter_parameter_id === profile.meter_parameter_id
    )

    return (
      <div className='flex flex-col gap-4'>
        <Card className='p-4'>
          <StrongText>{profile.display_name}</StrongText>

          <MeterReadingValueForm
            timeZoneNames={meter.timezones.map((tz: any) => ({
              id: tz.timezone_id,
              name: tz.timezone_name,
            }))}
            values={paramData?.readings || []}
            onChange={(rowKey, tzId, val) =>
              updateReading(meter.meter_id, profile.meter_parameter_id, tzId, rowKey, val)
            }
          />

          <div className='mt-4 flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => setActiveProfile(null)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={() => setActiveProfile(null)}
            >
              Save
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Default card view
  return (
    <div className='flex flex-col gap-6'>
      {metersWithTimezonesAndProfiles.map((meter, mIdx) => (
        <div key={meter.meter_id}>
          <StrongText className='mb-2 block'>
            {`Meter ${meter.meter_id} — ${meter.meter_timezone_type}`}
          </StrongText>
          <div className='grid gap-4 md:grid-cols-2'>
            {meter.meter_profile.map((profile: any, pIdx: number) => {
              const meterData = formData.readings_by_meter?.find(
                (m: any) => m.meter_id === meter.meter_id
              )
              const paramData = meterData?.parameters.find(
                (p: any) => p.meter_parameter_id === profile.meter_parameter_id
              )

              return (
                <Card
                  key={profile.meter_parameter_id}
                  className='hover:ring-primary relative cursor-pointer p-4 hover:ring-2'
                  onClick={() => setActiveProfile({ meterIdx: mIdx, profileIdx: pIdx })}
                >
                  <StrongText>{profile.display_name}</StrongText>

                  <div className='mt-2 space-y-1 text-sm text-gray-600'>
                    {paramData?.readings?.map((r: any) => {
                      const diff = r.values?.diff
                      return (
                        diff && (
                          <div
                            key={r.timezone_id}
                            className='flex justify-between'
                          >
                            <span>{r.timezone_name}</span>
                            <span className='font-medium text-gray-800'>{diff}</span>
                          </div>
                        )
                      )
                    })}
                  </div>

                  <Tooltip>
                    <TooltipTrigger>
                      <Info className='absolute top-2 right-2 h-8 w-8 text-gray-400 hover:text-gray-600' />
                    </TooltipTrigger>
                    <TooltipContent
                      side='top'
                      className='bg-white'
                    >
                      <MeterReadingValueTooltip
                        meterId={meter.meter_id}
                        readingsByMeter={formData.readings_by_meter}
                        parameterId={profile.meter_parameter_id}
                      />
                    </TooltipContent>
                  </Tooltip>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
