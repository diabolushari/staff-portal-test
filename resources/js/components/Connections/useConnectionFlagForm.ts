import { ParameterValues } from "@/interfaces/parameter_types"
import { router } from "@inertiajs/react"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"


export interface FlagData {
    id: number
    label: string
    value: boolean
    sub_id: number | null
    sub_categories: ParameterValues[]
}

export interface GroupedFlags {
    id: number
    group_name: string
    flags: FlagData[]
}

const storeInitialFlagData = ( flags: ParameterValues[]) => {
    return flags.map((flag) => ({
        id: flag.id,
        label: flag.parameter_value,
        value: false
    }))
}

const groupFlags = (flags: ParameterValues[]) => {
    const groupedFlags: GroupedFlags[] = []
    const groups = new Set(flags.map((flag) => flag.attribute2_value))
    groups.forEach((group, index) => {
        groupedFlags.push({
            id: Number(index),
            group_name: group,
            flags: flags.filter((flag) => flag.attribute2_value === group).map((flag) => ({
                id: flag.id,
                label: flag.parameter_value,
                value: false,
                sub_id: null,
                sub_categories: []
            }))
        })
    })
    return groupedFlags
}

export default function useConnectionFlagForm(flags: ParameterValues[]) {

    const [flagData, setFlagData] = useState<GroupedFlags[]>([])

    useEffect(() => {
        setFlagData(groupFlags(flags))
    }, [flags])

  const updateFlagData = useCallback(
  async (id: number, value: boolean, label: string) => {
   
    setFlagData((prev) =>
      prev.map((group) => ({
        ...group,
        flags: group.flags.map((flag) =>
          flag.id === id ? { ...flag, value } : flag
        ),
      }))
    )

    if (value === true) {
      const response = await axios.get<ParameterValues[]>(
        '/api/parameter-values',
        {
          params: {
            attribute_name: 'attribute1Value',
            attribute_value: label,
          },
        }
      )

      const subCategories = response.data

      setFlagData((prev) =>
        prev.map((group) => ({
          ...group,
          flags: group.flags.map((flag) =>
            flag.id === id
              ? {
                  ...flag,
                  sub_categories: subCategories,
                  sub_id: null,
                }
              : flag
          ),
        }))
      )
    }

    if (value === false) {
      setFlagData((prev) =>
        prev.map((group) => ({
          ...group,
          flags: group.flags.map((flag) =>
            flag.id === id
              ? {
                  ...flag,
                  sub_categories: [],
                  sub_id: null,
                }
              : flag
          ),
        }))
      )
    }
  },
  []
)
const updateSubId = useCallback(
    async (id: number, subId: number) => {
      setFlagData((prev) =>
        prev.map((group) => ({
          ...group,
          flags: group.flags.map((flag) =>
            flag.id === id ? { ...flag, sub_id: subId } : flag
          ),
        }))
      )
    },
    []
  )


    return {
        flagData,
        updateFlagData,
        updateSubId
    }
}


 