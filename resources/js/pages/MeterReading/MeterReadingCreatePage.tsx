import MeterReadingForm from '@/components/Meter/MeterReading/MeterReadingForm'
import MeterEntryForm from '@/components/Meter/MeterReading/MeterReadingForm'
import { connectionsNavItems, meterReadingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import { Connection, ConsumerData } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'

interface Props {
  connectionWithConsumer: ConsumerData
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
}

export default function MeterReadingCreatePage({
  connectionWithConsumer,
  meterHealthTypes,
  ctptHealthTypes,
  anomalyTypes,
}: Readonly<Props>) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Meter Reading',
      href: `/meter-reading/${connectionWithConsumer?.connection?.connection_id}/create`,
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
              Organization Name: {connectionWithConsumer?.consumer?.organization_name}
            </StrongText>
          </div>
          <hr className='mb-6 border-[#e5e9eb]' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Field
              label='Tariff'
              value={connectionWithConsumer?.connection?.tariff?.parameter_value}
            />
            <Field
              label='Purpose'
              value={connectionWithConsumer?.connection?.primary_purpose?.parameter_value}
            />
          </div>
        </Card>
        {connectionWithConsumer?.connection?.connection_id && (
          <MeterReadingForm
            connection_id={connectionWithConsumer?.connection?.connection_id}
            meterHealthTypes={meterHealthTypes}
            ctptHealthTypes={ctptHealthTypes}
            anomalyTypes={anomalyTypes}
          />
        )}
      </div>
    </MainLayout>
  )
}
