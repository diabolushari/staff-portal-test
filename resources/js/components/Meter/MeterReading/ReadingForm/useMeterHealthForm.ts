import { Meter, MeterReading, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { useCallback, useEffect, useState } from 'react'

export interface MeterHealth {
  meter_id: number
  meter_serial: string | null
  meter_health_id?: number | null
  ctpts?: { ctpt_id: number; health: number | null; ctpt_serial: string }[]
  voltage_r: number
  voltage_y: number
  voltage_b: number
  current_r: number
  current_y: number
  current_b: number
}

const storeInitialMetersHealthData = (
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  meterHealths: ParameterValues[],
  ctHealths: ParameterValues[],
  latestMeterReading: MeterReading | null
): MeterHealth[] => {
  const defaultMeterHealth = meterHealths.find((h) => h.parameter_value === 'Working')
  const defaultCTHealth = ctHealths.find((h) => h.parameter_value === 'Working')
  return metersWithTimezonesAndProfiles.map((meter) => {
    return {
      meter_id: meter.meter_id,
      meter_health_id: defaultMeterHealth?.id ?? null,
      meter_serial: meter.meter.meter_serial,
      ctpts: meter.meter.transformers.map((ctpt) => {
        return {
          ctpt_id: ctpt.meter_ctpt_id,
          health: defaultCTHealth?.id ?? '',
          ctpt_serial: ctpt.ctpt_serial,
        }
      }),
      voltage_r:
        latestMeterReading?.healths
          ?.filter((h) => h.meter_id == meter.meter_id)[0]
          ?.voltage_r.toFixed(2) ?? 0,
      voltage_y:
        latestMeterReading?.healths
          ?.filter((h) => h.meter_id == meter.meter_id)[0]
          ?.voltage_y.toFixed(2) ?? 0,
      voltage_b:
        latestMeterReading?.healths
          ?.filter((h) => h.meter_id == meter.meter_id)[0]
          ?.voltage_b.toFixed(2) ?? 0,
      current_r:
        latestMeterReading?.healths
          ?.filter((h) => h.meter_id == meter.meter_id)[0]
          ?.current_r.toFixed(2) ?? 0,
      current_y:
        latestMeterReading?.healths
          ?.filter((h) => h.meter_id == meter.meter_id)[0]
          ?.current_y.toFixed(2) ?? 0,
      current_b:
        latestMeterReading?.healths
          ?.filter((h) => h.meter_id == meter.meter_id)[0]
          ?.current_b.toFixed(2) ?? 0,
    }
  })
}

export default function useMeterHealthForm(
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  meterHealths: ParameterValues[],
  ctHealths: ParameterValues[],
  latestMeterReading: MeterReading | null
) {
  const [healthData, setHealthData] = useState<MeterHealth[]>([])

  useEffect(() => {
    setHealthData(
      storeInitialMetersHealthData(
        metersWithTimezonesAndProfiles,
        meterHealths,
        ctHealths,
        latestMeterReading
      )
    )
  }, [metersWithTimezonesAndProfiles, meterHealths, ctHealths])

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

  const updateRybValues = useCallback(
    (
      meterId: number,
      value: number | string,
      type: 'voltage_r' | 'voltage_y' | 'voltage_b' | 'current_r' | 'current_y' | 'current_b'
    ) => {
      setHealthData((oldValue) =>
        oldValue.map((item) => (item.meter_id === meterId ? { ...item, [type]: value } : item))
      )
    },
    []
  )

  return { healthData, updateMeterHealth, updateCTPTHealth, updateRybValues }
}
