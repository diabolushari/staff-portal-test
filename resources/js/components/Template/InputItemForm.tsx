import Datepicker from '@/ui/form/DatePicker'
import CheckBox from '@/ui/form/CheckBox'
import FileInput from '@/ui/form/FileInput'
import { SdAttribute, GeneratingStationAttribute } from '@/interfaces/data_interfaces'
import Input from '@/ui/form/Input'
import { Select } from 'react-day-picker'
import SelectList from '@/ui/form/SelectList'
import useFetchRecord from '@/hooks/useFetchPagination'
import { ParameterValues } from '@/interfaces/parameter_types'
import DynamicSelectList from '@/ui/form/DynamicSelectList'

interface Props {
  updateTextValue: (attribute_id: number, value: string) => void
  updateFileValue?: (attribute_id: number, value: File | null) => void
  attribute: SdAttribute | GeneratingStationAttribute
  errors?: string
}

export default function InputItemForm({
  updateTextValue,
  updateFileValue,
  attribute,
  errors,
}: Readonly<Props>) {
  const [list] = useFetchRecord<ParameterValues[]>(
    `/api/parameter-values?domain_name=${attribute.attribute_definition?.attribute3_value}&parameter_name=${attribute.attribute_definition?.attribute4_value}`
  )
  return (
    <div
      className='flex flex-col'
      key={attribute.attribute_id}
    >
      {attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'date' && (
        <Datepicker
          setValue={(value) => updateTextValue(attribute.attribute_definition_id, value)}
          label={attribute.attribute_definition.parameter_value}
          placeholder={attribute.attribute_definition.parameter_value ?? ''}
          value={attribute.attribute_value}
          error={errors}
        />
      )}
      {attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'boolean' && (
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

      {(attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'text' ||
        attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'number') && (
        <Input
          setValue={(value) => updateTextValue(attribute.attribute_definition_id, value)}
          value={attribute.attribute_value}
          label={attribute.attribute_definition.parameter_value}
          placeholder={attribute.attribute_definition.parameter_value ?? ''}
          error={errors}
        />
      )}

      {attribute?.attribute_definition?.attribute1_value.toLocaleLowerCase() === 'file' &&
        updateFileValue && (
          <div className='space-y-2'>
            <FileInput
              setValue={(file) => updateFileValue(attribute.attribute_definition_id, file)}
              label={attribute.attribute_definition.parameter_value}
              error={errors}
              file={attribute.file}
            />
          </div>
        )}
      {attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'drop down' && list && (
        <DynamicSelectList
          setValue={(value) => updateTextValue(attribute.attribute_definition_id, value)}
          label={attribute.attribute_definition.parameter_value}
          placeholder={attribute.attribute_definition.parameter_value ?? ''}
          value={attribute.attribute_value}
          error={errors}
          url={`/api/parameter-values?domain_name=${attribute.attribute_definition?.attribute3_value}&parameter_name=${attribute.attribute_definition?.attribute4_value}`}
          dataKey='parameter_value'
          displayKey='parameter_value'
        />
      )}
    </div>
  )
}
