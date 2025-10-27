import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, Meter, MeterReading, MeterReadingValue } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'

export default function MeterReadingShowPage({
  meterReading,
  connectionId,
  connection,
}: {
  meterReading: MeterReading
  connectionId: number
  connection: Connection
}) {
  const breadcrumb: BreadcrumbItem[] = [
    { title: 'Connections', href: `/connections/${Number(connectionId)}` },
    { title: 'Connection', href: `/connections/${Number(connectionId)}` },
    { title: 'Meter Reading', href: `/connection/${Number(connectionId)}/meter-reading` },
    {
      title: 'Show',
      href: `/connection/${Number(connectionId)}/meter-reading/${meterReading.id}`,
    },
  ]

  const readingsByMeter = Object.values(
    meterReading.values?.reduce((acc: any, reading: MeterReadingValue) => {
      const meterId = reading.meter_id
      if (!acc[meterId]) {
        acc[meterId] = {
          meterId,
          serial: reading.meter?.meter_serial,
          profile: reading.meter?.meter_profile?.parameter_value,
          readings: [] as MeterReadingValue[],
        }
      }
      acc[meterId].readings.push(reading)
      return acc
    }, {}) || {}
  )

  const groupedByMeterAndParam = readingsByMeter.map((meter: any) => {
    const grouped = meter.readings.reduce((acc: any, reading: any) => {
      const paramId = reading.parameter_id
      const paramName = reading.meter_profile_parameter?.display_name || `Parameter ${paramId}`
      if (!acc[paramId]) acc[paramId] = { name: paramName, readings: [] }
      acc[paramId].readings.push(reading)
      return acc
    }, {})
    return {
      ...meter,
      grouped,
    }
  })

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={consumerNavItems}
    >
      <div className='flex flex-col gap-6'>
        <StrongText>Consumer Number: {connection.consumer_number}</StrongText>
        <h1 className='text-2xl font-bold'>Meter Reading</h1>
        <p className='text-sm text-gray-500'>
          Date: {meterReading.metering_date} (From {meterReading.reading_start_date} to{' '}
          {meterReading.reading_end_date})
        </p>

        {groupedByMeterAndParam.map((meter: any) => (
          <div
            key={meter.meterId}
            className='rounded-lg border p-4 shadow'
          >
            <h2 className='mb-2 text-xl font-bold'>
              Meter: {meter.serial} ({meter.profile})
            </h2>

            {Object.entries(meter.grouped).map(([paramId, param]: any) => (
              <div
                key={paramId}
                className='mb-4'
              >
                <h3 className='mb-2 text-lg font-semibold'>{param.name}</h3>

                <table className='w-full table-auto border-collapse border border-gray-300'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='border px-4 py-2 text-left'>Timezone</th>
                      <th className='border px-4 py-2 text-left'>Initial</th>
                      <th className='border px-4 py-2 text-left'>Final</th>
                      <th className='border px-4 py-2 text-left'>Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {param.readings.map((reading: MeterReadingValue, i: number) => (
                      <tr key={i}>
                        <td className='border px-4 py-2'>{reading.time_zone?.parameter_value}</td>
                        <td className='border px-4 py-2'>{reading.initial_reading}</td>
                        <td className='border px-4 py-2'>{reading.final_reading}</td>
                        <td className='border px-4 py-2'>{reading.difference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>
    </MainLayout>
  )
}
