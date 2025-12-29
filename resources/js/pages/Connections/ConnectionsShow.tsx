import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import type { Connection } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import StrongText from '@/typography/StrongText'
import EditButton from '@/ui/button/EditButton'
import { router } from '@inertiajs/react'
import { useMemo, useState } from 'react'

interface Props {
  connection: Connection
  consumerExist: boolean
}

export default function ConnectionsShow({ connection, consumerExist }: Readonly<Props>) {
  const formatDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-'
  const [editIndicator, setEditIndicator] = useState(false)

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
      {
        title: 'Connection Details',
        href: '#',
      },
    ],
    [connection]
  )

  const handleIndicator = () => {
    setEditIndicator(!editIndicator)
  }

  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id ?? 0}
      value={'connection'}
      subTabValue='connection'
      heading='Connection Details'
      description={
        <>
          Connection details for consumer number {'   '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      consumerExist={consumerExist}
      meterExist={connection?.meter_mappings?.length > 0}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto'>
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
          <div className='flex justify-end pr-5'>
            <button
              onClick={() => router.get(route('connections.edit', connection?.connection_id))}
              className='link-button-text cursor-pointer underline'
            >
              EDIT
            </button>
          </div>

          {/* Basic Info */}
          <Card className='rounded-lg p-5'>
            <div className='mb-6 flex items-center justify-between'>
              <StrongText className='text-base font-semibold text-[#252c32]'>
                Basic Information
              </StrongText>
            </div>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

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
                {connection?.remarks && (
                  <Field
                    label='Remarks'
                    value={connection?.remarks}
                  />
                )}
              </div>
            </div>
          </Card>
          <Card className='rounded-lg p-5'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Load Details
            </StrongText>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

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
          <Card className='rounded-lg p-5'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Office Information
            </StrongText>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

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
          <Card className='rounded-lg p-5'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Connection Category & Purpose
            </StrongText>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

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
          <Card className='rounded-lg p-5'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Billing & Tariff
            </StrongText>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

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
              <Field
                label='Solar Indicator'
                value={connection?.solar_indicator ? 'Yes' : 'No'}
              />
              <Field
                label='Multi Source Indicator'
                value={connection?.multi_source_indicator ? 'Yes' : 'No'}
              />
            </div>
          </Card>

          {connection.connection_generation_types &&
            connection.connection_generation_types.length > 0 && (
              <Card className='rounded-lg p-5'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Generation Types
                  </StrongText>
                  <EditButton onClick={() => handleIndicator()} />
                </div>
                <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {connection?.connection_generation_types?.map((generationType) => (
                    <>
                      <Field
                        key={generationType?.id}
                        label=''
                        value={generationType?.generation_type?.parameter_value ?? '-'}
                      />
                      {generationType?.generation_sub_type && (
                        <Field
                          key={generationType?.id}
                          label='Sub Type'
                          value={generationType?.generation_sub_type?.parameter_value ?? '-'}
                        />
                      )}
                    </>
                  ))}
                </div>
              </Card>
            )}

          {connection?.connection_flags && connection?.connection_flags?.length > 0 && (
            <Card className='rounded-lg p-5'>
              <div className='mb-6 flex items-center justify-between'>
                <StrongText className='text-base font-semibold text-[#252c32]'>
                  Indicators
                </StrongText>
                <EditButton onClick={() => handleIndicator()} />
              </div>
              <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {connection?.connection_flags?.map((flag) => (
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
          )}

          {/* Dates */}
        </div>
      </div>
    </ConnectionsLayout>
  )
}
