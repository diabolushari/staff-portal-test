import { connectionsNavItems } from '@/components/Navbar/navitems'
import SectionCard from '@/components/common/SectionCard'
import Field from '@/components/ui/field'
import { TabsContent } from '@/components/ui/tabs'
import type { Connection, Meter, MeterAssignment } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import StrongText from '@/typography/StrongText'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { useMemo } from 'react'
import { MeterTab } from './MeterTab'

type ConnectionMeter = {
  relationship: MeterAssignment
  meter: Meter
}

interface Props {
  connection: Connection
  meters: ConnectionMeter[] | null
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
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connectionsNavItems}
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
        <TabGroup tabs={tabs}>
          <TabsContent value='details'>
            <div className='space-y-6'>
              {/* Basic Info */}
              <SectionCard
                title='Basic Information'
                editUrl={route('connections.edit', connection?.connection_id)}
              >
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
              </SectionCard>

              {/* Office Info */}
              <SectionCard title='Office Information'>
                <Field
                  label='Admin Office Code'
                  value={connection?.admin_office_code}
                />
                <Field
                  label='Service Office Code'
                  value={connection?.service_office_code}
                />
              </SectionCard>

              {/* Category / Purpose Info */}
              <SectionCard title='Connection Category & Purpose'>
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
              </SectionCard>

              {/* Billing / Tariff Info */}
              <SectionCard title='Billing & Tariff'>
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
              </SectionCard>

              {/* Dates */}
              <SectionCard title='Dates'>
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
              </SectionCard>
            </div>
          </TabsContent>
          <TabsContent value='meter'>
            <MeterTab
              meters={meters}
              connectionId={connection?.connection_id}
            />
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}
