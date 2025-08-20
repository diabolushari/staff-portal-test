import useCustomForm from '@/hooks/useCustomForm'
import useFetchList from '@/hooks/useFetchList'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Office } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/paramater_types'
import AppLayout from '@/layouts/app-layout'
import Heading from '@/typography/Heading'
import Button from '@/ui/button/Button'
import CardHeader from '@/ui/Card/CardHeader'
import ComboBox from '@/ui/form/ComboBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

export default function OfficeForm({
  parameterValues,
  office,
}: {
  parameterValues: ParameterValues[]
  office?: Office
}) {
  const [sortPriority, setSortPriority] = useState<number | null | undefined>(null)

  const { formData: contactFolioForm, setFormValue: setContactFolioValue } = useCustomForm({
    phone: office?.contact_folio?.phone ?? '',
    email: office?.contact_folio?.email ?? '',
    name: office?.contact_folio?.name ?? '',
    address: office?.contact_folio?.address ?? '',
  })

  const { formData, setFormValue } = useCustomForm({
    office_name: office?.office_name ?? '',
    office_code: office?.office_code.toString() ?? '',
    office_description: office?.office_description ?? '',
    office_type_id: office?.office_type_id ?? '',
    parent_office_id: office?.parent_office_id ?? '',
    effective_start: office?.effective_start ?? '',
    effective_end: office?.effective_end ?? '',
    contact_folio: office?.contact_folio ?? {},
  })
  const [parentOfficeData, setParentOfficeData] = useState<Office | null>(null)
  const [data] = useFetchList<{ success: boolean; data: Office[] }>(
    `/api/office/${office?.parent_office_id ? office.parent_office_id : 0}`
  )
  console.log(data)
  useEffect(() => {
    const sortPriorityValue = parameterValues.find(
      (item: ParameterValues) => item.id == Number(formData.office_type_id)
    )
    setSortPriority(sortPriorityValue?.sort_priority)
  }, [formData.office_type_id])

  const { post, errors, loading } = useInertiaPost(
    office ? route('offices.update', office.office_id) : route('offices.store'),
    {
      showErrorToast: true,
      onComplete: () => {
        router.visit(route('offices.index'))
      },
    }
  )
  const handleParrentOfficeChange = (item: Office | null) => {
    if (item) {
      setFormValue('parent_office_id')(item?.office_id ?? '')
      setParentOfficeData(item)
    } else {
      setFormValue('parent_office_id')('')
      setParentOfficeData(null)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('form data:', formData)

    const completeFormData = { ...formData, contact_folio: contactFolioForm }
    e.preventDefault()
    post(office ? { ...completeFormData, _method: 'PUT' } : completeFormData)
  }
  console.log('data:', office, parameterValues)
  return (
    <AppLayout>
      <div className='p-4 text-gray-800 dark:text-gray-100'>
        <CardHeader
          title='Offices'
          subheading={office ? 'Edit Office' : 'Add a new office.'}
        />
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex flex-col'>
              <Input
                label='Office Name'
                setValue={setFormValue('office_name')}
                value={formData.office_name}
                placeholder='Type your Office Name'
                error={errors?.office_name}
                type='text'
              />
            </div>
            <div className='flex flex-col'>
              <Input
                label='Office Code'
                setValue={setFormValue('office_code')}
                value={formData.office_code}
                placeholder='Type your Office Code'
                error={errors?.office_code}
                type='number'
              />
            </div>
            <div className='flex flex-col'>
              <TextArea
                label='Office Description'
                setValue={setFormValue('office_description')}
                value={formData.office_description}
                placeholder='Type your Office Description'
                error={errors?.office_description}
              />
            </div>
            <div className='flex flex-col'>
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
            </div>
            <div className='flex flex-col'>
              {formData.office_type_id &&
                Number(formData.office_type_id) > 1 &&
                sortPriority !== null && (
                  <ComboBox
                    label='Parrent Office'
                    url={`/api/offices?sortPriority=${sortPriority}&q=`}
                    setValue={handleParrentOfficeChange}
                    value={parentOfficeData}
                    placeholder='Select Parrent Office'
                    error={errors?.parent_office_id}
                    dataKey='office_id'
                    displayKey='office_name'
                    displayValue2='office_code'
                  />
                )}
            </div>
            <div className='col-span-2 flex flex-col'>
              <Heading>Contact Folio</Heading>
            </div>
            <div className='flex flex-col'>
              <Input
                label='Email'
                setValue={setContactFolioValue('email')}
                value={contactFolioForm.email}
                placeholder='Type your Email'
                error={errors?.email}
                type='email'
              />
            </div>
            <div className='flex flex-col'>
              <Input
                label='Phone'
                setValue={setContactFolioValue('phone')}
                value={contactFolioForm.phone}
                placeholder='Type your Phone'
                error={errors?.phone}
                type='number'
              />
            </div>
            <div className='flex flex-col'>
              <Input
                label='Name'
                setValue={setContactFolioValue('name')}
                value={contactFolioForm.name}
                placeholder='Type your Name'
                error={errors?.name}
                type='text'
              />
            </div>
            <div className='flex flex-col'>
              <TextArea
                label='Address'
                setValue={setContactFolioValue('address')}
                value={contactFolioForm.address}
                placeholder='Type your Address'
                error={errors?.address}
              />
            </div>
            <div className='flex flex-col'>
              <DatePicker
                label='Effective Start  Date'
                setValue={(date: string) => {
                  console.debug('Start Date changed:', date)
                  setFormValue('effective_start')(date)
                }}
                value={formData.effective_start}
                placeholder='Select Effective Start Date'
                error={errors?.effective_start}
              />
            </div>
            <div className='flex flex-col'>
              <DatePicker
                label='Effective End Date'
                setValue={(date: string) => {
                  console.debug('End Date changed:', date)
                  setFormValue('effective_end')(date)
                }}
                value={formData.effective_end}
                placeholder='Select Effective End Date'
                error={errors?.effective_end}
              />
            </div>
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={loading}
              label='Submit'
            />
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
