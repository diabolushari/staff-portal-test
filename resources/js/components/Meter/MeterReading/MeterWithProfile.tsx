import { Meter, MeterTransformer, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import StrongText from '@/typography/StrongText'
import SelectList from '@/ui/form/SelectList'
import ReadingParameterPreviewCard from './ReadingForm/ReadingParameterPreviewCard'
import { MeterHealth } from './ReadingForm/useMeterHealthForm'
import { MeterReadingFormState } from './ReadingForm/useMeterReadingForm'

interface Props {
  meterIdx: number
  meterWithTimezoneAndProfile: MeterWithTimezoneAndProfile
  formData: MeterReadingForm
  readingValues: MeterReadingFormState[]
  healthData: MeterHealth[]
  updateMeterHealth: (statusId: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, statusId: number) => void
  setActiveProfile: (
    profile: {
      meterIdx: number
      profileIdx: number
    } | null
  ) => void
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
}

export default function MeterWithProfile({
  meterIdx,
  meterWithTimezoneAndProfile,
  healthData,
  readingValues,
  updateMeterHealth,
  updateCTPTHealth,
  setActiveProfile,
  meterHealthTypes,
  ctHealthTypes,
}: Readonly<Props>) {
  return (
    <div
      key={meterWithTimezoneAndProfile.meter_id}
      className='flex flex-col gap-4'
    >
      <StrongText className='mb-2 block'>
        Meter {meterWithTimezoneAndProfile.meter.meter_serial}
      </StrongText>
      <div className='flex gap-2'>
        {meterHealthTypes && (
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
        )}

        {meterWithTimezoneAndProfile.meter.transformers.map((ctpt: MeterTransformer) => (
          <div
            key={ctpt.meter_ctpt_id}
            className='mb-2 flex items-center gap-4'
          >
            <SelectList
              label={`CT/PT Health ${ctpt.ctpt_serial}`}
              value={
                healthData
                  .find((m) => m.meter_id === meterWithTimezoneAndProfile.meter_id)
                  ?.ctpts?.find((c) => c.ctpt_id === ctpt.meter_ctpt_id)?.health ?? ''
              }
              setValue={(value) =>
                updateCTPTHealth(
                  meterWithTimezoneAndProfile.meter_id,
                  ctpt.meter_ctpt_id,
                  Number(value)
                )
              }
              list={ctHealthTypes}
              dataKey='id'
              displayKey='parameter_value'
            />
          </div>
        ))}
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {meterWithTimezoneAndProfile?.meter_profiles?.map((profile, pIdx: number) => (
          <ReadingParameterPreviewCard
            key={profile.meter_parameter_id}
            meterWithTimezoneAndProfile={meterWithTimezoneAndProfile}
            readingValues={readingValues}
            profile={profile}
            profileIndex={pIdx}
            meterIndex={meterIdx}
            setActiveProfile={setActiveProfile}
          />
        ))}
      </div>
    </div>
  )
}
