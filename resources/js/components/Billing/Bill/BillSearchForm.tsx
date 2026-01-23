import useCustomForm from '@/hooks/useCustomForm'
import { BillingGroup } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import ComboBox from '@/ui/form/ComboBox'
import Input from '@/ui/form/Input'
import MonthPicker from '@/ui/form/MonthPicker'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

export default function BillSearchForm({
  filters,
}: {
  filters: {
    search: string
    billingGroupId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
  }
}) {
  const [selectedGroup, setSelectedGroup] = useState<BillingGroup | null>(null)
  useEffect(() => {
    if (selectedGroup) {
      setFormValue('group_id')(selectedGroup.billing_group_id.toString())
    }
  }, [selectedGroup])
  const { formData, setFormValue, setAll } = useCustomForm({
    search: filters?.search ?? '',
    group_id: filters?.billingGroupId ?? '',
    sort_by: 'reading_year_month',
    sort_direction: 'desc',
  })

  // 👇 Prevent useEffect from firing on first render
  const isFirstRender = useRef(true)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get('/bills', formData, {
      preserveState: true,
      replace: true,
    })
  }

  // 👇 Auto submit when sort changes (NOT on first load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    router.get(
      '/bills',
      {
        search: formData.search,
        sort_by: formData.sort_by,
        sort_direction: formData.sort_direction,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }, [formData.sort_by, formData.sort_direction])

  const sortList = [
    { id: 1, label: 'Group', value: 'group_name' },
    { id: 2, label: 'Billing Month Year', value: 'bill_year_month' },
    { id: 3, label: 'Reading Month Year', value: 'reading_year_month' },
  ]

  const sortOrderList = [
    { id: 1, label: 'Ascending', value: 'asc' },
    { id: 2, label: 'Descending', value: 'desc' },
  ]

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <div className='grid grid-cols-3 gap-4'>
          <Input
            label='Connection'
            value={formData.search}
            setValue={setFormValue('search')}
            showClearButton
            placeholder='eg: Commercial'
          />
          <ComboBox
            label=''
            url={`/api/billing-groups?q=`}
            setValue={setSelectedGroup}
            value={selectedGroup}
            dataKey='billing_group_id'
            displayKey='name'
            placeholder='Search by Group'
            className='w-full'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Button
            label='Reset'
            type='button'
            variant='secondary'
            onClick={() => {
              setSelectedGroup(null)
              setAll({
                search: '',
                group_id: '',
                sort_by: 'reading_year_month',
                sort_direction: 'desc',
              })
            }}
          />
          <Button
            label='Search'
            type='submit'
          />
        </div>
      </form>
    </div>
  )
}
