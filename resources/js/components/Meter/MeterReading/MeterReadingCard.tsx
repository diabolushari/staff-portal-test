import { Card } from '@/components/ui/card'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  Meter,
  MeterConnectionMapping,
  MeterReading,
  MeterReadingValue,
} from '@/interfaces/data_interfaces'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'
import NormalText from '@/typography/NormalText'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import { router } from '@inertiajs/react'
import { useMemo } from 'react'

interface MeterWithConnection {
  meter: Meter
  priority: number
  relationship: MeterConnectionMapping
}

interface Props {
  meterReading: MeterReading
  meters: MeterWithConnection[]
}

export default function MeterReadingCard({ meterReading, meters }: Readonly<Props>) {
  const meterSummaries = useMemo(() => {
    return meters.map((meterWithConn) => {
      const meter = meterWithConn.meter

      const filteredValues =
        meterReading?.values?.filter((v: MeterReadingValue) => v.meter_id === meter?.meter_id) || []

      const kvaValues = filteredValues.filter(
        (v) => v.meter_profile_parameter?.name.toLowerCase() == DEMAND_PARAMETER_NAME.toLowerCase()
      )
      let kvaMax = null
      if (kvaValues.length > 0) {
        kvaMax = kvaValues.reduce(
          (max: MeterReadingValue | null, curr: MeterReadingValue | null) => {
            return (curr?.final_reading ?? 0) > (max?.final_reading ?? 0) ? curr : max
          },
          null
        )
      }

      const kwhSum = filteredValues
        .filter(
          (v) =>
            v.meter_profile_parameter?.name.toLowerCase() ===
            CONSUMPTION_PARAMETER_NAME.toLowerCase()
        )
        .reduce((sum, v) => sum + (v.final_reading ?? 0), 0)

      return {
        meterId: meter?.meter_id,
        serial: meter?.meter_serial,
        meterProfile: meter?.meter_profile,
        kva: kvaMax
          ? {
              value: kvaMax.final_reading ?? 0,
              timezone: kvaMax.time_zone?.parameter_value,
            }
          : null,
        kwhSum,
      }
    })
  }, [meterReading, meters])

  return (
    <Card className='mb-4 p-4'>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <StrongText className='mb-2 text-lg font-semibold'>
            Meter Reading: {meterReading?.metering_date}
          </StrongText>
          <NormalText>
            {meterReading?.reading_start_date} to {meterReading?.reading_end_date}
          </NormalText>
        </div>
        <Button
          onClick={() =>
            router.visit(
              `/meter-reading/${meterReading.id}?connection_id=${meterReading.connection_id}`
            )
          }
          label='View'
        />
      </div>
      <div className='mt-4 space-y-4'>
        {meterSummaries.map((summary) => (
          <div
            key={summary.meterId}
            className='rounded-lg border bg-gray-50 p-3'
          >
            <StrongText className='text-md font-semibold'>
              Meter Serial: {summary.serial}({summary.meterProfile?.parameter_value})
            </StrongText>

            <div className='mt-1 text-sm text-gray-700'>
              {summary.kva ? (
                <p>
                  <b>KVA (highest):</b> {summary.kva.value} at timezone {summary.kva.timezone}
                </p>
              ) : (
                <p>No KVA data available</p>
              )}
              <p>
                <b>KWH (sum):</b> {summary.kwhSum}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
