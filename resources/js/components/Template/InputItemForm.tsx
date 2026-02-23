import Datepicker from '@/ui/form/DatePicker'
import CheckBox from '@/ui/form/CheckBox'
import FileInput from '@/ui/form/FileInput'
import { SdAttribute } from '@/interfaces/data_interfaces'
import Input from '@/ui/form/Input'

interface Props {
  updateTextValue: (attribute_id: number, value: string) => void
  updateFileValue: (attribute_id: number, value: File | null) => void
  attribute: SdAttribute
  errors?: string
}

export default function InputItemForm({
  updateTextValue,
  updateFileValue,
  attribute,
  errors,
}: Readonly<Props>) {
  return (
    <div
      className='flex flex-col'
      key={attribute.attribute_id}
    >
      {attribute.attribute_definition.attribute1_value.toLowerCase() === 'date' && (
        <Datepicker
          setValue={(value) => updateTextValue(attribute.attribute_definition_id, value)}
          label={attribute.attribute_definition.parameter_value}
          placeholder={attribute.attribute_definition.parameter_value ?? ''}
          value={attribute.attribute_value}
          error={errors}
        />
      )}
      {attribute.attribute_definition.attribute1_value.toLowerCase() === 'boolean' && (
        <CheckBox
          label={attribute.attribute_definition.parameter_value}
          value={String(attribute.attribute_value).toLowerCase() === 'true'}
          toggleValue={() =>
            updateTextValue(
              attribute.attribute_definition_id,
              String(attribute.attribute_value).toLowerCase() === 'true' ? 'false' : 'true'
            )
          }
        />
      )}

      {(attribute.attribute_definition.attribute1_value.toLowerCase() === 'text' ||
        attribute.attribute_definition.attribute1_value.toLowerCase() === 'number') && (
        <Input
          setValue={(value) => updateTextValue(attribute.attribute_definition_id, value)}
          value={attribute.attribute_value}
          label={attribute.attribute_definition.parameter_value}
          placeholder={attribute.attribute_definition.parameter_value ?? ''}
          error={errors}
        />
      )}

      {attribute.attribute_definition.attribute1_value.toLocaleLowerCase() === 'file' && (
        <div className='space-y-2'>
          <FileInput
            setValue={(file) => updateFileValue(attribute.attribute_definition_id, file)}
            label={attribute.attribute_definition.parameter_value}
            error={errors}
            file={attribute.file}
          />
        </div>
      )}
    </div>
  )
}
