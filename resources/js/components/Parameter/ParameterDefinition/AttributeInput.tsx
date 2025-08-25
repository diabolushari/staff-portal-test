import { ParameterDefinition } from '@/interfaces/parameter_types'
import Input from '@/ui/form/Input'

export default function AttributeInput({
  index,
  visibleAttrs,
  formData,
  setFormValue,
  errors,
  removeAttribute,
}: {
  index: number
  visibleAttrs: boolean[]
  formData: ParameterDefinition
  setFormValue: (key: keyof ParameterDefinition) => (value: string) => void
  errors: Record<string, string> | undefined
  removeAttribute: (index: number) => void
}) {
  const attrKey = `attribute${index + 1}_name`
  if (!visibleAttrs[index]) return null

  return (
    <div
      key={attrKey}
      className='relative flex flex-col'
    >
      <Input
        label={`Attribute ${index + 1} Name`}
        value={formData[attrKey as keyof ParameterDefinition]}
        setValue={setFormValue(attrKey as keyof ParameterDefinition)}
        error={errors?.[attrKey]}
      />
      <button
        type='button'
        onClick={() => removeAttribute(index)}
        className='absolute top-2 right-2 font-bold text-red-500'
      >
        ×
      </button>
    </div>
  )
}
