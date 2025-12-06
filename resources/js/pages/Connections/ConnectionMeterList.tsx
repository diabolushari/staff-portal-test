import { Connection, MeterConnectionMapping } from '@/interfaces/data_interfaces'
import { consumerNavItems } from '../../components/Navbar/navitems'
import StrongText from '@/typography/StrongText'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import {
  Barcode,
  Calendar,
  Cpu,
  Factory,
  Hash,
  Plus,
  Settings,
  Shield,
  Wrench,
  Zap,
} from 'lucide-react'
import { Card } from '../../components/ui/card'
import { router } from '@inertiajs/react'
import { BreadcrumbItem } from '@/types'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'

interface ConnectionMeterListProps {
  connectionId: number
  connection: Connection
  heading?: string
  subHeading?: string
  onEdit?: () => void
  value?: string
  meterConnectionRels?: MeterConnectionMapping[]
}

export default function ConnectionMeterList({
  connectionId,
  connection,
  heading,
  subHeading,
}: ConnectionMeterListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteRelationId, setDeleteRelation] = useState<MeterConnectionMapping | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Connections',
      href: route('connections.index'),
    },
    {
      title: connection?.consumer_number.toString(),
      href: route('connections.show', connectionId),
    },
    {
      title: 'Meters',
      href: route('connection.meters', connectionId),
    },
  ]

  function handleAddMeter() {
    router.visit(route('connection.meter.create', { id: connectionId }))
  }

  function handleDeleteMeter(meterRelation: MeterConnectionMapping) {
    setDeleteRelation(meterRelation)
    setDeleteModalOpen(true)
  }

  function handleEditMeter(rel_id: number) {
    router.visit(route('connection.meter.edit', rel_id))
  }

  function handleMeterClick(meter_id: number) {
    router.visit(route('meters.show', meter_id))
  }

  // Clone and sort meters based on priority and meter_id
  const sortedMeters = connection?.meters?.slice()?.sort((a, b) => {
    const pa = a.priority ?? 0
    const pb = b.priority ?? 0

    // Priority 0 goes last
    if (pa === 0 && pb !== 0) return 1
    if (pb === 0 && pa !== 0) return -1

    // Sort by priority ascending
    if (pa !== pb) return pa - pb

    // If same priority, sort by meter_id
    return (a.meter?.meter_id ?? 0) - (b.meter?.meter_id ?? 0)
  })

  return (
    <ConnectionsLayout
      connectionId={connectionId}
      heading={heading || 'Meters'}
      subHeading={subHeading || 'Meters assigned to this connection'}
      value='configuration'
      subTabValue='meter'
      connection={connection}
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      consumerExist={true}
      meterExist={connection?.meters?.length > 0}
    >
      <Card className='relative w-full rounded-lg bg-white'>
        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
          <StrongText className='text-lg font-semibold text-gray-900'>Meter Information</StrongText>
          <button
            onClick={handleAddMeter}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            <Plus className='h-4 w-4' />
            Add Meter
          </button>
        </div>

        <div className='flex flex-col px-6 pb-6'>
          {sortedMeters && sortedMeters.length > 0 ? (
            sortedMeters.map((meterData) => {
              const { meter, relationship, priority } = meterData

              return (
                <div
                  key={meter.meter_id}
                  className='mb-4 rounded-lg border border-gray-200 bg-white px-3 py-4 transition-shadow last:mb-0 hover:shadow-md'
                >
                  <button
                    type='button'
                    className='flex w-full items-start justify-between text-left'
                    onClick={() => handleMeterClick(meter.meter_id)}
                  >
                    {/* Left info */}
                    <div className='flex flex-1 flex-col gap-3 p-2'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex flex-wrap items-center gap-3'>
                          <div className='font-inter text-lg font-semibold text-black'>
                            {meter.meter_serial}
                          </div>

                          {meter.company_seal_num && (
                            <div className='rounded-full bg-blue-100 px-3 py-1'>
                              <div className='font-inter text-xs text-blue-800'>
                                Seal: {meter.company_seal_num}
                              </div>
                            </div>
                          )}

                          {relationship?.meter_status && (
                            <div
                              className={`rounded-full px-3 py-1 ${
                                relationship.meter_status.parameter_value === 'Working'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              <div className='font-inter text-xs'>
                                {relationship.meter_status.parameter_value}
                              </div>
                            </div>
                          )}

                          {priority > 0 ? (
                            <div className='rounded-full bg-yellow-100 px-3 py-1'>
                              <div className='font-inter text-xs text-yellow-800'>
                                Priority {priority}
                              </div>
                            </div>
                          ) : (
                            <div className='rounded-full bg-gray-100 px-3 py-1'>
                              <div className='font-inter text-xs text-gray-700'>No Priority</div>
                            </div>
                          )}
                        </div>

                        {/* Type + Make + Category */}
                        <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                          {meter.meter_type && (
                            <div className='flex items-center gap-1'>
                              <Cpu className='h-4 w-4 text-slate-500' />
                              Type: {meter.meter_type.parameter_value}
                            </div>
                          )}
                          {meter.meter_make && (
                            <div className='flex items-center gap-1'>
                              <Factory className='h-4 w-4 text-slate-500' />
                              Make: {meter.meter_make.parameter_value}
                            </div>
                          )}
                          {relationship?.meter_use_category && (
                            <div className='flex items-center gap-1'>
                              <Settings className='h-4 w-4 text-slate-500' />
                              {relationship.meter_use_category.parameter_value}
                            </div>
                          )}
                        </div>

                        {/* Accuracy + Ownership + Phase */}
                        <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                          {meter.accuracy_class && (
                            <div className='flex items-center gap-1'>
                              <Shield className='h-4 w-4 text-slate-500' />
                              Accuracy: {meter.accuracy_class.parameter_value}
                            </div>
                          )}
                          {meter.ownership_type && (
                            <div className='flex items-center gap-1'>
                              <Barcode className='h-4 w-4 text-slate-500' />
                              Owner: {meter.ownership_type.parameter_value}
                            </div>
                          )}
                          {meter.meter_phase && (
                            <div className='flex items-center gap-1'>
                              <Zap className='h-4 w-4 text-slate-500' />
                              Phase: {meter.meter_phase.parameter_value}
                            </div>
                          )}
                        </div>

                        {/* Technical specs */}
                        <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                          <div className='flex items-center gap-1'>
                            <Hash className='h-4 w-4 text-slate-500' />
                            Constant: {meter.meter_constant}
                          </div>
                          <div className='flex items-center gap-1'>
                            <Wrench className='h-4 w-4 text-slate-500' />
                            MF: {meter.meter_mf}
                          </div>
                          <div className='flex items-center gap-1'>
                            <Settings className='h-4 w-4 text-slate-500' />
                            Digits: {meter.digit_count}
                          </div>
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4 text-slate-500' />
                            Warranty: {meter.warranty_period}m
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side status */}
                    <div className='flex flex-col items-end gap-2 py-2 pr-2 pl-4'>
                      <div
                        className={`rounded-full px-3 py-1 ${
                          meter.smart_meter_ind ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        <div
                          className={`font-inter text-xs font-medium ${
                            meter.smart_meter_ind ? 'text-green-700' : 'text-gray-700'
                          }`}
                        >
                          {meter.smart_meter_ind ? 'Smart' : 'Standard'}
                        </div>
                      </div>

                      {relationship?.bidirectional_ind && (
                        <div className='rounded-full bg-purple-100 px-3 py-1'>
                          <div className='font-inter text-xs font-medium text-purple-700'>
                            Bidirectional
                          </div>
                        </div>
                      )}

                      <div
                        className={`rounded-full px-3 py-1 ${
                          relationship?.is_active ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <div
                          className={`font-inter text-xs font-medium ${
                            relationship?.is_active ? 'text-green-700' : 'text-red-700'
                          }`}
                        >
                          {relationship?.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Delete button */}
                  <div className='flex items-center gap-2'>
                    <DeleteButton onClick={() => handleDeleteMeter(relationship)} />
                    <EditButton onClick={() => handleEditMeter(relationship?.rel_id)} />
                  </div>
                </div>
              )
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
        {deleteModalOpen && (
          <DeleteModal
            setShowModal={setDeleteModalOpen}
            url={route('meter-connection-rel.destroy', deleteRelationId?.rel_id)}
            title='Delete Meter'
          />
        )}
      </Card>
    </ConnectionsLayout>
  )
}
