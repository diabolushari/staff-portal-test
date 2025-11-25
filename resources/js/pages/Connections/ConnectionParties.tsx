import ConnectionPartiesFormModal from '@/components/Connections/ConnectionPartiesFormModal'
import { Connection } from '@/interfaces/data_interfaces'
import { Party } from '@/interfaces/parties'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import AddButton from '@/ui/button/AddButton'
import { useState } from 'react'

interface ConnectionPartiesProps {
  connection: Connection
  parties: Party[]
}

export default function ConnectionParties({ connection, parties }: ConnectionPartiesProps) {
  const [addPartiesModal, setAddPartiesModal] = useState(false)

  return (
    <ConnectionsLayout
      breadcrumbs={[]}
      connectionsNavItems={[]}
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
      {addPartiesModal && (
        <ConnectionPartiesFormModal
          connection={connection}
          parties={parties}
          setShowModal={setAddPartiesModal}
        />
      )}
    </ConnectionsLayout>
  )
}
