import useCustomForm from '@/hooks/useCustomForm'
import useFetchList from '@/hooks/useFetchList'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Office } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/parameter_types'
import AppLayout from '@/layouts/app-layout'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offices',
    href: '/offices',
  },
  {
    title: 'Add Office',
    href: '/offices/create',
  },
]
interface Props {
  parameterValues: ParameterValues[]
  office?: Office
}
export default function OfficeForm({ parameterValues, office }: Props) {
  const [sortPriority, setSortPriority] = useState<number | null | undefined>(null)
  const [parentOfficeData, setParentOfficeData] = useState<Office | null>(null)

  const { formData, setFormValue } = useCustomForm({
    office_name: office?.office_name ?? '',
    office_code: office?.office_code.toString() ?? '',
    office_description: office?.office_description ?? '',
    office_type_id: office?.office_type_id ?? '',
    parent_office_id: office?.parent_office_id ?? '',
    effective_start: office?.effective_start ?? '',
    effective_end: office?.effective_end ?? '',
    contact_folio: office?.contact_folio ?? {},
    phone: office?.contact_folio?.phone ?? '',
    email: office?.contact_folio?.email ?? '',
    name: office?.contact_folio?.name ?? '',
    address: office?.contact_folio?.address ?? '',
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

  const [data] = useFetchList<{ success: boolean; data: Office[] }>(
    `/api/office/${office?.parent_office_id ? office.parent_office_id : 0}`
  )

  useEffect(() => {
    const sortPriorityValue = parameterValues.find(
      (item: ParameterValues) => item.id == Number(formData.office_type_id)
    )
    setSortPriority(sortPriorityValue?.sort_priority)
  }, [formData.office_type_id])

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
    console.log('form data:', formData)

    const contactFolioData = {
      phone: formData.phone,
      email: formData.email,
      name: formData.name,
      address: formData.address,
    }
    const completeFormData = {
      office_name: formData.office_name,
      office_code: formData.office_code,
      office_description: formData.office_description,
      office_type_id: formData.office_type_id,
      parent_office_id: formData.parent_office_id,
      effective_start: formData.effective_start,
      effective_end: formData.effective_end,
      contact_folio: contactFolioData,
    }
    e.preventDefault()
    post(office ? { ...completeFormData, _method: 'PUT' } : completeFormData)
  }
  return (
    <MainLayout breadcrumb={breadcrumbs}>
      <div className='p-4 text-gray-800 dark:text-gray-100'>
        <CardHeader
          title='Offices'
          subheading={office ? 'Edit Office' : 'Add a new office.'}
        />
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <Input
              label='Office Code'
              setValue={setFormValue('office_code')}
              value={formData.office_code}
              error={errors?.office_code}
              type='text'
            />
            <Input
              label='Name'
              setValue={setFormValue('office_name')}
              value={formData.office_name}
              error={errors?.office_name}
              type='text'
            />
            <TextArea
              label='Office Description'
              setValue={setFormValue('office_description')}
              value={formData.office_description}
              error={errors?.office_description}
            />

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
            <div className='col-span-2 flex flex-col'>
              <Heading>Contact Folio</Heading>
            </div>
            <Input
              label='Email'
              setValue={setFormValue('email')}
              value={formData.email}
              placeholder='Type your Email'
              error={errors?.email}
              type='email'
            />

            <Input
              label='Phone'
              setValue={setFormValue('phone')}
              value={formData.phone}
              placeholder='Type your Phone'
              error={errors?.phone}
              type='number'
            />

            <Input
              label='Name'
              setValue={setFormValue('name')}
              value={formData.name}
              placeholder='Type your Name'
              error={errors?.name}
              type='text'
            />

            <TextArea
              label='Address'
              setValue={setFormValue('address')}
              value={formData.address}
              placeholder='Type your Address'
              error={errors?.address}
            />

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
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={loading}
              label='Submit'
              variant='primary'
            />
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
