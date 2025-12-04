import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import MonthPicker from '@/ui/form/MonthPicker'

export default function BillingJobStatusSearchForm() {
  const { formData, setFormValue } = useCustomForm({
    group: '',
    billing_month_from: '',
    billing_month_to: '',
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
  }
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <div className='grid grid-cols-3 gap-4'>
          <Input
            label='Group'
            value={formData.group}
            setValue={setFormValue('group')}
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
    </div>
  )
}
