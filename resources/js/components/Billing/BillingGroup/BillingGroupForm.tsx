import useCustomForm from '@/hooks/useCustomForm'
import { BillingGroup } from '@/interfaces/data_interfaces'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'
import FormCard from '@/ui/Card/FormCard'

export interface BillingGroupForm {
  name: string
  description: string
  _method?: 'PUT' | 'POST'
}

export default function BillingGroupForm({
  billing_group,
}: {
  billing_group: BillingGroup | null
}) {
  const { formData, setFormValue } = useCustomForm<BillingGroupForm>({
    name: billing_group?.name ?? '',
    description: billing_group?.description ?? '',
    _method: billing_group ? 'PUT' : 'POST',
  })
  const { post, errors } = useInertiaPost<typeof formData>(route('billing-groups.store'))
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <form
      className='flex flex-col gap-6'
      onSubmit={handleSubmit}
    >
      <FormCard title='Billing Group'>
        <Input
          label='Name'
          value={formData.name}
          setValue={setFormValue('name')}
        />
        <TextArea
          label='Description'
          value={formData.description}
          setValue={setFormValue('description')}
        />
      </FormCard>

      <div className='flex justify-end'>
        <Button
          label='Submit'
          type='submit'
        />
      </div>
    </form>
  )
}
