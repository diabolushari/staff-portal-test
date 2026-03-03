import InputItemForm from '@/ui/form/InputItemForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import { GeneratingStationAttribute } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

interface Props {
  selectedGenerationType: ParameterValues | null
  attributeData: GeneratingStationAttribute[] | null
  setAttributeData: Dispatch<SetStateAction<GeneratingStationAttribute[] | null>>
}

const GeneratingStationAttributeForm = ({
  selectedGenerationType,
  attributeData,
  setAttributeData,
}: Props) => {
  const attributeUrl = useMemo(() => {
    if (!selectedGenerationType) return null

    return `/api/parameter-values?domain_name=Station&parameter_name=Generating Station Attribute&attribute_name=attribute2Value&attribute_value=${selectedGenerationType.parameter_value}`
  }, [selectedGenerationType])

  const [attributes] = useFetchRecord<ParameterValues[]>(attributeUrl ?? '')

  useEffect(() => {
    if (!Array.isArray(attributes)) return

    if (attributes.length === 0) {
      setAttributeData(null)
      return
    }

    const data: GeneratingStationAttribute[] = attributes.map((attr) => ({
      attribute_id: null,
      station_id: null,
      attribute_definition_id: attr.id,
      attribute_value: '',
      file: null,
      mime_type: null,
      attribute_definition: attr,
    }))

    setAttributeData(data)
  }, [attributes, setAttributeData])

  const updateTextValue = (id: number, value: string) => {
    setAttributeData(
      (prev) =>
        prev?.map((attr) =>
          attr.attribute_definition_id === id ? { ...attr, attribute_value: value } : attr
        ) ?? null
    )
  }

  const updateFileValue = (id: number, file: File | null) => {
    setAttributeData(
      (prev: GeneratingStationAttribute[] | null) =>
        prev?.map((attr) =>
          attr.attribute_definition_id === id ? { ...attr, file: file } : attr
        ) ?? null
    )
  }

  return (
    <div className='grid grid-cols-2 gap-4'>
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

export default GeneratingStationAttributeForm
