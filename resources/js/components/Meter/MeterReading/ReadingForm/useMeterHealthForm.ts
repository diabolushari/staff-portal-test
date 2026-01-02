import { Meter, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { useCallback, useEffect, useState } from 'react'

export interface MeterHealth {
  meter_id: number
  meter_serial: string | null
  meter_health_id?: number | null
  ctpts?: { ctpt_id: number; health: number | null; ctpt_serial: string }[]
}

const storeInitialMetersHealthData = (
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  meterHealths: ParameterValues[],
  ctptHealths: ParameterValues[]
): MeterHealth[] => {
  const defaultMeterHealth = meterHealths.find((h) => h.parameter_value === 'Working')
  const defaultCTPTHealth = ctptHealths.find((h) => h.parameter_value === 'Working')

  return metersWithTimezonesAndProfiles.map((meter) => ({
    meter_id: meter.meter_id,
    meter_health_id: defaultMeterHealth?.id ?? null,
    meter_serial: meter.meter.meter_serial,
    ctpts: meter.meter.transformers.map((ctpt) => ({
      ctpt_id: ctpt.meter_ctpt_id,
      health: defaultCTPTHealth?.id ?? null,
      ctpt_serial: ctpt.ctpt_serial,
    })),
  }))
}

export default function useMeterHealthForm(
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  meterHealths: ParameterValues[],
  ctptHealths: ParameterValues[]
) {
  const [healthData, setHealthData] = useState<MeterHealth[]>([])

  useEffect(() => {
    setHealthData(
      storeInitialMetersHealthData(metersWithTimezonesAndProfiles, meterHealths, ctptHealths)
    )
  }, [metersWithTimezonesAndProfiles, meterHealths, ctptHealths])

  const updateMeterHealth = useCallback((statusId: number, meter: Meter) => {
    setHealthData((oldValue) =>
      oldValue.map((item) =>
        item.meter_id === meter.meter_id ? { ...item, meter_health_id: statusId } : item
      )
    )
  }, [])

  const updateCTPTHealth = useCallback((meterId: number, ctptId: number, statusId: number) => {
    setHealthData((oldValue) =>
      oldValue.map((item) =>
        item.meter_id === meterId
          ? {
              ...item,
              ctpts: item.ctpts?.map((c) =>
                c.ctpt_id === ctptId ? { ...c, health: statusId } : c
              ),
            }
          : item
      )
    )
  }, [])

  return { healthData, updateMeterHealth, updateCTPTHealth }
}
