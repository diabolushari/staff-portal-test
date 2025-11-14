import { router } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import MainLayout from '@/layouts/main-layout'
import Button from '@/ui/button/Button'

import CheckBox from '@/ui/form/CheckBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { ParameterValues } from '@/interfaces/parameter_types'
import { useEffect, useState } from 'react'
import { Connection, Meter, MeterConnectionMapping } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { BreadcrumbItem } from '@/types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'

const toYMD = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
}

const toISOorNull = (ymd: string) => (ymd ? new Date(ymd).toISOString() : null)
const toNumberOrUndef = (v: unknown) => {
  if (v === null || v === undefined || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export default function ConnectMeter({
  connection_id,
  relation,
  meters,
  useCategory,
  meterStatus,
  changeReason,
  connection,
}: {
  connection_id: number
  relation?: MeterConnectionMapping
  meters: Meter[]
  useCategory: ParameterValues[]
  meterStatus: ParameterValues[]
  changeReason: ParameterValues[]
  connection?: Connection
}) {
  const [isMeterFaulty, setIsMeterFaulty] = useState(false)
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    rel_id: relation?.rel_id,
    connection_id: connection_id,
    meter_id: relation?.meter_id ?? '',
    meter_use_category: relation?.meter_use_category?.id ?? '',
    bidirectional_ind: relation?.bidirectional_ind ?? false,
    meter_billing_mode: relation?.meter_billing_mode ?? '',
    meter_status_id: relation?.meter_status?.id ?? '',
    faulty_date: toYMD(relation?.faulty_date) ?? '',
    rectification_date: toYMD(relation?.rectification_date) ?? '',
    change_reason: relation?.change_reason?.id ?? '',
    sort_priority: relation?.sort_priority ?? '0',
    is_meter_reading_mandatory: relation?.is_meter_reading_mandatory ?? false,
    _method: relation ? 'PUT' : undefined,
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    relation
      ? route('meter-connection-rel.update', connection_id)
      : route('meter-connection-rel.store'),
    {
      showErrorToast: true,
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      ...formData,
      meter_id: toNumberOrUndef(formData.meter_id),
      meter_use_category: toNumberOrUndef(formData.meter_use_category),
      meter_status_id: toNumberOrUndef(formData.meter_status_id),
      faulty_date: toISOorNull(formData.faulty_date),
      rectification_date: toISOorNull(formData.rectification_date),
      change_reason: toNumberOrUndef(formData.change_reason),
    }
    post(payload)
  }

  useEffect(() => {
    const meterStatusValue: ParameterValues | undefined = meterStatus.find(
      (status: ParameterValues) => status.id == Number(formData.meter_status_id)
    )

    setIsMeterFaulty(meterStatusValue?.parameter_value === 'Not Working')
  }, [formData.meter_status_id])
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Connections',
      href: route('connections.index'),
    },

    {
      title: connection?.consumer_number.toString() ?? '',
      href: route('connections.show', connection?.connection_id),
    },
    {
      title: 'Meters',
      href: route('connection.meters', connection?.connection_id),
    },
    {
      title: 'Connect Meter',
      href: route('connection.meter.create', connection?.connection_id),
    },
  ]

  return (
    <ConnectionsLayout
      connectionsNavItems={consumerNavItems}
      breadcrumbs={breadcrumbs}
      value='meter'
      heading='Connect Meter'
      subHeading=''
      connection={connection}
      connectionId={connection?.connection_id ?? 0}
    >
      <div className='p-6'>
        <form
          onSubmit={handleSubmit}
          className='space-y-8'
        >
          <Card>
            <div className='border-b-2 border-gray-200 py-3'>
              <StrongText className='text-base font-semibold'>Connect Meter</StrongText>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
              <SelectList
                label='Meter'
                value={formData.meter_id}
                setValue={setFormValue('meter_id')}
                list={meters}
                dataKey='meter_id'
                displayKey='meter_serial'
                error={errors.meter_id}
                required
                disabled={relation ? true : false}
              />
              <SelectList
                label='Meter Status'
                value={formData.meter_status_id}
                setValue={setFormValue('meter_status_id')}
                list={meterStatus}
                dataKey='id'
                displayKey='parameter_value'
                error={errors.meter_status_id}
                required
              />

              <SelectList
                label='Meter Use Category'
                value={formData.meter_use_category}
                setValue={setFormValue('meter_use_category')}
                list={useCategory}
                dataKey='id'
                displayKey='parameter_value'
                error={errors.meter_use_category}
                required
              />

              <Input
                label='Meter Billing Mode'
                value={formData.meter_billing_mode}
                setValue={setFormValue('meter_billing_mode')}
                error={errors.meter_billing_mode}
              />

              <SelectList
                label='Change Reason'
                value={formData.change_reason}
                setValue={setFormValue('change_reason')}
                list={changeReason}
                dataKey='id'
                displayKey='parameter_value'
                error={errors.change_reason}
                required
              />
              <Input
                label='Sort Priority'
                type='number'
                value={formData.sort_priority}
                setValue={setFormValue('sort_priority')}
                error={errors.sort_priority}
              />

              <CheckBox
                label='Meter Reading Mandatory'
                value={formData.is_meter_reading_mandatory}
                toggleValue={toggleBoolean('is_meter_reading_mandatory')}
                error={errors.is_meter_reading_mandatory}
              />

              <CheckBox
                label='Bidirectional'
                value={formData.bidirectional_ind}
                toggleValue={toggleBoolean('bidirectional_ind')}
                error={errors.bidirectional_ind}
              />
              {isMeterFaulty && (
                <>
                  <DatePicker
                    label='Faulty Date'
                    value={formData.faulty_date}
                    setValue={setFormValue('faulty_date')}
                    error={errors.faulty_date}
                  />
                  <DatePicker
                    label='Rectification Date'
                    value={formData.rectification_date}
                    setValue={setFormValue('rectification_date')}
                    error={errors.rectification_date}
                  />
                </>
              )}
            </div>

            <div className='flex justify-end gap-3 border-t pt-6'>
              <Button
                type='button'
                label='Cancel'
                variant='secondary'
                onClick={() => router.get(route('connections.show', formData.connection_id))}
                disabled={loading}
              />
              <Button
                type='submit'
                label={relation ? 'Save Changes' : 'Connect Meter'}
                disabled={loading}
              />
            </div>
          </Card>
        </form>
      </div>
    </ConnectionsLayout>
  )
}
