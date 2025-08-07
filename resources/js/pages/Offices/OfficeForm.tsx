import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import AppLayout from '@/layouts/app-layout'
import Button from '@/ui/button/Button'
import CardHeader from '@/ui/Card/CardHeader'
import ComboBox from '@/ui/form/ComboBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { router } from '@inertiajs/react'

export default function OfficeForm({ parameterValues }: { parameterValues: any[] }) {
  const { formData, setFormValue } = useCustomForm({
    officeName: '',
    officeCode: 0,
    officeDescription: '',
    officeType: '',
    parentOffice: '',
    effectiveStartDate: new Date(),
    effectiveEndDate: new Date(),
  })
  const { post, errors, loading } = useInertiaPost(route('offices.store'), {
    showErrorToast: true,
    onComplete: (value) => {
      console.log(value)
      router.visit(route('offices.index'))
    },
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <AppLayout>
      <div className='p-4 text-gray-800 dark:text-gray-100'>
        <CardHeader
          title='Offices'
          subheading='Add a new office.'
        />
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex flex-col'>
              <Input
                label='Office Code'
                setValue={setFormValue('officeCode')}
                value={formData.officeCode}
                placeholder='Type your Office Code'
                error={errors?.office_code}
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
                setValue={setFormValue('officeType')}
                value={formData.officeType}
                placeholder='Select Office Type'
                error={errors?.officeType}
                dataKey='id'
                displayKey='parameterValue'
                list={parameterValues}
              />
            </div>
            <div className='flex flex-col'>
              <ComboBox
                label='Parrent Office'
                url={'/api/system-modules'}
                setValue={setFormValue('parentOffice')}
                value={formData.parentOffice}
                placeholder='Select Parrent Office'
                error={errors?.parentOffice}
                dataKey='id'
                displayKey='name'
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
