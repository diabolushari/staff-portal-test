import MeterTimezoneCard from '@/components/Meter/MeterTimezoneCard'
import MeterTransformerTab from '@/components/Meter/MeterTransformer/MeterTransfomerTab'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import {
  Meter,
  MeterTimezoneType,
  MeterTransformer,
  MeterTransformerAssignment,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import DeleteButton from '@/ui/button/DeleteButton'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { getDisplayDate } from '@/utils'
import { router } from '@inertiajs/react'
import { TabsContent } from '@radix-ui/react-tabs'
import { useMemo } from 'react'

export const MeterTabs = (meterId: number, ctptId?: number, relId?: number) => [
  {
    value: 'details',
    label: 'Meter Details',
    href: route('meters.show', meterId),
  },
]

interface Props {
  meter: Meter
  transformers: MeterTransformer[]
  currentTimezone: MeterTimezoneType
  timezoneTypes: ParameterValues[]
  relation: MeterTransformerAssignment | null
}

// --- MAIN COMPONENT: MeterShow ---
export default function MeterShow({
  meter,
  currentTimezone,
  timezoneTypes,
  transformers,
  relation,
}: Readonly<Props>) {
  const currentTzId = useMemo<string | undefined>(
    () =>
      String(currentTimezone?.timezone_type_id ?? currentTimezone?.timezone_type?.id ?? '') ||
      undefined,
    [currentTimezone]
  )

  // --- BREADCRUMBS AND FORMATTERS ---
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Meters',
      href: route('meters.index'),
    },
    {
      title: meter.meter_serial,
      href: route('meters.show', meter.meter_id),
    },
  ]

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // --- EVENT HANDLERS ---
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this meter?')) {
      router.delete(route('meters.destroy', meter.meter_id))
    }
  }

  const tabs = MeterTabs(
    meter.meter_id,
    transformers.length > 0 ? transformers[0].ctpt_id : null,
    transformers.length > 0 ? transformers[0].version_id : null
  )

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Meter'
    >
      <TabGroup tabs={tabs}>
        <TabsContent value='details'>
          <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
            {/* Header */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex flex-col gap-2'>
                <StrongText className='text-2xl font-semibold text-[#252c32]'>
                  {meter.meter_serial}
                </StrongText>
                <span className='text-sm text-gray-600'>Meter Details</span>
              </div>
              <DeleteButton onClick={handleDelete} />
            </div>

            {/* Main Content Card */}

            {/* --- General Information --- */}
            <Card className='rounded-lg p-7'>
              <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
                General Information
              </StrongText>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Field
                  label='Meter ID'
                  value={meter.meter_id}
                />
                <Field
                  label='Version ID'
                  value={meter.version_id}
                />
                <Field
                  label='Smart Meter'
                  value={meter.smart_meter_ind ? 'Yes' : 'No'}
                />
                <Field
                  label='Bidirectional'
                  value={meter.bidirectional_ind ? 'Yes' : 'No'}
                />
                <Field
                  label='Meter Serial'
                  value={meter.meter_serial}
                />
                <Field
                  label='Company Seal Number'
                  value={meter.company_seal_num}
                />
                <Field
                  label='Meter Type'
                  value={meter?.meter_type?.parameter_value}
                />
                <Field
                  label='Timezone Type'
                  value={meter?.timezone_type?.parameter_value}
                />
                <Field
                  label='Meter Profile'
                  value={meter?.meter_profile?.parameter_value}
                />
                <Field
                  label='Ownership Type'
                  value={meter?.ownership_type?.parameter_value}
                />
                <Field
                  label='Meter Make'
                  value={meter?.meter_make?.parameter_value}
                />

                {/* <Field
                  label='Category'
                  value={meter?.meter_category?.parameter_value}
                /> */}

                <Field
                  label='Batch Code'
                  value={meter.batch_code}
                />
              </div>
            </Card>

            {/* --- Technical Specifications --- */}
            <Card className='rounded-lg p-7'>
              <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
                Technical Specifications
              </StrongText>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Field
                  label='Accuracy Class'
                  value={meter?.accuracy_class?.parameter_value}
                />
                <Field
                  label='Dialing Factor'
                  value={meter?.dialing_factor?.parameter_value}
                />
                <Field
                  label='Unit'
                  value={meter?.meter_unit?.parameter_value}
                />
                <Field
                  label='Reset Type'
                  value={meter?.meter_reset_type?.parameter_value}
                />
                <Field
                  label='Phase'
                  value={meter?.meter_phase?.parameter_value}
                />
                <div></div>
                <Field
                  label='Digit Count'
                  value={meter?.digit_count}
                />
                <Field
                  label='Decimal Digit Count'
                  value={meter?.decimal_digit_count}
                />
                <Field
                  label='Meter Constant'
                  value={meter?.meter_constant}
                />
                {/* <Field
                  label='Meter MF'
                  value={meter?.meter_mf}
                /> */}

                <Field
                  label='Warranty Period (Months)'
                  value={meter?.warranty_period}
                />
              </div>
            </Card>

            {/* --- CT/PT Specifications --- */}
            <Card className='rounded-lg p-7'>
              <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
                CT/PT Specifications
              </StrongText>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* <Field
                  label='Programmable PT Ratio'
                  value={meter?.programmable_pt_ratio}
                />
                <Field
                  label='Programmable CT Ratio'
                  value={meter?.programmable_ct_ratio}
                /> */}
                <Field
                  label='Internal CT Ratio'
                  value={
                    meter?.internal_ct_primary && meter?.internal_ct_secondary
                      ? `${meter.internal_ct_primary} / ${meter.internal_ct_secondary}`
                      : '-'
                  }
                />
                <Field
                  label='Internal PT Ratio'
                  value={
                    meter?.internal_pt_primary && meter?.internal_pt_secondary
                      ? `${meter.internal_pt_primary} / ${meter.internal_pt_secondary}`
                      : '-'
                  }
                />
              </div>
            </Card>

            {/* --- Timezone Information --- */}
            <MeterTimezoneCard
              meter={meter}
              currentTimezone={currentTimezone}
              timezoneTypes={timezoneTypes}
            />

            {/* --- History --- */}
            <Card className='rounded-lg p-7'>
              <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
                History
              </StrongText>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Field
                  label='Manufacture Date'
                  value={getDisplayDate(meter.manufacture_date)}
                />
                <Field
                  label='Supply Date'
                  value={getDisplayDate(meter.supply_date)}
                />
                <Field
                  label='Created At'
                  value={getDisplayDate(meter.created_ts)}
                />
                <Field
                  label='Last Updated At'
                  value={getDisplayDate(meter.updated_ts)}
                />
                <Field
                  label='Created By'
                  value={meter.created_by}
                />
                <Field
                  label='Updated By'
                  value={meter.updated_by || '-'}
                />
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='meter-ctpt'>
          <MeterTransformerTab
            meterId={meter.meter_id}
            transformers={transformers}
            version_id={relation?.version_id}
          />
        </TabsContent>
      </TabGroup>
    </MainLayout>
  )
}
