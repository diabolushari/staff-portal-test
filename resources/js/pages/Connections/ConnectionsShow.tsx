import { router } from '@inertiajs/react'
import { Calendar, PencilIcon } from 'lucide-react'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import type { Connection } from '@/interfaces/consumers'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { MeterTab } from './MeterTab'
import Field from '@/components/ui/field'
import ConnectionsLayout, { connectionTabs } from '@/layouts/connection/ConnectionsLayout'
import MeterReadingTab from '@/components/Connections/MeterReadingTab'

export default function ConnectionsShow({
  connection,
  meters,
}: Readonly<{
  connection: Connection
  meters: any
}>) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Connections', href: '/connections' },
    {
      title: 'Show',
      href: connection?.connection_id
        ? route('connection.consumer', connection?.connection_id)
        : '#',
    },
  ]

  const formatDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-'

  return (
    <ConnectionsLayout
      connection={connection}
      meters={meters}
      connectionId={connection?.connection_id}
      value='details'
      breadcrumbs={breadcrumbs}
      connectionsNavItems={connectionsNavItems}
      heading={`Connection #${connection?.connection_id}`}
      subHeading={`Consumer No: ${connection?.consumer_number}`}
      onEdit={() => router.visit(route('connections.edit', connection?.connection_id))}
    >
      {/* Header */}

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
    </ConnectionsLayout>
  )
}
