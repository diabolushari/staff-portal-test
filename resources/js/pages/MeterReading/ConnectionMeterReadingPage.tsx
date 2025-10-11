import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Cpu, Plus } from 'lucide-react'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { router } from '@inertiajs/react'
import { Connection } from '@/interfaces/data_interfaces'

interface ConnectionMeterReadingPageProps {
  connection: Connection
  meters: any[]
  meterProfiles: any[]
  meterReadings: any[]
}

export default function ConnectionMeterReadingPage({
  connection,
  meters,
  meterProfiles,
  meterReadings,
}: ConnectionMeterReadingPageProps) {
  console.log(meterReadings)
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Connections', href: route('connections.index') },
    {
      title: connection?.consumer_number.toString() ?? '',
      href: route('connections.show', connection?.connection_id),
    },
    {
      title: 'Meter Reading',
      href: route('connection.meter-reading', {
        connection_id: connection?.connection_id,
      }),
    },
  ]

  const handleAddMeterReading = () => {
    router.visit(route('meter-reading.create', { id: connection?.connection_id }))
  }
  const handleViewMeterReading = (meterReadingId: number, meterId: number) => {
    router.visit(
      route('meter-reading.show', { meter_reading: meterReadingId }) +
        `?meter_id=${Number(meterId)}&connection_id=${connection?.connection_id}`
    )
  }

  return (
    <ConnectionsLayout
      connection={connection}
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      connectionId={connection?.connection_id}
      heading='Connection Meter Reading'
      subHeading='Connection Meter Reading'
      value='meter-reading'
    >
      <Card className='relative w-full rounded-lg bg-white'>
        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
          <StrongText className='text-lg font-semibold text-gray-900'>
            Meter Reading Information
          </StrongText>
          <button
            onClick={handleAddMeterReading}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500'
          >
            <Plus className='h-4 w-4' />
            Add Meter Reading
          </button>
        </div>

        <div className='flex flex-col gap-6 px-6 pb-6'>
          {meterReadings && meterReadings.length > 0 ? (
            // Group readings by meter
            Object.values(
              meterReadings.reduce(
                (acc, reading) => {
                  const meterId = reading.meter_id
                  if (!acc[meterId]) acc[meterId] = []
                  acc[meterId].push(reading)
                  return acc
                },
                {} as Record<number, any[]>
              )
            ).map((meterReadingsForMeter: any[]) => {
              const meterId = meterReadingsForMeter[0].meter_id

              // collect all unique time zones for kWh
              const allZones = Array.from(
                new Set(
                  meterReadingsForMeter.flatMap((r) =>
                    r.values
                      .filter((v) => v.meter_profile_parameter?.name?.toLowerCase() === 'kwh')
                      .map((v) => v.time_zone?.parameter_value)
                  )
                )
              )

              return (
                <Card
                  key={meterId}
                  className='p-4'
                >
                  <h2 className='text-md mb-3 font-bold text-gray-700'>
                    Meter #{meterId} — kWh Readings
                  </h2>

                  <table className='w-full border border-gray-300 text-sm'>
                    <thead className='bg-gray-100'>
                      <tr>
                        <th className='border px-2 py-1 text-left'>Reading Date</th>
                        {allZones.map((zone) => (
                          <th
                            key={zone}
                            className='border px-2 py-1 text-center'
                          >
                            {zone}
                          </th>
                        ))}
                        <th className='border px-2 py-1 text-center'>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {meterReadingsForMeter.map((reading) => {
                        // extract kWh readings for this meter/date
                        const kwhValues = reading.values.filter(
                          (v) => v.meter_profile_parameter?.name?.toLowerCase() === 'kwh'
                        )

                        // map zone → final_reading
                        const zoneMap = kwhValues.reduce(
                          (acc, val) => {
                            const zone = val.time_zone?.parameter_value || 'Unknown'
                            acc[zone] = val.final_reading
                            return acc
                          },
                          {} as Record<string, number>
                        )

                        return (
                          <tr
                            key={reading.id}
                            className='hover:bg-gray-50'
                          >
                            <td className='border px-2 py-1 text-left'>{reading.metering_date}</td>
                            {allZones.map((zone) => (
                              <td
                                key={zone}
                                className='border px-2 py-1 text-center'
                              >
                                {zoneMap[zone] ?? '-'}
                              </td>
                            ))}
                            <td
                              className='cursor-pointer border px-2 py-1 text-center text-blue-600 hover:underline'
                              onClick={() => handleViewMeterReading(reading.id, meterId)}
                            >
                              View
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </Card>
              )
            })
          ) : (
            <div className='p-8 text-center text-slate-500'>
              <div className='flex flex-col items-center gap-2'>
                <Cpu className='h-12 w-12 text-slate-300' />
                <p className='text-lg font-medium'>No meter readings found</p>
                <p className='text-sm'>No kWh readings available for this connection.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ConnectionsLayout>
  )
}
