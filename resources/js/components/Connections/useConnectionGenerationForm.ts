import { ParameterValues } from '@/interfaces/parameter_types'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

export interface GenerationFormData {
  id: number
  label: string
  value: boolean
  generation_type_id: number
  generation_sub_type_id: number | null
  generation_sub_types: ParameterValues[]
}

export interface GenerationFormProps {
  generationTypes: ParameterValues[]
}

export default function useConnectionGenerationForm({ generationTypes }: GenerationFormProps) {
  const [generationData, setGenerationData] = useState<GenerationFormData[]>([])

  useEffect(() => {
    setGenerationData(
      generationTypes.map((generationType) => ({
        id: generationType.id,
        label: generationType.parameter_value,
        value: false,
        generation_type_id: generationType.id,
        generation_sub_type_id: null,
        generation_sub_types: [],
      }))
    )
  }, [generationTypes])

  const updateGenerationData = useCallback(
    async (id: number, value: boolean, label: string) => {
      setGenerationData((prev) =>
        prev.map((generation) => ({
          ...generation,
          value: generation.id === id ? value : generation.value,
        }))
      )

      if (value === true) {
        const response = await axios.get(
          `/api/parameter-values?attribute_name=attribute1Value&attribute_value=${label}`
        )
        setGenerationData((prev) =>
          prev.map((generation) => ({
            ...generation,
            generation_sub_types:
              generation.id === id ? response.data : generation.generation_sub_types,
          }))
        )
      } else {
        setGenerationData((prev) =>
          prev.map((generation) => ({
            ...generation,
            generation_sub_types: generation.id === id ? [] : generation.generation_sub_types,
            generation_sub_type_id: generation.id === id ? null : generation.generation_sub_type_id,
          }))
        )
      }
    },
    [generationData]
  )

  const updateGenerationSubTypeData = useCallback(
    async (id: number, value: boolean, label: string, generationSubTypeId: number) => {
      setGenerationData((prev: GenerationFormData[]) =>
        prev.map((generation: GenerationFormData) => ({
          ...generation,
          generation_sub_type_id:
            generation.id === id && value === true
              ? generationSubTypeId
              : generation.generation_sub_type_id,
        }))
      )
    },
    [generationData]
  )

  return {
    generationData,
    updateGenerationData,
    updateGenerationSubTypeData,
  }
}
