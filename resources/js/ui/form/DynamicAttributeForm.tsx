import useFetchRecord from '@/hooks/useFetchRecord'
import { ParameterValues } from '@/interfaces/parameter_types'
import { Dispatch, SetStateAction, useEffect, useMemo, useCallback } from 'react'
import InputItemForm from './InputItemForm'

export interface BaseAttribute {
  attribute_id: number | null
  attribute_definition_id: number
  attribute_value: string
  file: File | null
  mime_type: string | null
  attribute_definition: ParameterValues
  [key: string]: any // allows foreign key field (station_id / sd_collection_id)
}

interface Props<T extends BaseAttribute> {
  selectedValue: ParameterValues | null
  domainName: string
  parameterName: string
  foreignKeyName: string // "station_id" | "sd_collection_id"
  foreignKeyValue: number | null
  attributeData: T[] | null
  setAttributeData: Dispatch<SetStateAction<T[] | null>>
}

const DynamicAttributeForm = <T extends BaseAttribute>({
  selectedValue,
  domainName,
  parameterName,
  foreignKeyName,
  foreignKeyValue,
  attributeData,
  setAttributeData,
}: Props<T>) => {
  const attributeUrl = useMemo(() => {
    if (!selectedValue) return null

    return `/api/parameter-values?domain_name=${domainName}&parameter_name=${parameterName}&attribute_name=attribute2Value&attribute_value=${selectedValue.parameter_value}`
  }, [selectedValue, domainName, parameterName])

  const [attributes] = useFetchRecord<ParameterValues[]>(attributeUrl ?? '')

  useEffect(() => {
    if (!Array.isArray(attributes)) return

    if (attributes.length === 0) {
      setAttributeData(null)
      return
    }

    const data = attributes.map((attr) => ({
      attribute_id: null,
      [foreignKeyName]: foreignKeyValue,
      attribute_definition_id: attr.id,
      attribute_value: '',
      file: null,
      mime_type: null,
      attribute_definition: attr,
    })) as T[]

    setAttributeData(data)
  }, [attributes, foreignKeyName, foreignKeyValue, setAttributeData])

  const updateTextValue = useCallback(
    (id: number, value: string) => {
      setAttributeData(
        (prev) =>
          prev?.map((attr) =>
            attr.attribute_definition_id === id ? { ...attr, attribute_value: value } : attr
          ) ?? null
      )
    },
    [setAttributeData]
  )

  const updateFileValue = useCallback(
    (id: number, file: File | null) => {
      setAttributeData(
        (prev) =>
          prev?.map((attr) => (attr.attribute_definition_id === id ? { ...attr, file } : attr)) ??
          null
      )
    },
    [setAttributeData]
  )

  return (
    <div className='grid grid-cols-2 gap-4 p-4'>
      {attributeData?.map((attribute) => (
        <InputItemForm
          key={attribute.attribute_definition_id}
          attribute={attribute}
          updateTextValue={updateTextValue}
          updateFileValue={updateFileValue}
        />
      ))}
    </div>
  )
}

export default DynamicAttributeForm
