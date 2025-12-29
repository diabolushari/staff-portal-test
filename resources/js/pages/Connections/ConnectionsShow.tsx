import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import type { Connection } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import StrongText from '@/typography/StrongText'
import EditButton from '@/ui/button/EditButton'
import { router } from '@inertiajs/react'
import { PencilIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { groupFlagsBySection } from '../Consumer/ConsumerShow'
import AddButton from '@/ui/button/AddButton'
import ConnectionFlagModal from '@/components/Connections/ConnectionFlagModal'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionGenerationFormModal from '@/components/Connections/ConnectionGenerationFormModal'

interface Props {
  connection: Connection
  consumerExist: boolean
  indicators: ParameterValues[]
  generationTypes: ParameterValues[]
}

export default function ConnectionsShow({
  connection,
  consumerExist,
  indicators,
  generationTypes,
}: Readonly<Props>) {
  const formatDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-'
  const [editIndicator, setEditIndicator] = useState(false)
  const [editGeneration, setEditGeneration] = useState(false)

  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Home',
        href: '/',
      },
      { title: 'Connections', href: '/connections' },
      {
        title: connection?.consumer_number?.toString(),
        href: connection?.connection_id
          ? route('connection.consumer', connection?.connection_id)
          : '#',
      },
    ],
    [connection]
  )

  const handleIndicator = () => {
    setEditIndicator(!editIndicator)
  }
  const connectionGroupedFlags = groupFlagsBySection(connection?.connection_flags, 'Connection')

  const handleGeneration = () => {
    setEditGeneration(!editGeneration)
  }

  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id ?? 0}
      value={'connection'}
      subTabValue='connection'
      heading='Connection'
      subHeading=''
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      consumerExist={consumerExist}
      meterExist={connection?.meter_mappings?.length > 0}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header */}
        {/* <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <StrongText className='text-2xl font-semibold text-[#252c32]'>Connection</StrongText>
            <span className='text-sm text-gray-600'>
              Consumer No: {connection?.consumer_number}
            </span>
          </div>
        </div> */}

        {/* Tabs */}

        <div className='space-y-6'>
          {/* Basic Info */}
          <Card className='rounded-lg p-7'>
            <div className='mb-6 flex items-center justify-between'>
              <StrongText className='text-base font-semibold text-[#252c32]'>
                Basic Information
              </StrongText>
              <button
                onClick={() => router.visit(route('connections.edit', connection?.connection_id))}
                className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] hover:bg-gray-50'
              >
                <PencilIcon className='h-4 w-4' />
                Edit
              </button>
            </div>
            <hr className='mb-6 border-[#e5e9eb]' />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Consumer Number'
                value={connection?.consumer_number}
              />
              {connection?.consumer_profiles?.[0]?.organization_name && (
                <Field
                  label='Industry Name'
                  value={connection?.consumer_profiles?.[0]?.organization_name}
                />
              )}
              {connection?.application_no && (
                <Field
                  label='Application Number'
                  value={connection?.application_no}
                />
              )}
              {connection?.consumer_legacy_code && (
                <Field
                  label='Consumer Legacy Code'
                  value={connection?.consumer_legacy_code}
                />
              )}
              <Field
                label='Connection Type'
                value={connection?.connection_type?.parameter_value}
              />
              <Field
                label='Status'
                value={connection?.connection_status?.parameter_value}
              />
              <Field
                label='Voltage'
                value={connection?.voltage?.parameter_value}
              />
              <Field
                label='Phase Type'
                value={connection?.phase_type?.parameter_value}
              />
              <Field
                label='Service Connection Date'
                value={formatDate(connection?.connected_date)}
              />
              <div className='col-span-2 mt-4'>
                <Field
                  label='Remarks'
                  value={connection?.remarks}
                />
              </div>
            </div>
          </Card>
          <Card className='rounded-lg p-7'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Load Details
            </StrongText>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Contract Demand (KVA)'
                value={connection?.contract_demand_kva_val}
              />
              <Field
                label='Power Load (KW)'
                value={connection?.power_load_kw_val}
              />
              <Field
                label='Light Load (KW)'
                value={connection?.light_load_kw_val}
              />
              <Field
                label='Connected Load'
                value={connection?.connected_load_kw_val}
              />
            </div>
          </Card>

          {/* Office Info */}
          <Card className='rounded-lg p-7'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Office Information
            </StrongText>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Admin Office Code'
                value={
                  connection?.admin_office?.office_type?.parameter_value +
                  ' - ' +
                  connection?.admin_office?.office_name
                }
              />
              <Field
                label='Service Office Code'
                value={
                  connection?.service_office?.office_type?.parameter_value +
                  ' - ' +
                  connection?.service_office?.office_name
                }
              />
            </div>
          </Card>

          {/* Category / Purpose Info */}
          <Card className='rounded-lg p-7'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Connection Category & Purpose
            </StrongText>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Connection Category'
                value={connection?.connection_category?.parameter_value}
              />
              <Field
                label='Connection Subcategory'
                value={connection?.connection_subcategory?.parameter_value}
              />
              <Field
                label='Primary Purpose'
                value={connection?.primary_purpose?.parameter_value}
              />
            </div>
          </Card>

          {/* Billing / Tariff Info */}
          <Card className='rounded-lg p-7'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Billing & Tariff
            </StrongText>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Billing Process'
                value={connection?.billing_process?.parameter_value}
              />
              <Field
                label='Tariff'
                value={connection?.tariff?.parameter_value}
              />
              <Field
                label='Metering Type'
                value={connection?.metering_type?.parameter_value}
              />
            </div>
          </Card>

          {connection?.connection_generation_types &&
            connection?.connection_generation_types?.length > 0 && (
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Generation Types
                  </StrongText>
                  <EditButton onClick={() => handleGeneration()} />
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {connection?.connection_generation_types?.map((generationType) => (
                    <>
                      <Field
                        key={generationType?.id}
                        label={generationType?.generation_type?.parameter_value ?? '-'}
                        value='Yes'
                      />
                      {generationType?.generation_sub_type && (
                        <Field
                          key={generationType?.id}
                          label={`${generationType.generation_type?.parameter_value} Sub Type`}
                          value={generationType?.generation_sub_type?.parameter_value ?? '-'}
                        />
                      )}
                    </>
                  ))}
                </div>
              </Card>
            )}

          {connectionGroupedFlags &&
            connectionGroupedFlags.length > 0 &&
            connectionGroupedFlags.map((group, index) => (
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    {group.group_name}
                  </StrongText>
                  <EditButton onClick={() => handleIndicator()} />
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {group?.flags?.map((flag) => (
                    <>
                      <Field
                        key={flag?.id}
                        label={flag?.flag?.parameter_value ?? '-'}
                        value='Selected'
                      />
                    </>
                  ))}
                </div>
              </Card>
            ))}
          <div className='flex gap-4'>
            {connectionGroupedFlags?.length === 0 && (
              <AddButton
                onClick={() => handleIndicator()}
                buttonText='Add Indicator'
              />
            )}
            {connection?.connection_generation_types?.length === 0 && (
              <AddButton
                onClick={() => handleGeneration()}
                buttonText='Add Generation'
              />
            )}
          </div>
          {editIndicator && (
            <ConnectionFlagModal
              connectionId={connection?.connection_id}
              setShowModal={setEditIndicator}
              currentFlags={connection.connection_flags}
              indicators={indicators}
            />
          )}
          {editGeneration && (
            <ConnectionGenerationFormModal
              connectionId={connection?.connection_id}
              setShowModal={setEditGeneration}
              generationTypes={generationTypes}
              initialGenerationData={connection?.connection_generation_types}
            />
          )}
          {/* Dates */}
        </div>
      </div>
    </ConnectionsLayout>
  )
}
