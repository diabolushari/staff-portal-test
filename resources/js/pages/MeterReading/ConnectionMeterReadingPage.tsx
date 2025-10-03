import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import { Cpu, Plus } from 'lucide-react'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { router } from '@inertiajs/react'
import { Connection } from '@/interfaces/data_interfaces'

interface ConnectionMeterReadingPageProps {
  connection: Connection
  meters: any[]
  meterProfiles: any[]
}

export default function ConnectionMeterReadingPage({
  connection,
  meters,
  meterProfiles,
}: ConnectionMeterReadingPageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Connections', href: route('connections.index') },
    {
      title: 'Connection Meter Reading',
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
        `?meter_id=${meterId}&connection_id=${connection?.connection_id}`
    )
  }

  return (
    <ConnectionsLayout
      connection={connection}
      meters={meters}
      breadcrumbs={breadcrumbs}
      connectionsNavItems={connectionsNavItems}
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
          {meterProfiles && meterProfiles.length > 0 ? (
            meterProfiles.map((meter) => (
              <Card
                key={meter.meter_id}
                className='p-4'
              >
                <h2 className='text-md mb-3 font-bold text-gray-700'>
                  Meter #{meter.meter_id} (Profile {meter.profile_id})
                </h2>

                {meter.profile_items?.map((profileItem, idx) => (
                  <div
                    key={idx}
                    className='mb-6'
                  >
                    <p className='mb-2 font-semibold text-gray-800'>
                      {profileItem.meter_parameter?.display_name}
                    </p>

                    <table className='w-full border border-gray-300 text-sm'>
                      <thead className='bg-gray-100'>
                        <tr>
                          <th className='border px-2 py-1 text-left'>Reading Date</th>
                          <th className='border px-2 py-1'>Initial</th>
                          <th className='border px-2 py-1'>Final</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profileItem.reading_values?.map((reading, rIdx) => {
                          const values = reading.values || []
                          // flatten {Peak: {...}, Off Peak: {...}, ...}
                          const zones = values.map((zoneObj) => {
                            const [zone, val] = Object.entries(zoneObj)[0]
                            return {
                              zone,
                              initial: val.initial,
                              final: val.final,
                              diff: val.diff,
                            }
                          })

                          // calculate totals
                          const totalInitial = zones.reduce(
                            (sum, z) => sum + (Number(z.initial) || 0),
                            0
                          )
                          const totalFinal = zones.reduce(
                            (sum, z) => sum + (Number(z.final) || 0),
                            0
                          )
                          const totalDiff = zones.reduce((sum, z) => sum + (Number(z.diff) || 0), 0)

                          return (
                            <tr
                              key={rIdx}
                              className='hover:bg-gray-50'
                            >
                              <td className='border px-2 py-1'>{reading.reading?.metering_date}</td>
                              <td className='border px-2 py-1 text-center'>{totalInitial}</td>
                              <td className='border px-2 py-1 text-center'>{totalFinal}</td>
                              <td
                                className='border px-2 py-1 text-center'
                                onClick={() =>
                                  handleViewMeterReading(reading.reading?.id, meter?.meter_id)
                                }
                              >
                                View
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </Card>
            ))
          ) : (
            <div className='p-8 text-center text-slate-500'>
              <div className='flex flex-col items-center gap-2'>
                <Cpu className='h-12 w-12 text-slate-300' />
                <p className='text-lg font-medium'>No meter profiles found</p>
                <p className='text-sm'>No meter profiles are associated with this connection.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ConnectionsLayout>
  )
}
