import { Meter } from './data_interfaces'

export interface MeterWithMf {
  meter: Meter
  meter_mf: number
}

export interface BillMeterReadings {
  timezone: string | null
  timezone_code: string | null
  initial_reading: number
  final_reading: number
  difference: number
  value: number
  parameter_id: string | null
  parameter_name: string | null
  parameter_display: string | null
}

export interface ChargeHeadItem {
  id: string
  name: string
  result: string
  zone_id: number | null
}

export interface ComputedZoneResult {
  result: string
  zoneId: number | null
}

export interface ComputedProperty {
  id: string
  name: string
  result: string | ComputedZoneResult[]
  zoneId?: number | null
}
export interface ComputedProperties {
  recorded_max_demand: ComputedProperty
  total_consumption: ComputedProperty
  kva_rate: ComputedProperty
  kwh_rate: ComputedProperty
  _75_of_contract_demand: ComputedProperty
  excess_demand: ComputedProperty
  energy_charge: ComputedProperty
  electricity_duty: ComputedProperty
  lag: ComputedProperty
  lead: ComputedProperty
  demand_charge: ComputedProperty
  excess_demand_charge: ComputedProperty
  power_factor: ComputedProperty
  zone_with_max_demand_value: ComputedProperty
}

export interface ChargeHeads {
  energy_charge: ChargeHeadItem
  electricity_duty: ChargeHeadItem
  electricity_surcharge: ChargeHeadItem
  monthly_fuel_surcharge: ChargeHeadItem
  power_factor_incentive_and_disincentive: ChargeHeadItem
  total_demand_charge: ChargeHeadItem
}
