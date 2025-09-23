import { Connection } from '@/interfaces/consumers'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { MeterData } from '../Connections/MeterTab'
import { BreadcrumbItem } from '@/types'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import { Cpu, Plus } from 'lucide-react'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { router } from '@inertiajs/react'

interface ConnectionMeterReadingPageProps {
  connection: Connection
  meters: MeterData[]
  meterReadings: any[]
}

export default function ConnectionMeterReadingPage({
  connection,
  meters,
  meterReadings,
}: ConnectionMeterReadingPageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Connections',
      href: route('connections.index'),
    },
    {
      title: 'Connection Meter Reading',
      href: route('connection.meter-reading', { connection_id: connection?.connection_id }),
    },
  ]
  const handleAddMeterReading = () => {
    router.visit(route('meter-reading.create', { id: connection?.connection_id }))
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
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            <Plus className='h-4 w-4' />
            Add Meter Reading
          </button>
        </div>
        <div className='flex flex-col px-6 pb-6'>
          {meterReadings && meterReadings.length > 0 ? (
            meterReadings?.map((meterReadingData) => {
              const { meterReading, relationship } = meterReadingData
              return <div>detials here</div>
            })
          ) : (
            <div className='p-8 text-center text-slate-500'>
              <div className='flex flex-col items-center gap-2'>
                <Cpu className='h-12 w-12 text-slate-300' />
                <p className='text-lg font-medium'>No meters found</p>
                <p className='text-sm'>No meters are associated with this connection.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ConnectionsLayout>
  )
}
