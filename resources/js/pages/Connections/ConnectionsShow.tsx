import { connectionsNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import { TabsContent } from '@/components/ui/tabs'
import type { Connection, ConnectionMeterAssignment, Meter } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import StrongText from '@/typography/StrongText'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { router } from '@inertiajs/react'
import { PencilIcon } from 'lucide-react'
import { useMemo } from 'react'
import { MeterTab } from './MeterTab'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'

type ConnectionMeter = {
  relationship: ConnectionMeterAssignment
  meter: Meter
}

interface Props {
  connection: Connection
  meters: ConnectionMeterAssignment[] | null
}

export default function ConnectionsShow({ connection, meters }: Readonly<Props>) {
  const formatDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-'

  const tabs = useMemo(
    () => [
      {
        value: 'details',
        label: 'Connection Details',
        href: connection?.connection_id
          ? route('connections.show', connection?.connection_id)
          : '#',
      },
      {
        value: 'consumer',
        label: 'Consumer',
        href: connection?.connection_id
          ? route('connection.consumer', connection?.connection_id)
          : '#',
      },
      {
        value: 'meter',
        label: 'Meter',
      },
    ],
    [connection]
  )

  const breadcrumbs = useMemo(
    () => [
      { title: 'Connections', href: '/connections' },
      {
        title: connection.consumer_number.toString(),
        href: connection?.connection_id
          ? route('connection.consumer', connection?.connection_id)
          : '#',
      },
    ],
    [connection]
  )

  return (
    <ConnectionsLayout
      connection={connection}
      meters={meters}
      connectionId={connection.connection_id}
      value={'details'}
      heading='Connection Details'
      subHeading='Connection Details'
      breadcrumbs={breadcrumbs}
      connectionsNavItems={connectionsNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <StrongText className='text-2xl font-semibold text-[#252c32]'>
              Connection #{connection?.connection_id}
            </StrongText>
            <span className='text-sm text-gray-600'>
              Consumer No: {connection?.consumer_number}
            </span>
          </div>
        </div>

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
                label='Contract Demand (KVA)'
                value={connection?.contract_demand_kw_val}
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
                value={connection?.admin_office_code}
              />
              <Field
                label='Service Office Code'
                value={connection?.service_office_code}
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

          {/* Dates */}
          <Card className='rounded-lg p-7'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Dates
            </StrongText>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Connected Date'
                value={formatDate(connection?.connected_date)}
              />
              <Field
                label='Effective Start'
                value={formatDate(connection?.effective_start)}
              />
              <Field
                label='Effective End'
                value={formatDate(connection?.effective_end)}
              />
              <Field
                label='Updated At'
                value={formatDate(connection?.updated_at)}
              />
            </div>
          </Card>
        </div>
      </div>
    </ConnectionsLayout>
  )
}
