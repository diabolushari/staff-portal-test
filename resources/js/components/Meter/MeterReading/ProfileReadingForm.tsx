import { Card } from '@/components/ui/card'
import { MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import { useMemo } from 'react'
import MeterReadingValueForm from './MeterReadingValueForm'
import { MeterReadingFormState } from './ReadingForm/useMeterReadingForm'

interface Props {
  activeProfile: {
    meterIdx: number
    profileIdx: number
  } | null
  readingValues: MeterReadingFormState[]
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  updateReading: (meterId: number, parameterId: number, timezoneId: number, value: string) => void
  setActiveProfile: (profile: { meterIdx: number; profileIdx: number } | null) => void
  toggleRotation: (
    meterId: number,
    parameterId: number,
    timezoneId: number,
    checked: boolean
  ) => void
}

export default function ProfileReadingForm({
  activeProfile,
  readingValues,
  metersWithTimezonesAndProfiles,
  updateReading,
  setActiveProfile,
  toggleRotation,
}: Readonly<Props>) {
  const { meter, profile, parameterData } = useMemo(() => {
    if (activeProfile == null) {
      return {
        meter: null,
        profile: null,
        parameterData: null,
      }
    }

    const meter = metersWithTimezonesAndProfiles[activeProfile.meterIdx]
    const profile = meter.meter_profiles[activeProfile.profileIdx]

    const meterReadingData = readingValues.find((m) => m.meter_id === meter.meter_id)
    const parameterData = meterReadingData?.parameters.find(
      (p) => p.meter_parameter_id === profile.meter_parameter_id
    )

    return {
      meter,
      profile,
      parameterData,
    }
  }, [activeProfile, readingValues, metersWithTimezonesAndProfiles])

  return (
    <>
      {meter == null || profile == null || parameterData == null ? null : (
        <div className='flex flex-col gap-4'>
          <Card className='p-4'>
            <StrongText>{profile?.display_name}</StrongText>
            <div
              className={`mt-2 ${
                parameterData?.readings?.length > 2 ? 'overflow-y-auto pr-2' : ''
              }`}
            >
              <MeterReadingValueForm
                values={parameterData?.readings || []}
                onChange={(tzId, val) =>
                  updateReading(meter.meter_id, profile.meter_parameter_id, tzId, val)
                }
                onToggleRotation={(tzId, checked) =>
                  toggleRotation(meter.meter_id, profile.meter_parameter_id, tzId, checked)
                }
                meter={meter.meter}
                profileParameter={profile}
              />
            </div>

            <div className='mt-4 flex justify-end gap-2'>
              <Button
                variant='secondary'
                onClick={() => setActiveProfile(null)}
                label='Cancel'
              />
              <Button
                onClick={() => setActiveProfile(null)}
                label='Save'
              />
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
