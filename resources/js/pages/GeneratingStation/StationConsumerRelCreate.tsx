import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, StationConsumerRel } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import AddButton from '@/ui/button/AddButton'
import { router } from '@inertiajs/react'

interface Props {
  connection: Connection
  station: StationConsumerRel
}

export default function StationConsumerRelCreate({ connection, station }: Readonly<Props>) {
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
      <div className='flex justify-end p-5'>
        <AddButton
          onClick={() =>
            router.get(
              route('station-consumer-rels.create', { connectionId: connection.connection_id })
            )
          }
          buttonText='Add Station'
        />
      </div>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'></div>
    </ConnectionsLayout>
  )
}
