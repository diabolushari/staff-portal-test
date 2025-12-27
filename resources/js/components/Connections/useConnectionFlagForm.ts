import { ParameterValues } from "@/interfaces/parameter_types"
import { useCallback, useEffect, useState } from "react"


export interface FlagData {
    id: number
    label: string
    value: boolean
    sub_id: number | null
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
                sub_id: null
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

    const updateFlagData = useCallback((id: number, value: boolean) => {
        setFlagData((prev) => prev.map((flag) => flag.flags.find((f) => f.id === id) ? { ...flag, flags: flag.flags.map((f) => f.id === id ? { ...f, value } : f) } : flag))
    }, [])

    return {
        flagData,
        updateFlagData
    }
}


 