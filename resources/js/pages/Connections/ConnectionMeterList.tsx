import ConnectionCardSection from '@/components/Connections/ConnectionMeter/ConnectionCardSection'
import {
  Connection,
  Meter,
  MeterConnectionMapping,
  MeterTransformerAssignment,
} from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { Cpu, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { consumerNavItems } from '../../components/Navbar/navitems'
import ConnectionMeterUpdateModal from '@/components/Connections/ConnectionMeter/ConnectionMeterUpdateModal'
import { ParameterValues } from '@/interfaces/parameter_types'

interface ConnectionMeterListProps {
  connection_id: number
  connection: Connection
  ctpt_relations: MeterTransformerAssignment[]
  status: ParameterValues[]
  change_reason: ParameterValues[]
  ctpt_status: ParameterValues[]
  ctpt_change_reason: ParameterValues[]
}

export default function ConnectionMeterList({
  connection_id,
  connection,
  ctpt_relations,
  status,
  change_reason,
  ctpt_status,
  ctpt_change_reason,
}: Readonly<ConnectionMeterListProps>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteRelationId, setDeleteRelation] = useState<MeterConnectionMapping | null>(null)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [isStatusChange, setIsStatusChange] = useState(false)
  const [meter, setMeter] = useState<MeterConnectionMapping | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Connections',
      href: route('connections.index'),
    },
    {
      title: connection?.consumer_number.toString(),
      href: route('connections.show', connection_id),
    },
    {
      title: 'Meters',
      href: route('connection.meters', connection_id),
    },
  ]

  function handleAddMeter() {
    router.visit(route('connection.meter.create', { id: connection_id }))
  }

  function handleDeleteMeter(mapping: MeterConnectionMapping) {
    setDeleteRelation(mapping)
    setDeleteModalOpen(true)
  }

  function handleEditMeter(mappingId: number) {
    router.visit(route('connection.meter.edit', mappingId))
  }

  function handleMeterStatusChange(meter: MeterConnectionMapping) {
    setIsStatusChange(true)
    setUpdateModalOpen(true)
    setMeter(meter)
  }

  function handleMeterChange(meter: MeterConnectionMapping) {
    setIsStatusChange(false)
    setUpdateModalOpen(true)
    setMeter(meter)
  }

  function handleCloseModal() {
    setUpdateModalOpen(false)
    setMeter(null)
    setIsStatusChange(false)
  }
  console.log(ctpt_change_reason)
  console.log(ctpt_status)

  return (
    <ConnectionsLayout
      connectionId={connection_id}
      heading={'Meters'}
      subHeading={'Meters assigned to this connection'}
      value='configuration'
      subTabValue='meter'
      connection={connection}
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      consumerExist={true}
      meterExist={connection?.meter_mappings?.length > 0}
    >
      <div className='relative w-full rounded-lg bg-white'>
        <div className='flex items-center justify-end border-gray-200 px-6 py-4'>
          <button
            onClick={handleAddMeter}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            <Plus className='h-4 w-4' />
            Add Meter
          </button>
        </div>

        <div className='flex flex-col px-6 pb-6'>
          {connection?.meter_mappings && connection?.meter_mappings.length > 0 ? (
            connection?.meter_mappings.map((mapping) => (
              <ConnectionCardSection
                key={mapping.rel_id}
                meterMapping={mapping}
                ctptRelations={ctpt_relations}
                connectionId={connection_id}
                onDelete={handleDeleteMeter}
                onEdit={handleEditMeter}
                onMeterStatusChange={handleMeterStatusChange}
                onMeterChange={handleMeterChange}
                changeReasons={ctpt_change_reason}
                statuses={ctpt_status}
              />
            ))
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
        {deleteModalOpen && (
          <DeleteModal
            setShowModal={setDeleteModalOpen}
            url={route('meter-connection-rel.destroy', deleteRelationId?.rel_id)}
            title='Delete Meter'
          />
        )}
        {updateModalOpen && meter && (
          <ConnectionMeterUpdateModal
            setShowModal={handleCloseModal}
            isStatusChange={isStatusChange}
            status={status}
            changeReason={change_reason}
            meter={meter}
          />
        )}
      </div>
    </ConnectionsLayout>
  )
}
