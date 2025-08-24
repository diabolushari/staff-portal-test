import { Office } from '@/interfaces/consumers'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import SelectList from '@/ui/form/SelectList'
import ComboBox from '@/ui/form/ComboBox'
import Button from '@/ui/button/Button'
import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'

interface Props {
  parameterValues: ParameterValues[]
  office?: Office
}

export default function OfficeForm({ parameterValues, office }: Readonly<Props>) {
  const [sortPriority, setSortPriority] = useState<number | null | undefined>(null)
  const [parentOfficeData, setParentOfficeData] = useState<Office | null>(
    office?.parent_office ?? null
  )

  const { formData, setFormValue } = useCustomForm({
    office_name: office?.office_name ?? '',
    office_code: office?.office_code.toString() ?? '',
    office_description: office?.office_description ?? '',
    office_type_id: office?.office_type_id ?? '',
    parent_office_id: office?.parent_office_id ?? '',
    _method: office != null ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    office ? route('offices.update', office.office_id) : route('offices.store'),
    {
      showErrorToast: true,
      onComplete: () => {
        router.visit(route('offices.index'))
      },
    }
  )

  useEffect(() => {
    const sortPriorityValue = parameterValues.find(
      (item: ParameterValues) => item.id == Number(formData.office_type_id)
    )
    setSortPriority(sortPriorityValue?.sort_priority)
  }, [formData.office_type_id, parameterValues])

  const handleParentOfficeChange = (item: Office | null) => {
    if (item) {
      setFormValue('parent_office_id')(item?.office_id ?? '')
      setParentOfficeData(item)
    } else {
      setFormValue('parent_office_id')('')
      setParentOfficeData(null)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(office != null ? { ...formData } : formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <Card>
        <div className='flex justify-between border-b-2 border-gray-200 py-4'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-8 p-4 md:grid-cols-2'>
          <SelectList
            label='Office Type'
            setValue={setFormValue('office_type_id')}
            value={formData.office_type_id}
            placeholder='Select Office Type'
            error={errors?.office_type_id}
            dataKey='id'
            displayKey='parameter_value'
            list={parameterValues}
          />
          <Input
            label='Name'
            setValue={setFormValue('office_name')}
            value={formData.office_name}
            error={errors?.office_name}
            type='text'
          />
          <Input
            label='Office Code'
            setValue={setFormValue('office_code')}
            value={formData.office_code}
            error={errors?.office_code}
            type='number'
            disabled={office != null}
          />

          <TextArea
            label='Office Description'
            setValue={setFormValue('office_description')}
            value={formData.office_description}
            error={errors?.office_description}
          />

          {formData.office_type_id &&
            Number(formData.office_type_id) > 1 &&
            sortPriority !== null && (
              <ComboBox
                label='Parent Office'
                url={`/api/offices?sortPriority=${sortPriority}&q=`}
                setValue={handleParentOfficeChange}
                value={parentOfficeData}
                placeholder='Select Parent Office'
                error={errors?.parent_office_id}
                dataKey='office_id'
                displayKey='office_name'
                displayValue2='office_code'
              />
            )}
        </div>
      </Card>

      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={loading}
          label='Submit'
          variant='primary'
        />
      </div>
    </form>
  )
}
