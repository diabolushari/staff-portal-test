import MeterTransformerTab from '@/components/Meter/MeterTransformer/MeterTransfomerTab'
import { meterNavItems } from '@/components/Navbar/navitems'
import SectionCard from '@/components/common/SectionCard'
import Field from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  Meter,
  MeterTimezoneAssignment,
  MeterTransformer,
  MeterTransformerAssignment,
} from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import Button from '@/ui/button/Button'
import { router } from '@inertiajs/react'
import { TabsContent } from '@radix-ui/react-tabs'
import { useMemo, useState } from 'react'

interface ParameterValue {
  id: number
  parameterValue: string
}

export const MeterTabs = (meterId: number, ctptId?: number, relId?: number) => [
  {
    value: 'details',
    label: 'Meter Details',
    href: route('meters.show', meterId),
  },
  {
    value: 'meter-ctpt',
    label: 'Meter CTPT',
  },
]

interface Props {
  meter: Meter
  ctpt: MeterTransformer | null
  currentTimezone: MeterTimezoneAssignment
  timezoneTypes: ParameterValue[]
  relation: MeterTransformerAssignment | null
}

interface StoreForm {
  meter_id: number
  timezone_type_id: string
}

interface UpdateForm {
  rel_id: number
  timezone_type_id: string
  _method: 'PUT'
}
export default function MeterShow({
  meter,
  currentTimezone,
  timezoneTypes,
  ctpt,
  relation,
}: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false)
  const currentTzId = useMemo<string | undefined>(
    () =>
      String(currentTimezone?.timezone_type_id ?? currentTimezone?.timezone_type?.id ?? '') ||
      undefined,
    [currentTimezone]
  )

  const currentTzLabel = useMemo<string | undefined>(
    () => currentTimezone?.timezone_type?.parameter_value ?? undefined,
    [currentTimezone]
  )
  const [selectedTimezone, setSelectedTimezone] = useState<string | undefined>(currentTzId)

  const isUpdate = !!(currentTimezone as any)?.rel_id
  const url = isUpdate
    ? route('meter-timezone-rel.update', {
        meter_timezone_rel: (currentTimezone as any).rel_id,
      })
    : route('meter-timezone-rel.store')

  const { post, loading } = useInertiaPost<StoreForm | UpdateForm>(url, {
    onComplete: () => setIsEditing(false),
  })

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Meters', href: route('meters.index') },
    { title: meter.meter_serial, href: route('meters.show', meter.meter_id) },
  ]

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDelete = () => {
    router.delete(route('meters.destroy', meter.meter_id))
  }

  const handleSave = () => {
    if (!selectedTimezone) return
    const commonData = {
      meter_id: meter.meter_id,
      timezone_type_id: selectedTimezone,
    }
    if (isUpdate) {
      post({
        ...commonData,
        rel_id: currentTimezone.rel_id,
        _method: 'PUT',
      })
    } else {
      post(commonData)
    }
  }

  const handleCancel = () => {
    setSelectedTimezone(currentTzId)
    setIsEditing(false)
  }

  const otherTimezoneOptions = useMemo(
    () => timezoneTypes.filter((t) => String(t.id) !== currentTzId),
    [timezoneTypes, currentTzId]
  )

  const tabs = MeterTabs(meter.meter_id, ctpt?.ctpt_id, ctpt?.version_id)

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterNavItems}
    >
      <TabGroup tabs={tabs}>
        <TabsContent value='details'>
          <div className='space-y-6'>
            {/* General Information */}
            <SectionCard
              title='General Information'
              deleteUrl={route('meters.destroy', meter.meter_id)}
              deleteConfirmMessage='Are you sure you want to delete this meter?'
            >
              <Field
                label='Version ID'
                value={meter.version_id}
              />
              <Field
                label='Meter ID'
                value={meter.meter_id}
              />
              <Field
                label='Meter Serial'
                value={meter.meter_serial}
              />
              <Field
                label='Ownership'
                value={meter?.ownership_type?.parameter_value}
              />
              <Field
                label='Make'
                value={meter?.meter_make?.parameter_value}
              />
              <Field
                label='Type'
                value={meter?.meter_type?.parameter_value}
              />
              <Field
                label='Category'
                value={meter?.meter_category?.parameter_value}
              />
              <Field
                label='Unit'
                value={meter?.meter_unit?.parameter_value}
              />
              <Field
                label='Phase'
                value={meter.meter_phase?.parameter_value}
              />
              <Field
                label='Batch Code'
                value={meter.batch_code}
              />
            </SectionCard>

            {/* Technical Specifications */}
            <SectionCard title='Technical Specifications'>
              <Field
                label='Accuracy Class'
                value={meter?.accuracy_class?.parameter_value}
              />
              <Field
                label='Dialing Factor'
                value={meter?.dialing_factor?.parameter_value}
              />
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
              <Field
                label='Meter MF'
                value={meter?.meter_mf}
              />
              <Field
                label='Company Seal No.'
                value={meter?.company_seal_num}
              />
              <Field
                label='Reset Type'
                value={meter?.meter_reset_type?.parameter_value}
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
                label='Warranty Period (Months)'
                value={meter?.warranty_period}
              />
            </SectionCard>

            {/* CT/PT Specifications */}
            <SectionCard title='CT/PT Specifications'>
              <Field
                label='Programmable PT Ratio'
                value={meter?.programmable_pt_ratio}
              />
              <Field
                label='Programmable CT Ratio'
                value={meter?.programmable_ct_ratio}
              />
              <Field
                label='Internal CT Ratio'
                value={
                  meter?.internal_ct_primary && meter?.internal_ct_secondary
                    ? `${meter?.internal_ct_primary} / ${meter?.internal_ct_secondary}`
                    : '-'
                }
              />
              <Field
                label='Internal PT Ratio'
                value={
                  meter?.internal_pt_primary && meter?.internal_pt_secondary
                    ? `${meter?.internal_pt_primary} / ${meter?.internal_pt_secondary}`
                    : '-'
                }
              />
            </SectionCard>

            {/* Timezone Information */}
            <SectionCard
              title='Timezone Information'
              onEdit={() => setIsEditing(true)}
            >
              {isEditing ? (
                <div className='col-span-2'>
                  <div className='rounded-lg border bg-gray-50 p-6'>
                    <div className='max-w-sm space-y-2'>
                      <Label htmlFor='timezone-select'>Timezone Type</Label>
                      <Select
                        value={selectedTimezone}
                        onValueChange={setSelectedTimezone}
                      >
                        <SelectTrigger id='timezone-select'>
                          <SelectValue placeholder='Select a timezone...' />
                        </SelectTrigger>
                        <SelectContent>
                          {currentTzId && currentTzLabel && (
                            <SelectItem value={currentTzId}>{currentTzLabel}</SelectItem>
                          )}
                          {otherTimezoneOptions.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={String(type.id)}
                            >
                              {type.parameterValue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='mt-6 flex justify-end gap-2'>
                      <Button
                        label='Cancel'
                        onClick={handleCancel}
                        variant='secondary'
                        disabled={loading}
                      />
                      <Button
                        label='Save Changes'
                        onClick={handleSave}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Field
                  label='Timezone Type'
                  value={currentTzLabel || '-'}
                />
              )}
            </SectionCard>

            {/* History */}
            <SectionCard title='History'>
              <Field
                label='Manufacture Date'
                value={formatDate(meter.manufacture_date)}
              />
              <Field
                label='Supply Date'
                value={formatDate(meter.supply_date)}
              />
              <Field
                label='Created At'
                value={formatDate(meter.created_ts)}
              />
              <Field
                label='Last Updated At'
                value={formatDate(meter.updated_ts)}
              />
              <Field
                label='Created By'
                value={meter.created_by}
              />
              <Field
                label='Updated By'
                value={meter.updated_by || '-'}
              />
            </SectionCard>
          </div>
        </TabsContent>
        <TabsContent value='meter-ctpt'>
          <MeterTransformerTab
            meterId={meter.meter_id}
            ctpt={ctpt}
            version_id={relation?.version_id}
          />
        </TabsContent>
      </TabGroup>
    </MainLayout>
  )
}
