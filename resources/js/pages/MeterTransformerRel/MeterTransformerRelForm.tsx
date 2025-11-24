import { router } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import MainLayout from '@/layouts/main-layout'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import DatePicker from '@/ui/form/DatePicker'
import { meterNavItems } from '@/components/Navbar/navitems'
import StrongText from '@/typography/StrongText'
import { ParameterValues } from '@/interfaces/parameter_types'
import React from 'react'
import { Meter } from '@/interfaces/data_interfaces'

interface MeterTransformerRelFormProps {
  ctpts: any[]
  meter: Meter
  statuses: ParameterValues[]
  changeReasons: ParameterValues[]
  relation?: any
}

const toYMD = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
}

export default function MeterTransformerRelForm({
  ctpts,
  meter,
  statuses,
  changeReasons,
  relation,
}: MeterTransformerRelFormProps) {
  const isEditing = Boolean(relation)

  const breadcrumbs = [
    { title: 'Meters', href: '/meters' },
    { title: 'Meter CTPT', href: '/meters/' + meter.meter_id },
    //  { title: meter.meter_serial, href: '/meters/' + meter.meter_id },
    {
      title: isEditing ? 'Modify CTPT' : 'Connect CTPT',
      href: route('meters.ctpt.create', { id: meter.meter_id }),
    },
  ]

  const { formData, setFormValue, setAll } = useCustomForm({
    version_id: relation?.version_id ?? null,
    ctpt_id: relation?.ctpt_id ?? null,
    meter_id: meter?.meter_id ?? null,
    status_id: relation?.status_id ?? null,
    change_reason_id: relation?.change_reason_id ?? null,
    faulty_date: toYMD(relation?.faulty_date) ?? '',
    ctpt_energise_date: toYMD(relation?.ctpt_energise_date) ?? '',
    ctpt_change_date: toYMD(relation?.ctpt_change_date) ?? '',
    _method: isEditing ? 'PUT' : undefined,
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    isEditing ? `/meter-ctpt-rel/${relation.version_id}` : '/meter-ctpt-rel'
  )

  const mergedctpts = ctpts?.map((ctpt) => ({
    ...ctpt,
    mergedValue: `#${ctpt?.meter_ctpt_id} - ${ctpt?.type?.parameter_value ?? ''}`,
  }))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <div className='flex flex-col gap-2'>
          <StrongText className='text-2xl font-semibold text-[#252c32]'>
            {isEditing ? 'Edit CTPT' : 'Connect CTPT'}
          </StrongText>
          <span className='text-sm text-gray-600'>Serial: {meter.meter_serial}</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-8'
        >
          <Card>
            <div className='border-b-2 border-gray-200 py-3'>
              <StrongText className='text-base font-semibold'>CTPT Information</StrongText>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
              {ctpts && (
                <SelectList
                  label='CT/PT'
                  value={formData.ctpt_id}
                  setValue={setFormValue('ctpt_id')}
                  list={mergedctpts}
                  dataKey='meter_ctpt_id'
                  displayKey='mergedValue'
                  error={errors.ctpt_id}
                />
              )}
              <Input
                label='Meter'
                value={meter.meter_serial}
                setValue={setFormValue('meter_id')}
                error={errors.meter_id}
                disabled
              />
              {statuses && (
                <SelectList
                  label='Status'
                  value={formData.status_id}
                  setValue={setFormValue('status_id')}
                  list={statuses}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.status_id}
                />
              )}
              {changeReasons && (
                <SelectList
                  label='Change Reason'
                  value={formData.change_reason_id}
                  setValue={setFormValue('change_reason_id')}
                  list={changeReasons}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.change_reason_id}
                />
              )}
            </div>
          </Card>
          <Card>
            <div className='border-b-2 border-gray-200 py-3'>
              <StrongText className='text-base font-semibold'>Dates</StrongText>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
              <DatePicker
                label='Faulty Date'
                value={formData.faulty_date}
                setValue={setFormValue('faulty_date')}
                error={errors.faulty_date}
              />
              <DatePicker
                label='CT/PT Energise Date'
                value={formData.ctpt_energise_date}
                setValue={setFormValue('ctpt_energise_date')}
                error={errors.ctpt_energise_date}
              />
              <DatePicker
                label='CT/PT Change Date'
                value={formData.ctpt_change_date}
                setValue={setFormValue('ctpt_change_date')}
                error={errors.ctpt_change_date}
              />
            </div>
          </Card>
          <div className='flex justify-end gap-3 border-t pt-6'>
            <Button
              type='button'
              label='Cancel'
              variant='secondary'
              onClick={() => router.get('/meter-ctpt-rel')}
              disabled={loading}
            />
            <Button
              type='submit'
              label={isEditing ? 'Update Relation' : 'Create Relation'}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
