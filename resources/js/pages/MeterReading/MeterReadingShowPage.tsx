import MeterReadingTable from '@/components/Meter/MeterReading/MeterReadingTable/MeterReadingTable'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, Meter, MeterReading, MeterReadingValue } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { useMemo } from 'react'

interface ReadingsByMeter {
  meterId: number
  meter: Meter | null
  serial: string | undefined
  profile: string | undefined
  readings: MeterReadingValue[]
}

interface Props {
  meterReading: MeterReading
  connectionId: number
  connection: Connection
}

export default function MeterReadingShowPage({
  meterReading,
  connectionId,
  connection,
}: Readonly<Props>) {
  const breadcrumb: BreadcrumbItem[] = [
    { title: 'Connections', href: `/connections/${Number(connectionId)}` },
    { title: 'Connection', href: `/connections/${Number(connectionId)}` },
    { title: 'Meter Reading', href: `/connection/${Number(connectionId)}/meter-reading` },
    {
      title: 'Show',
      href: `/connection/${Number(connectionId)}/meter-reading/${meterReading.id}`,
    },
  ]

  const readingsByMeter = useMemo(() => {
    const result: {
      [meterId: number]: ReadingsByMeter
    } = {}

    meterReading.values?.forEach((reading: MeterReadingValue) => {
      const meterId = reading.meter_id
      if (!result[meterId]) {
        result[meterId] = {
          meterId,
          meter: reading.meter ?? null,
          serial: reading.meter?.meter_serial,
          profile: reading.meter?.meter_profile?.parameter_value,
          readings: [] as MeterReadingValue[],
        }
      }
      result[meterId].readings.push(reading)
    })
    return Object.values(result)
  }, [meterReading])

  return (
    <ConnectionsLayout
      connection={connection}
      breadcrumbs={breadcrumb}
      connectionsNavItems={consumerNavItems}
      connectionId={connectionId}
      heading='Meter Reading'
      subHeading='Meter Reading'
      value='meter-reading'
      subTabValue='reading'
    >
      <div className='flex flex-col gap-6'>
        <StrongText>Consumer Number: {connection.consumer_number}</StrongText>
        <h1 className='text-2xl font-bold'>Meter Reading</h1>
        <p className='text-sm text-gray-500'>
          Date: {meterReading.metering_date} (From {meterReading.reading_start_date} to{' '}
          {meterReading.reading_end_date})
        </p>
        {readingsByMeter.map((meter) => (
          <div
            key={meter.meterId}
            className='flex flex-col gap-4 rounded-lg border p-4 shadow'
          >
            <h2 className='mb-2 text-xl font-bold'>
              Meter: {meter.serial} ({meter.profile})
            </h2>
            <h3 className='text-sm font-semibold'>MF: {meter.meter?.meter_mf}</h3>
            <MeterReadingTable readings={meter.readings} />
          </div>
        ))}
      </div>
    </ConnectionsLayout>
  )
}
