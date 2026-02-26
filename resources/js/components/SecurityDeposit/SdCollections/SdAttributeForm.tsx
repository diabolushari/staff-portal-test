import InputItemForm from '@/components/Template/InputItemForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import { SdAttribute } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react'

interface Props {
  selectedCollectionMode: ParameterValues | null
  attributeData: SdAttribute[] | null
  setAttributeData: Dispatch<SetStateAction<SdAttribute[] | null>>
}

const SdAttributeForm = ({ selectedCollectionMode, attributeData, setAttributeData }: Props) => {
  const attributeUrl = useMemo(() => {
    if (!selectedCollectionMode) return null

    return `/api/parameter-values?domain_name=Connection&parameter_name=SD Collection Attribute&attribute_name=attribute2Value&attribute_value=${selectedCollectionMode.parameter_value}`
  }, [selectedCollectionMode])

  //TODO wrong naming convention
  const [sdAttributeFormItems] = useFetchRecord<ParameterValues[]>(
    attributeUrl ? attributeUrl : ' '
  )
  useEffect(() => {
    if (!Array.isArray(sdAttributeFormItems)) return

    if (sdAttributeFormItems.length == 0) {
      setAttributeData(null)
      return
    }

    if (sdAttributeFormItems.length > 0) {
      const data: SdAttribute[] = sdAttributeFormItems.map((attribute) => ({
        attribute_id: null,
        sd_collection_id: null,
        attribute_definition_id: attribute.id,
        attribute_value: '',
        file: null,
        mime_type: null,
        attribute_definition: attribute,
      }))

      setAttributeData(data)
    }
  }, [sdAttributeFormItems, setAttributeData])

  //TODO  type errors
  const updateTextValue = useCallback(
    (id: number, text: string) => {
      setAttributeData((prev) => {
        if (!prev) return null

        return prev.map((item) =>
          item.attribute_definition_id === id ? { ...item, attribute_value: text } : item
        )
      })
    },
    [setAttributeData]
  )

  const updateFileValue = useCallback(
    (id: number, file: File | null) => {
      setAttributeData((prev) => {
        if (!prev) return null

        return prev.map((item) =>
          item.attribute_definition_id === id ? { ...item, file: file } : item
        )
      })
    },
    [setAttributeData]
  )

  //TODO use attributeData != null for empty check
  return (
    <div className='grid grid-cols-2 gap-4 py-4'>
      {attributeData != null &&
        attributeData?.map((attribute) => (
          <div key={attribute.attribute_definition_id}>
            <InputItemForm
              updateTextValue={updateTextValue}
              updateFileValue={updateFileValue}
              attribute={attribute}
            />
          </div>
        ))}
    </div>
  )
}

export default SdAttributeForm
