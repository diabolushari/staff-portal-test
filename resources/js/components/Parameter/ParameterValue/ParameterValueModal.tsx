import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition, ParameterDomain } from '@/interfaces/parameter_types'
import FormCard from '@/ui/Card/FormCard'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'

interface PageProps {
  onClose: () => void
  domain: ParameterDomain
  definition: ParameterDefinition
}

export default function ParameterValueModal({ onClose, domain, definition }: PageProps) {
  const { formData, setFormValue } = useCustomForm({
    definition_id: definition.id,
    parameter_code: '',
    parameter_value: '',
    attribute1_value: '',
    attribute2_value: '',
    attribute3_value: '',
    attribute4_value: '',
    attribute5_value: '',
    effective_start_date: '',
    effective_end_date: '',
    sort_priority: '',
    notes: '',
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    route('parameter-value.store'),
    {
      onComplete: () => {
        onClose()
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <Modal
      title='Parameter Value'
      setShowModal={onClose}
      large={true}
    >
      <FormCard title='Basic Information'>
        <Input
          label='Parameter Code'
          value={formData.parameter_code}
          setValue={setFormValue('parameter_code')}
          error={errors?.parameter_code}
        />
        <Input
          label='Parameter Value'
          value={formData.parameter_value}
          setValue={setFormValue('parameter_value')}
          error={errors?.parameter_value}
        />
        {definition.attribute1_name && (
          <Input
            label={definition.attribute1_name}
            value={formData.attribute1_value}
            setValue={setFormValue('attribute1_value')}
            error={errors?.attribute1_value}
          />
        )}
        {definition.attribute2_name && (
          <Input
            label={definition.attribute2_name}
            value={formData.attribute2_value}
            setValue={setFormValue('attribute2_value')}
            error={errors?.attribute2_value}
          />
        )}
        {definition.attribute3_name && (
          <Input
            label={definition.attribute3_name}
            value={formData.attribute3_value}
            setValue={setFormValue('attribute3_value')}
            error={errors?.attribute3_value}
          />
        )}
        {definition.attribute4_name && (
          <Input
            label={definition.attribute4_name}
            value={formData.attribute4_value}
            setValue={setFormValue('attribute4_value')}
            error={errors?.attribute4_value}
          />
        )}
        {definition.attribute5_name && (
          <Input
            label={definition.attribute5_name}
            value={formData.attribute5_value}
            setValue={setFormValue('attribute5_value')}
            error={errors?.attribute5_value}
          />
        )}
      </FormCard>
    </Modal>
  )
}
