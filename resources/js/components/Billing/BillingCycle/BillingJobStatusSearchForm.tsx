import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import MonthPicker from '@/ui/form/MonthPicker'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect } from 'react'

export default function BillingJobStatusSearchForm({
  filters,
}: {
  filters: {
    search: string
  }
}) {
  const { formData, setFormValue } = useCustomForm({
    search: filters?.search ?? '',
    group: '',
    billing_month_from: '',
    billing_month_to: '',
    sort_by: 'reading_year_month',
    sort_direction: 'asc',
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get('/bills/job-status', formData, {
      preserveState: true,
      replace: true,
    })
  }
  const sortList = [
    {
      id: 1,
      label: 'Group',
      value: 'group_name',
    },
    {
      id: 2,
      label: 'Billing Month Year',
      value: 'bill_year_month',
    },
    {
      id: 3,
      label: 'Reading Month Year',
      value: 'reading_year_month',
    },
    {
      id: 4,
      label: 'Initiated At',
      value: 'initilized_date',
    },
  ]

  const sortOrderList = [
    {
      id: 1,
      label: 'Ascending',
      value: 'asc',
    },
    {
      id: 2,
      label: 'Descending',
      value: 'desc',
    },
  ]
  useEffect(() => {
    router.get('/bills/job-status', formData, {
      preserveState: true,
      replace: true,
    })
  }, [formData.sort_by, formData.sort_direction])
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <div className='grid grid-cols-3 gap-4'>
          <Input
            label='Group'
            value={formData.search}
            setValue={setFormValue('search')}
            showClearButton={true}
            placeholder='eg: Commericial'
          />
          <div className='mt-1'>
            <MonthPicker
              label='Billing Month From'
              value={formData.billing_month_from}
              setValue={setFormValue('billing_month_from')}
            />
          </div>
          <div className='mt-1'>
            <MonthPicker
              label='Billing Month To'
              value={formData.billing_month_to}
              setValue={setFormValue('billing_month_to')}
            />
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            label='Reset'
            type='button'
            variant='secondary'
          />
          <Button
            label='Search'
            type='submit'
          />
        </div>
      </form>
      <div className='flex items-center justify-end gap-2'>
        <SelectList
          label='Sort By'
          list={sortList}
          dataKey='value'
          displayKey='label'
          value={formData.sort_by}
          setValue={setFormValue('sort_by')}
        />
        <SelectList
          label='Sort Order'
          list={sortOrderList}
          dataKey='value'
          displayKey='label'
          value={formData.sort_direction}
          setValue={setFormValue('sort_direction')}
        />
      </div>
    </div>
  )
}
