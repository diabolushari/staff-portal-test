import ConnectionPartiesFormModal from '@/components/Connections/ConnectionPartiesFormModal'
import ConnectionPartiesList from '@/components/Connections/ConnectionPartiesList'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, ConnectionPartyMapping } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import AddButton from '@/ui/button/AddButton'
import { useState } from 'react'

interface ConnectionPartiesProps {
  connection: Connection
  party_relation_types: ParameterValues[]
  connection_parties: ConnectionPartyMapping[]
}

export default function ConnectionParties({
  connection,
  party_relation_types,
  connection_parties,
}: ConnectionPartiesProps) {
  const [addPartiesModal, setAddPartiesModal] = useState(false)
  console.log(connection_parties)
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
        connectionParties={connection_parties}
        connection={connection}
        partyRelationTypes={party_relation_types}
      />
      {addPartiesModal && (
        <ConnectionPartiesFormModal
          connection={connection}
          setShowModal={setAddPartiesModal}
          partyRelationTypes={party_relation_types}
        />
      )}
    </ConnectionsLayout>
  )
}
