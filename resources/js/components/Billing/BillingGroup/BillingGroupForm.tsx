import useCustomForm from '@/hooks/useCustomForm'
import { BillingGroup } from '@/interfaces/data_interfaces'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'

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
  return (
    <form>
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
    </form>
  )
}
