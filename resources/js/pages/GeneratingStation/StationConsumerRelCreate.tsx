import { consumerNavItems } from '@/components/Navbar/navitems'
import StationConsumerRelForm from '@/components/GeneratingStation/StationConsumerRel/StationConsumerRelForm'
import { Connection } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'

interface Props {
  connection: Connection
  stationId: number
  stationConnection: Connection
  consumerTypes: ParameterValues[]
}

export default function StationConsumerRelCreate({
  connection,
  stationId,
  stationConnection,
  consumerTypes,
}: Readonly<Props>) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: connection?.consumer_number,
      href: `/connections/${connection?.connection_id}`,
    },
    {
      title: 'Stations',
      href: `/connection/${connection?.connection_id}/station-consumer-rels`,
    },
    {
      title: 'Add Station Consumer',
      href: '#',
    },
  ]

  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id}
      value={'connection'}
      subTabValue='stations'
      heading='Stations'
      description={
        <>
          Add station consumer for consumer number{' '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        <StationConsumerRelForm
          stationId={stationId}
          stationConnection={stationConnection}
          consumerTypes={consumerTypes}
          connection={connection}
        />
      </div>
    </ConnectionsLayout>
  )
}
