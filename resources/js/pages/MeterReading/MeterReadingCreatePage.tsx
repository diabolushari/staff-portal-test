import MeterReadingForm from '@/components/Meter/MeterReading/MeterReadingForm'
import MeterEntryForm from '@/components/Meter/MeterReading/MeterReadingForm'
import { connectionsNavItems, meterReadingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import { Connection } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/parameter_types'
import { connectionTabs } from '@/layouts/connection/ConnectionsLayout'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@radix-ui/react-tabs'

interface Props {
  connection: Connection
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
}

export default function MeterReadingCreatePage({
  connection,
  meterHealthTypes,
  ctptHealthTypes,
  anomalyTypes,
}: Readonly<Props>) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Meter Reading',
      href: `/meter-reading/${connection?.connection_id}/create`,
    },
  ]
  const tabs = [
    {
      value: 'details',
      label: 'Connection Details',
      href: connection?.connection_id ? route('connections.show', connection?.connection_id) : '#',
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
    {
      value: 'metering',
      label: 'Metering',
      href: route('meter-reading.create', connection?.connection_id),
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={connectionsNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        <Card className='rounded-lg p-7'>
          <div className='mb-6 flex items-center justify-between'>
            <StrongText className='text-base font-semibold text-[#252c32]'>
              Connection Details
            </StrongText>
          </div>
          <hr className='mb-6 border-[#e5e9eb]' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <Field
              label='Year'
              value={new Date().getFullYear()}
            />
            <Field
              label='Month'
              value={new Date().toLocaleString('default', { month: 'long' })}
            />
            <Field
              label='Consumer Number'
              value={connection?.consumer_number}
            />
            <Field
              label='Organizaion name'
              value={connection?.organization_name}
            />
            <Field
              label='Legacy Code'
              value={connection?.consumer_legacy_code}
            />
            <Field
              label='Voltage'
              value={connection?.voltage?.parameter_value}
            />
            <Field
              label='Contract Demand (KVA)'
              value={connection?.contract_demand_kw_val}
            />
            <Field
              label='Connected Load'
              value={connection?.connected_load_kw_val}
            />
            <Field
              label='CT ratio'
              value={connection?.ct_ratio}
            />
            <Field
              label='Tariff'
              value={connection?.tariff?.parameter_value}
            />
            <Field
              label='Purpose'
              value={connection?.primary_purpose?.parameter_value}
            />
          </div>
        </Card>
        <MeterReadingForm
          connection_id={connection?.connection_id}
          meterHealthTypes={meterHealthTypes}
          ctptHealthTypes={ctptHealthTypes}
          anomalyTypes={anomalyTypes}
        />
      </div>
    </MainLayout>
  )
}
