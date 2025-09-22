import MeterEntryForm from '@/components/Meter/MeterEntry/MeterEntryForm'
import { meterEntryNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'

interface Props {
  connection: any
}

export default function MeterEntryCreatePage({ connection }: Readonly<Props>) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Meter Entry',
      href: `/meter-entry/${connection?.connection_id}/create`,
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={meterEntryNavItems}
    >
      <div className='flex flex-col gap-6'>
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
        <MeterEntryForm />
      </div>
    </MainLayout>
  )
}
