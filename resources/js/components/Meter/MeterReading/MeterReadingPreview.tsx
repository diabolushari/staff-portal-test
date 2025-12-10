import {
  Meter,
  MeterProfileParameter,
  MeterTransformer,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'
import StrongText from '@/typography/StrongText'
import SelectList from '@/ui/form/SelectList'
import PowerFactorBar from './MeterPowerFactor'
import ReadingParameterPreviewCard from './ReadingForm/ReadingParameterPreviewCard'
import { MeterHealth } from './ReadingForm/useMeterHealthForm'
import { MeterReadingFormState } from './ReadingForm/useMeterReadingForm'

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

  return timezones.map((tz) => {
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

const calculateAveragePF = (powerFactors: PowerFactorData[]): string | null => {
  const allValid = powerFactors.every((pf) => pf.pf !== 'N/A')

  if (!allValid) {
    return null
  }

  const sum = powerFactors.reduce((acc, pf) => acc + Number.parseFloat(pf.pf), 0)
  const average = sum / powerFactors.length

  return average.toFixed(3)
}

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

export default function MeterReadingPreview({
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
  console.log(meterWithTimezoneAndProfile.meter_profiles)

  const hasImportKwh = meterWithTimezoneAndProfile.meter_profiles.some(
    (p) =>
      p.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )
  const hasImportKvah = meterWithTimezoneAndProfile.meter_profiles.some(
    (p) => p.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )
  const shouldShowPowerFactor = hasImportKwh && hasImportKvah

  const powerFactorData = shouldShowPowerFactor
    ? calculatePowerFactor(
        readingValues,
        meterWithTimezoneAndProfile.meter_id,
        meterWithTimezoneAndProfile.timezones,
        meterWithTimezoneAndProfile.meter_profiles
      )
    : []

  console.log(powerFactorData)

  const averagePF = powerFactorData.length > 0 ? calculateAveragePF(powerFactorData) : null

  return (
    <div
      key={meterWithTimezoneAndProfile.meter_id}
      className='flex flex-col gap-4'
    >
      <StrongText className='mb-2 block'>
        Meter {meterWithTimezoneAndProfile.meter.meter_serial}
      </StrongText>
      <span className='text-sm text-gray-500'>
        Multiplication Factor: {meterWithTimezoneAndProfile.meter.meter_mf}
      </span>
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
              label={`CT/PT Health ${ctpt.ctpt_serial} ${ctpt.type?.parameter_value}`}
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

      {shouldShowPowerFactor && (
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
