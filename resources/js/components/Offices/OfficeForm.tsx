import { Office } from '@/interfaces/consumers'
import useCustomForm from '@/hooks/useCustomForm'
import useFetchList from '@/hooks/useFetchList'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import { useState } from 'react'
import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import SelectList from '@/ui/form/SelectList'
import ComboBox from '@/ui/form/ComboBox'
import Heading from '@/typography/Heading'
import DatePicker from '@/ui/form/DatePicker'
import Button from '@/ui/button/Button'
import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import ContactFolioModal from './ContactFolioModal'

export default function OfficeForm({
  parameterValues,
  office,
}: {
  parameterValues: ParameterValues[]
  office?: Office
}) {
  const [sortPriority, setSortPriority] = useState<number | null | undefined>(null)
  const [parentOfficeData, setParentOfficeData] = useState<Office | null>(null)
  const [showModal, setShowModal] = useState(false)

  const { formData, setFormValue } = useCustomForm({
    office_name: office?.office_name ?? '',
    office_code: office?.office_code.toString() ?? '',
    office_description: office?.office_description ?? '',
    office_type_id: office?.office_type_id ?? '',
    parent_office_id: office?.parent_office_id ?? '',
    effective_start: office?.effective_start ?? '',
    effective_end: office?.effective_end ?? '',
    contact_folio: office?.contact_folio ?? [],
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
  const handleModal = () => {
    setShowModal(!showModal)
  }
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

    e.preventDefault()
    post(office ? { ...formData, _method: 'PUT' } : formData)
  }

  const handleContactRemove = (contact: {
    phone: string
    email: string
    name: string
    employee_id: string
  }) => {
    const updatedContactFolio = formData.contact_folio.filter((item) => item !== contact)
    setFormValue('contact_folio')(updatedContactFolio)
  }
  return (
    <>
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
              type='text'
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
        <div className='grid grid-cols-1 gap-8 p-4 md:grid-cols-2'>
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
        <Card>
          <div className='flex flex-col justify-between border-b-2 border-gray-200 py-4'>
            <StrongText className='text-base font-semibold'>Contact Folio</StrongText>
            {formData.contact_folio && (
              <div className=''>
                {formData.contact_folio.map((contact, index) => (
                  <div
                    key={index}
                    className='flex flex-col gap-4 p-4 md:grid md:grid-cols-2'
                  >
                    <Input
                      label='Name'
                      setValue={() => {}}
                      value={contact.name}
                      type='text'
                      disabled={true}
                      style='disabled'
                    />
                    <Input
                      label='Email'
                      setValue={() => {}}
                      value={contact.email}
                      type='text'
                      disabled={true}
                      style='disabled'
                    />
                    <Input
                      label='Phone'
                      setValue={() => {}}
                      value={contact.phone}
                      type='text'
                      disabled={true}
                      style='disabled'
                    />
                    <Input
                      label='Employee ID'
                      setValue={() => {}}
                      value={contact.employee_id}
                      type='text'
                      disabled={true}
                      style='disabled'
                    />
                    <div className='col-span-2 flex justify-end'>
                      <Button
                        label='Remove'
                        variant='danger'
                        onClick={() => handleContactRemove(contact)}
                        type='button'
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className='flex justify-end'>
              <Button
                label='Add Contact'
                variant='primary'
                onClick={handleModal}
                type='button'
              />
            </div>
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
      {showModal && (
        <ContactFolioModal
          setShowModal={setShowModal}
          onAddContact={(newContact) => {
            setFormValue('contact_folio')([...formData.contact_folio, newContact])
          }}
        />
      )}
    </>
  )
}
