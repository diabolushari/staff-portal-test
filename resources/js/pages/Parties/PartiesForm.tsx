import useCustomForm from '@/hooks/useCustomForm'
import AppLayout from '@/layouts/app-layout'
import Heading from '@/typography/Heading'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'

export default function PartiesForm({ partyTypes, partyStatus }: any) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: '',
    party_type_id: 1,
    status_id: 1,
    mobile_number: '',
    telephone_number: '',
    email_address: '',
    address: '',
    fax_number: '',
    effective_start: '',
    effective_end: '',
    is_current: true,
    created_by: 1,
    updated_by: 1,
  })
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('Submitted')
    console.log(formData)
  }
  return (
    <AppLayout>
      <div className='p-6'>
        <CardHeader title='Party Details' />

        <Card>
          <form onSubmit={onSubmit}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col'>
                <Input
                  label='Name'
                  value={formData.name}
                  setValue={setFormValue('name')}
                  type='text'
                />
              </div>
              <div className='flex flex-col'>
                <SelectList
                  label='Party Type'
                  value={formData.party_type_id}
                  setValue={setFormValue('party_type_id')}
                  type='number'
                  list={partyTypes}
                  dataKey='id'
                  displayKey='parameterValue'
                />
              </div>
              <div className='flex flex-col'>
                <SelectList
                  label='Status'
                  value={formData.status_id}
                  setValue={setFormValue('status_id')}
                  type='number'
                  list={partyStatus}
                  dataKey='id'
                  displayKey='parameterValue'
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Mobile Number'
                  value={formData.mobile_number}
                  setValue={setFormValue('mobile_number')}
                  type='number'
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Telephone Number'
                  value={formData.telephone_number}
                  setValue={setFormValue('telephone_number')}
                  type='number'
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Email Address'
                  value={formData.email_address}
                  setValue={setFormValue('email_address')}
                  type='email'
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Address'
                  value={formData.address}
                  setValue={setFormValue('address')}
                  type='text'
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Fax Number'
                  value={formData.fax_number}
                  setValue={setFormValue('fax_number')}
                  type='number'
                />
              </div>
              <div className='flex flex-col'>
                <DatePicker
                  label='Effective Start Date'
                  value={formData.effective_start}
                  setValue={setFormValue('effective_start')}
                />
              </div>
              <div className='flex flex-col'>
                <DatePicker
                  label='Effective End Date'
                  value={formData.effective_end}
                  setValue={setFormValue('effective_end')}
                />
              </div>
            </div>
            <div className='mt-5'>
              <Button
                type='submit'
                label='Submit'
              />
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
