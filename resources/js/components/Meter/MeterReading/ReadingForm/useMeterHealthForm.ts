import { Meter, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { useCallback, useEffect, useState } from 'react'

export interface MeterHealth {
  meter_id: number
  meter_serial: string | null
  meter_health_id?: number | null
  ctpts?: { ctpt_id: number; health: number | null; ctpt_serial: string }[]
}

const storeIntialMetersHealthData = (
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
) => {
  return metersWithTimezonesAndProfiles.map((meter) => ({
    meter_id: meter.meter_id,
    meter_health_id: null,
    meter_serial: meter.meter.meter_serial,
    ctpts: meter.meter.transformers.map((ctpt) => ({
      ctpt_id: ctpt.meter_ctpt_id,
      health: null,
      ctpt_serial: ctpt.ctpt_serial,
    })),
  }))
}

export default function useMeterHealthForm(
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
) {
  const [healthData, setHealthData] = useState<MeterHealth[]>([])

  useEffect(() => {
    setHealthData(storeIntialMetersHealthData(metersWithTimezonesAndProfiles))
  }, [metersWithTimezonesAndProfiles])

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
