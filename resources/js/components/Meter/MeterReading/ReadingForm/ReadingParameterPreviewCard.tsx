import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MeterProfileParameter, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'
import MeterReadingValueTooltip from '../MeterReadingValueTooltip'
import { MeterReadingFormState } from './useMeterReadingForm'

interface Props {
  meterWithTimezoneAndProfile: MeterWithTimezoneAndProfile
  readingValues: MeterReadingFormState[]
  profile: MeterProfileParameter
  profileIndex: number
  meterIndex: number
  setActiveProfile: (
    profile: {
      meterIdx: number
      profileIdx: number
    } | null
  ) => void
}

export default function ReadingParameterPreviewCard({
  meterWithTimezoneAndProfile,
  readingValues,
  profile,
  profileIndex,
  meterIndex,
  setActiveProfile,
}: Readonly<Props>) {
  const meterData = readingValues?.find((m) => m.meter_id === meterWithTimezoneAndProfile.meter_id)
  const paramData = meterData?.parameters?.find(
    (p) => p.meter_parameter_id === profile.meter_parameter_id
  )
  const hasData = paramData?.readings?.some((r) => r.values?.final || r.values?.diff)
  const totalValue =
    profile.is_cumulative && paramData?.readings?.length
      ? paramData.readings.reduce((sum, r) => {
          return sum + Number(r.values?.value ?? 0)
        }, 0)
      : null
  return (
    <Card
      key={profile.meter_parameter_id}
      className={`hover:ring-primary relative cursor-pointer p-4 transition-all hover:ring-2 ${
        hasData ? 'border-green-500 shadow-md' : ''
      }`}
      onClick={() => setActiveProfile({ meterIdx: meterIndex, profileIdx: profileIndex })}
    >
      <div className='flex items-center gap-2'>
        <StrongText>{profile.display_name}</StrongText>
        <Badge
          variant='secondary'
          className='text-xs'
        >
          {profile.is_export ? 'Export' : 'Import'}
        </Badge>
      </div>
      <div
        className={`mt-2 text-sm text-gray-600 ${
          meterWithTimezoneAndProfile?.timezones?.length > 2
            ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1'
            : ''
        }`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {profile.is_cumulative ? (
          <>
            {/* Header */}
            <div className='grid grid-cols-4 gap-2 border-b border-gray-200 pb-1 font-medium text-gray-700'>
              <span></span>
              <span className='text-right'>IR</span>
              <span className='text-right'>FR</span>
              <span className='text-right'>DIFF x MF</span>
            </div>
            {/* Rows */}
            {paramData?.readings?.map((r) => {
              return (
                <div
                  key={r.timezone_id}
                  className='grid grid-cols-4 gap-2 border-b border-gray-100 py-1 last:border-0'
                >
                  <span>{r.timezone_name}</span>

                  <span className='text-right font-medium text-gray-800'>
                    {r.values?.initial || 0}
                  </span>

                  <span className='text-right font-medium text-gray-800'>
                    {r.values?.final || 0}
                  </span>

                  <span className='text-right font-medium'>
                    {r.values?.value !== undefined && r.values?.value !== null
                      ? Number(r.values.value).toFixed(2)
                      : 0}
                  </span>
                </div>
              )
            })}
            {profile.is_cumulative && totalValue !== null && (
              <div className='mt-2 grid grid-cols-4 gap-2 pt-2 font-semibold text-gray-800'>
                <span>Total</span>

                <span className='text-right'></span>
                <span className='text-right'></span>

                <span className='text-right'>{totalValue.toFixed(2) || '-'}</span>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Header */}
            <div className='grid grid-cols-3 gap-2 border-b border-gray-200 pb-1 font-medium text-gray-700'>
              <span></span>
              <span className='text-right'>FR</span>
              <span className='text-right'>DIFF x MF</span>
            </div>
            {/* Rows */}
            {paramData?.readings?.map((r) => {
              return (
                <div
                  key={r.timezone_id}
                  className='grid grid-cols-3 gap-2 border-b border-gray-100 py-1 last:border-0'
                >
                  <span>{r.timezone_name}</span>

                  <span className='text-right font-medium text-gray-800'>
                    {r.values?.final || 0}
                  </span>

                  <span className='text-right font-medium'>
                    {r.values?.value !== undefined && r.values?.value !== null
                      ? Number(r.values.value).toFixed(2)
                      : 0}
                  </span>
                </div>
              )
            })}
          </>
        )}
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
            readingsByMeter={readingValues}
            profile={profile}
          />
        </TooltipContent>
      </Tooltip>
    </Card>
  )
}
