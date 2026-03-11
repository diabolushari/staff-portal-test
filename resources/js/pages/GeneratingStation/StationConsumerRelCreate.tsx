import AddStationConsumerModal from '@/components/GeneratingStation/AddStationConsumerModal'
import ConsumerStationList from '@/components/GeneratingStation/ConsumerStationList'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, GeneratingStation, StationConsumerRel } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import AddButton from '@/ui/button/AddButton'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface Props {
  connection: Connection
  stations: GeneratingStation[]
  relations: StationConsumerRel[]
}

export default function StationConsumerRelCreate({
  connection,
  stations,
  relations,
}: Readonly<Props>) {
  const [showModal, setShowModal] = useState(false)
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
  console.log(stations)
  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id}
      value={'connection'}
      subTabValue='stations'
      heading='Stations'
      description={
        <>
          Add station consumer <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
    >
      <div className='flex justify-end p-5'>
        <AddButton
          buttonText='Add Station'
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <AddStationConsumerModal
          connection={connection}
          stations={stations}
          setShowModal={setShowModal}
        />
      )}
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        <ConsumerStationList relations={relations} />
      </div>
    </ConnectionsLayout>
  )
}
