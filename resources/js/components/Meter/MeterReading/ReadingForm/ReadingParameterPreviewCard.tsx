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
        className={`mt-2 space-y-1 text-sm text-gray-600 ${
          meterWithTimezoneAndProfile?.timezones?.length > 2
            ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1'
            : ''
        }`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {paramData?.readings?.map((r) => {
          const diff = r.values?.diff
          return (
            <div
              key={r.timezone_id}
              className='flex justify-between border-b border-gray-100 py-1 last:border-0'
            >
              <span>{r.timezone_name}</span>
              <span className='font-medium text-gray-800'>{diff}</span>
            </div>
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
            readingsByMeter={readingValues}
            profile={profile}
          />
        </TooltipContent>
      </Tooltip>
    </Card>
  )
}
