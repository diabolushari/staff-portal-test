import { Card } from '@/components/ui/card'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import Field from '@/components/ui/field'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { MeterTransformer } from '@/interfaces/data_interfaces'

interface Props {
  transformer: MeterTransformer
}

export default function MeterTransformerShow({ transformer }: Readonly<Props>) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    { title: 'Settings', href: '/settings-page' },
    { title: 'CTPTs', href: '/meter-ctpt' },
    { title: 'Detail', href: `/meter-ctpt/${transformer.meter_ctpt_id}` },
  ]

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='CTPTs'
      title={transformer.ctpt_serial}
    >
      {/* Main Content Card */}
      <Card className='rounded-lg p-7'>
        <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
          General Information
        </StrongText>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Field
            label='Type'
            value={transformer.type?.parameter_value}
          />
          <Field
            label='CTPT Serial'
            value={transformer.ctpt_serial}
          />
          <Field
            label='Ownership Type'
            value={transformer.ownership_type?.parameter_value}
          />
          <Field
            label='Make'
            value={transformer.make?.parameter_value}
          />
        </div>
      </Card>

      {/* Technical Specifications */}
      <Card className='rounded-lg p-7'>
        <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
          Technical Specifications
        </StrongText>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Field
            label='Internal Ratio'
            value={
              transformer.ratio_primary_value && transformer.ratio_secondary_value
                ? `${transformer.ratio_primary_value} / ${transformer.ratio_secondary_value}`
                : '-'
            }
          />
          <Field
            label='Accuracy Class'
            value={transformer.accuracy_class?.parameter_value}
          />
          <Field
            label='Burden'
            value={transformer.burden?.parameter_value}
          />
          <Field
            label='Manufacture Date'
            value={formatDate(transformer.manufacture_date)}
          />
        </div>
      </Card>

      {/* History */}
      <Card className='rounded-lg p-7'>
        <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
          History
        </StrongText>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Field
            label='Created At'
            value={formatDate(transformer.created_ts)}
          />
          <Field
            label='Last Updated At'
            value={formatDate(transformer.updated_ts)}
          />
        </div>
      </Card>
    </MainLayout>
  )
}
