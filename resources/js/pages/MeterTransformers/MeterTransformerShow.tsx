import { router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@radix-ui/react-tabs'
import Field from '@/components/ui/field'
import { meterNavItems } from '@/components/Navbar/navitems'

interface ParameterValue {
  parameter_value: string
}

export interface MeterTransformer {
  meter_ctpt_id: number
  ctpt_serial: string
  ratio_primary_value: string
  ratio_secondary_value: string
  manufacture_date: string | null
  ownership_type: ParameterValue
  accuracy_class: ParameterValue
  burden: ParameterValue
  make: ParameterValue
  type: ParameterValue
  // status: ParameterValue;
  // change_reason: ParameterValue;
  // faulty_date: string | null;
  // rectification_date: string | null;
  created_ts: string
  updated_ts: string
  is_active: boolean
}

interface Relation {
  meter_id: number
  version_id: number
}

interface Props {
  transformer: MeterTransformer
  relation?: Relation
}

export default function MeterTransformerShow({ transformer, relation }: Readonly<Props>) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Meter CTPT', href: '/meter-ctpt' },
    { title: 'Detail', href: `/meter-ctpt/${transformer.meter_ctpt_id}` },
  ]

  const tabs = [
    {
      value: 'details',
      label: 'Meter Details',
      href: relation ? route('meters.show', relation.meter_id) : '#',
    },
    {
      value: 'meter-ctpt',
      label: 'Meter CTPT',
      href: route('meter-ctpt.show', transformer.meter_ctpt_id),
    },
    {
      value: 'meter-ctpt-rel',
      label: 'Meter CTPT Relations',
      href: relation ? route('meter-ctpt-rel.show', relation.version_id) : '#',
    },
  ]

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transformer?')) {
      router.delete(`/meter-ctpt/${transformer.meter_ctpt_id}`)
    }
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header Section */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center justify-between'>
            <StrongText className='text-2xl font-semibold text-[#252c32]'>
              {transformer.ctpt_serial}
            </StrongText>
            {/* <Button
							label="Delete Transformer"
							onClick={handleDelete}
							variant="destructive"
						/> */}
          </div>
        </div>

        {/* Main Content Card */}
        <Card className='rounded-lg p-7'>
          <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
            General Information
          </StrongText>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Field
              label='CTPT Serial'
              value={transformer.ctpt_serial}
            />
            <Field
              label='Ownership'
              value={transformer.ownership_type?.parameter_value}
            />
            <Field
              label='Make'
              value={transformer.make?.parameter_value}
            />
            <Field
              label='Type'
              value={transformer.type?.parameter_value}
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
      </div>
    </MainLayout>
  )
}
