import ConnectionPartiesFormModal from '@/components/Connections/ConnectionPartiesFormModal'
import ConnectionPartiesList from '@/components/Connections/ConnectionPartiesList'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, ConnectionPartyMapping } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import AddButton from '@/ui/button/AddButton'
import { useState } from 'react'

interface ConnectionPartiesProps {
  connection: Connection

  connectionParties: ConnectionPartyMapping[]
}

export default function ConnectionParties({
  connection,

  connectionParties,
}: ConnectionPartiesProps) {
  const [addPartiesModal, setAddPartiesModal] = useState(false)
  console.log(connectionParties)
  return (
    <ConnectionsLayout
      breadcrumbs={[]}
      connectionsNavItems={consumerNavItems}
      connectionId={connection?.connection_id}
      connection={connection}
      value='connection'
      subTabValue='parties'
      heading='Connection Parties'
      subHeading='Connection Parties'
    >
      <div className='flex justify-between'>
        <p>Parties</p>
        <AddButton
          onClick={() => {
            setAddPartiesModal(true)
          }}
        />
      </div>
      <ConnectionPartiesList
        connectionParties={connectionParties}
        connection={connection}
      />
      {addPartiesModal && (
        <ConnectionPartiesFormModal
          connection={connection}
          setShowModal={setAddPartiesModal}
        />
      )}
    </ConnectionsLayout>
  )
}
