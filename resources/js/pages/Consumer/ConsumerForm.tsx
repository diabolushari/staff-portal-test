import ConsumerFormComponent from '@/components/Consumer/ConsumerFormComponent'
import { Connection, ConsumerData, RegionOption } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { BreadcrumbItem } from '@/types'
import { useMemo } from 'react'
import StrongText from '@/typography/StrongText'
import { consumerNavItems } from '@/components/Navbar/navitems'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'

interface Props {
  consumerTypes: ParameterValues[]
  connectionId: number
  consumer?: ConsumerData
  districts: RegionOption[]
  states: RegionOption[]
  connection: Connection | null
}

export default function ConsumerForm({
  consumerTypes,
  districts,
  states,
  connectionId,
  consumer,
  connection,
}: Readonly<Props>) {
  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [{ title: 'Connections', href: '/connections' }]

    if (connection && connectionId) {
      items.push(
        {
          title: connection.consumer_number.toString(),
          href: route('connections.show', connectionId),
        },
        {
          title: 'Consumer Details',
          href: route('connection.consumer', connectionId),
        }
      )
    }

    return items
  }, [connection, connectionId])

  return (
    <ConnectionsLayout
      connection={connection}
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      connectionId={connectionId}
      heading='Consumer Details'
      subHeading='Consumer Details'
      value='connection'
      subTabValue='consumer'
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <StrongText className='text-2xl font-semibold text-[#252c32]'>
              Connection #{connection?.connection_id}
            </StrongText>
            <span className='text-sm text-gray-600'>
              Consumer No: {connection?.consumer_number}
            </span>
          </div>
        </div>
      </div>
      <ConsumerFormComponent
        consumer_types={consumerTypes}
        districts={districts}
        states={states}
        connection_id={connectionId}
        data={consumer}
      />
    </ConnectionsLayout>
  )
}
