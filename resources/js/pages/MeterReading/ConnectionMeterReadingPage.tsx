import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Cpu, Plus } from 'lucide-react'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { router } from '@inertiajs/react'
import { Connection, Meter, MeterReading } from '@/interfaces/data_interfaces'

import MeterReadingCard from '@/components/Meter/MeterReading/MeterReadingCard'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'

interface ConnectionMeterReadingPageProps {
  connection: Connection
  meterReadings: Paginator<MeterReading>
}

export default function ConnectionMeterReadingPage({
  connection,
  meterReadings,
}: ConnectionMeterReadingPageProps) {
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
          <div>
            {meterReadings?.data && meterReadings?.data?.length > 0 ? (
              meterReadings?.data?.map((meterReading) => (
                <>
                  <MeterReadingCard
                    meterReading={meterReading}
                    meters={connection?.meters}
                  />
                </>
              ))
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
          {meterReadings?.data && meterReadings?.data?.length > 0 && (
            <Pagination pagination={meterReadings} />
          )}
        </div>
      </Card>
    </ConnectionsLayout>
  )
}
