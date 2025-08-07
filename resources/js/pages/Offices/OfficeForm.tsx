import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Office } from '@/interfaces/consumers'
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
import { useEffect } from 'react'

export default function OfficeForm({
  parameterValues,
  office,
}: {
  parameterValues: any[]
  office?: Office
}) {
  const { formData: contactFolioForm, setFormValue: setContactFolioValue } = useCustomForm({
    phone: office?.contactFolio?.phone ?? '',
    email: office?.contactFolio?.email ?? '',
    name: office?.contactFolio?.name ?? '',
    address: office?.contactFolio?.address ?? '',
  })
  const { formData, setFormValue } = useCustomForm({
    officeCode: office?.officeCode ?? 0,
    officeDescription: office?.officeDescription ?? '',
    officeTypeId: office?.officeTypeId ?? '',
    parentOfficeId: office?.parentOfficeId ?? '',
    effectiveStartDate: office?.effectiveStartDate
      ? new Date(office.effectiveStartDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    effectiveEndDate: office?.effectiveEndDate
      ? new Date(office.effectiveEndDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    contactFolio: office?.contactFolio ?? {},
  })

  useEffect(() => {
    contactFolioForm.phone && setFormValue('contactFolio', contactFolioForm)
    contactFolioForm.email && setFormValue('contactFolio', contactFolioForm)
    contactFolioForm.name && setFormValue('contactFolio', contactFolioForm)
    contactFolioForm.address && setFormValue('contactFolio', contactFolioForm)
  }, [])

  console.log(formData, office)

  const { post, errors, loading } = useInertiaPost(
    office ? route('offices.update', office.officeId) : route('offices.store'),
    {
      showErrorToast: true,
      onComplete: () => {
        router.visit(route('offices.index'))
      },
    }
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const completeFormData = { ...formData, contactFolio: contactFolioForm }
    e.preventDefault()
    post(office ? { ...completeFormData, _method: 'PUT' } : completeFormData)
  }
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
                label='Office Code'
                setValue={setFormValue('officeCode')}
                value={formData.officeCode}
                placeholder='Type your Office Code'
                error={errors?.officeCode}
                type='number'
              />
            </div>
            <div className='flex flex-col'>
              <TextArea
                label='Office Description'
                setValue={setFormValue('officeDescription')}
                value={formData.officeDescription}
                placeholder='Type your Office Description'
                error={errors?.officeDescription}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Office Type'
                setValue={setFormValue('officeTypeId')}
                value={formData.officeTypeId}
                placeholder='Select Office Type'
                error={errors?.officeTypeId}
                dataKey='id'
                displayKey='parameterValue'
                list={parameterValues}
              />
            </div>
            <div className='flex flex-col'>
              <ComboBox
                label='Parrent Office'
                url={'/api/system-modules'}
                setValue={setFormValue('parentOfficeId')}
                value={formData.parentOfficeId}
                placeholder='Select Parrent Office'
                error={errors?.parentOfficeId}
                dataKey='id'
                displayKey='name'
              />
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
                setValue={setFormValue('effectiveStartDate')}
                value={formData.effectiveStartDate}
                placeholder='Select Effective Start Date'
                error={errors?.effectiveStartDate}
              />
            </div>
            <div className='flex flex-col'>
              <DatePicker
                label='Effective End Date'
                setValue={setFormValue('effectiveEndDate')}
                value={formData.effectiveEndDate}
                placeholder='Select Effective End Date'
                error={errors?.effectiveEndDate}
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
