import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import StrongText from '@/typography/StrongText'
import { Meter, MeterReading } from '@/interfaces/data_interfaces'

interface Props {
  meterReadings: MeterReading[]
  meter: Meter
}

export default function MeterReadingCard({ meterReadings, meter }: Props) {
  const readingsForMeter = useMemo(() => {
    return meterReadings.filter((reading) =>
      reading.values.some((value) => value.meter_id === meter.meter_id)
    )
  }, [meterReadings, meter.meter_id])

  const processedReadings = useMemo(() => {
    const isMainProfile = meter.meter_profile?.parameter_value?.toLowerCase().includes('main')

    return readingsForMeter.map((reading, idx) => {
      const meterValues = reading.values.filter((value) => value.meter_id === meter.meter_id)

      if (isMainProfile) {
        const kwhValues = meterValues
          .filter((v) => v.meter_profile_parameter?.name === 'kWh')
          .map((v) => v.final_reading ?? 0)

        const kvaValues = meterValues
          .filter((v) => v.meter_profile_parameter?.name === 'kVAh')
          .map((v) => v.final_reading ?? 0)

        const kwhMax = kwhValues.length ? Math.max(...kwhValues) : 0
        const kvaSum = kvaValues.reduce((sum, val) => sum + val, 0)

        return {
          id: reading.id,
          index: idx + 1,
          date: reading.metering_date,
          type: 'main',
          kwhMax,
          kvaSum,
        }
      } else {
        return {
          id: reading.id,
          index: idx + 1,
          date: reading.metering_date,
          type: 'other',
          values: meterValues.map((v) => ({
            name: v.meter_profile_parameter?.name,
            value: v.final_reading ?? 0,
          })),
        }
      }
    })
  }, [readingsForMeter, meter.meter_id, meter.meter_profile])

  return (
    <Card className='mb-4 p-4'>
      <StrongText className='mb-2 text-lg font-semibold'>
        Meter Serial: {meter.meter_serial} ({meter.meter_profile?.parameter_value})
      </StrongText>

      {processedReadings.length === 0 ? (
        <p className='text-sm text-gray-500'>No readings found for this meter.</p>
      ) : (
        <div className='space-y-4'>
          {processedReadings.map((reading) => (
            <div
              key={reading.id}
              className='rounded-lg border bg-gray-50 p-3'
            >
              <p className='mb-1 text-sm font-medium'>
                Reading #{reading.index} — Date: {reading.date}
              </p>

              {reading.type === 'main' ? (
                <div className='text-sm text-gray-700'>
                  <p>
                    KVA (sum of timezones): <b>{reading.kvaSum}</b>
                  </p>
                  <p>
                    KWH (max of timezones): <b>{reading.kwhMax}</b>
                  </p>
                </div>
              ) : (
                <div className='text-sm text-gray-700'>
                  <h1></h1>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
