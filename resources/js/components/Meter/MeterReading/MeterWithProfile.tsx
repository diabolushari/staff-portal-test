import { Meter, MeterTransformer, meterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import MeterReadingValueTooltip from './MeterReadingValueTooltip'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { ParameterValues } from '@/interfaces/parameter_types'
import SelectList from '@/ui/form/SelectList'
import { number } from 'framer-motion'

interface Props {
  meterIdx: number
  meterWithTimezoneAndProfile: meterWithTimezoneAndProfile
  formData: any
  updateMeterHealth: (value: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, healthId: number, meter: Meter) => void
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
  formData,
  updateMeterHealth,
  updateCTPTHealth,
  setActiveProfile,
  meterHealthTypes,
  ctHealthTypes,
}: Props) {
  console.log(meterWithTimezoneAndProfile)
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
              formData.meter_health.find(
                (m: any) => m.meter_id === meterWithTimezoneAndProfile.meter_id
              )?.meter_health_id ?? ''
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
                formData.meter_health
                  .find((m: any) => m.meter_id === meterWithTimezoneAndProfile.meter_id)
                  ?.ctpts?.find((c: any) => c.ctpt_id === ctpt.meter_ctpt_id)?.health ?? ''
              }
              setValue={(value) =>
                updateCTPTHealth(
                  meterWithTimezoneAndProfile.meter_id,
                  ctpt.meter_ctpt_id,
                  Number(value),
                  meterWithTimezoneAndProfile.meter
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
        {meterWithTimezoneAndProfile?.meter_profiles?.map((profile: any, pIdx: number) => {
          const meterData = formData.readings_by_meter?.find(
            (m: any) => m.meter_id === meterWithTimezoneAndProfile.meter_id
          )
          const paramData = meterData?.parameters?.find(
            (p: any) => p.meter_parameter_id === profile.meter_parameter_id
          )
          const hasData = paramData?.readings?.some((r: any) => r.values?.final || r.values?.diff)

          return (
            <Card
              key={profile.meter_parameter_id}
              className={`hover:ring-primary relative cursor-pointer p-4 transition-all hover:ring-2 ${
                hasData ? 'border-green-500 shadow-md' : ''
              }`}
              onClick={() => setActiveProfile({ meterIdx, profileIdx: pIdx })}
            >
              <StrongText>
                {profile.display_name} {profile.is_export ? '(Export)' : ''}
              </StrongText>

              <div
                className={`mt-2 space-y-1 text-sm text-gray-600 ${
                  meterWithTimezoneAndProfile.timezones.length > 2
                    ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent max-h-[60px] overflow-y-auto pr-1'
                    : ''
                }`}
                style={{ scrollBehavior: 'smooth' }}
              >
                {paramData?.readings?.map((r: any) => {
                  const diff = r.values?.diff
                  return (
                    diff && (
                      <div
                        key={r.timezone_id}
                        className='flex justify-between border-b border-gray-100 py-1 last:border-0'
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
                  <Info className='absolute top-2 right-2 h-5 w-5 text-gray-400 hover:text-gray-600' />
                </TooltipTrigger>
                <TooltipContent
                  side='top'
                  className='bg-white'
                >
                  <MeterReadingValueTooltip
                    meterId={meterWithTimezoneAndProfile.meter_id}
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
  )
}
