import { ParameterValues } from '@/interfaces/parameter_types'
import { useCallback, useEffect, useState } from 'react'

export interface FlagData {
  id: number
  label: string
  value: boolean
}

export interface GroupedFlags {
  id: number
  group_name: string
  flags: FlagData[]
}

const groupFlags = (flags: ParameterValues[]) => {
  const groupedFlags: GroupedFlags[] = []
  const groups = new Set(flags.map((flag) => flag.attribute2_value))
  groups.forEach((group, index) => {
    groupedFlags.push({
      id: Number(index),
      group_name: group,
      flags: flags
        .filter((flag) => flag.attribute2_value === group)
        .map((flag) => ({
          id: flag.id,
          label: flag.parameter_value,
          value: false,
        })),
    })
  })
  return groupedFlags
}

export default function useConnectionFlagForm(flags: ParameterValues[]) {
  const [flagData, setFlagData] = useState<GroupedFlags[]>([])
  useEffect(() => {
    setFlagData(groupFlags(flags))
  }, [flags])

  const updateFlagData = useCallback(async (id: number, value: boolean, label: string) => {
    setFlagData((prev) =>
      prev.map((group) => ({
        ...group,
        flags: group.flags.map((flag) => (flag.id === id ? { ...flag, value } : flag)),
      }))
    )
  }, [])

  return {
    flagData,
    updateFlagData,
  }
}
