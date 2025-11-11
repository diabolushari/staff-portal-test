import { ParameterValues } from './parameter_types'

export interface Office {
  office_id: number
  office_name: string
  office_code: string
  office_description: string
  office_type_id: number
  parent_office_id: number
  effective_start: string
  effective_end: string
  contact_folio: OfficeContactFolio
  office_type: {
    office_type_id: number
    parameter_code: string
    parameter_value: string
  }
  parent_offices?: Office[]
  location: {
    name: string
    address: string
  }
  office_address: {
    name: string
    address: string
  }
  parent_office?: Office | null
  is_current: boolean
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

export interface OfficeWithHierarchy extends Office {
  office_hierarchy: OfficeHierarchyRel[]
  office: Office
}

export interface OfficeContactFolio {
  contacts: OfficeContact[]
}

export interface OfficeContact {
  name: string | null
  phone: string | null
  email: string | null
  designation: string | null
  employee_id: string | null
}

export interface MeterConnectionMapping {
  version_id: number
  rel_id: number
  meter_id: number
  connection_id: number
  meter_use_category?: Partial<ParameterValues> | null
  bidirectional_ind: boolean
  meter_billing_mode: string
  meter_status?: Partial<ParameterValues> | null
  faulty_date?: string
  rectification_date?: string
  sort_priority: number
  is_meter_reading_mandatory: boolean
  change_reason?: Partial<ParameterValues> | null
  effective_start_ts: string
  effective_end_ts?: string
  created_ts: string
  updated_ts?: string
  created_by: number
  updated_by: number
  meter: Meter
}

export interface Connection {
  version_id: number
  connection_id: number
  admin_office_code: number
  service_office_code: number
  billing_process_id: number
  billing_process: ParameterValues
  consumer_legacy_code: string
  connected_date: string
  connected_load_info: string | null
  connected_load_kw_val: number
  power_load_kw_val: number
  light_load_kw_val: number
  connection_attribs: string | null
  connection_category_id: number | string
  connection_category: ParameterValues
  connection_status_id: number | string
  connection_status: ParameterValues
  connection_type_id: number | string
  connection_type: ParameterValues
  connection_subcategory_id: number | string
  connection_subcategory: ParameterValues
  consumer_number: number
  consumer_type: ParameterValues[]
  contract_demand_kva_val: number
  created_at: string
  created_by: number
  effective_start: string
  effective_end: string | null
  is_current: boolean
  live_indicator: boolean
  metering_type_id: number | string
  metering_type: ParameterValues
  multi_source_indicator: boolean
  multi_source_info: string | null
  open_access_type_id: number | string
  open_access_type: ParameterValues
  phase_type_id: number | string
  phase_type: ParameterValues
  primary_purpose_id: number | string
  primary_purpose: ParameterValues
  purposes_info: string | null
  renewable_type_id: number | string
  renewable_type: ParameterValues
  solar_indicator: boolean
  tariff_id: number | string
  tariff: ParameterValues
  voltage_id: number | string
  voltage: ParameterValues
  updated_at: string
  updated_by: number
  othercons_flag: boolean
  cpp_flag: boolean
  admin_office: Office | null
  service_office: Office | null
  meters: [
    {
      priority: number
      meter: Meter
      relationship: any
    },
  ]
}

export interface OfficeHierarchy {
  hierarchy_id: number
  hierarchy_code: string
  hierarchy_name: string
}

export interface Consumer {
  connection_id: number | string
  consumer_type_id: number | string
  organization_name: string
  applicant_code: string
  consumer_pan: string
  consumer_tan?: string | null
  consumer_gstin?: string | null
  consumer_type: ParameterValues
  consumer_cin: string
  seasonal_ind: boolean
  license_ind: boolean
  open_access_ind: boolean
  contact_folio: any
}

export interface ConsumerData {
  consumer: Consumer
  contact: {
    connection_id: number | string
    version_id: number | null
    primary_address_id: number | null
    billing_address_id: number | null
    premises_address_id: number | null
  }
  connection?: Connection
}

export interface OfficeHierarchyRel {
  child_office_code: number
  hierarchy_code: string
  hierarchy_rel_hist_id: number
  parent_office_code: number
}

export interface MeterAssignment {
  version_id: number
  rel_id: number
  meter_id: number
  connection_id: number
  meter_use_category?: Partial<ParameterValues> | null
  bidirectional_ind: boolean
  meter_billing_mode: string
  meter_status?: Partial<ParameterValues> | null
  faulty_date?: string
  rectification_date?: string
  change_reason?: Partial<ParameterValues> | null
  effective_start_ts: string
  effective_end_ts?: string
  is_active: boolean
  created_ts: string
  updated_ts?: string
  created_by: number
  updated_by: number
}

export interface Meter {
  version_id: number
  meter_id: number
  meter_serial: string

  // Ownership Type
  ownership_type_id: number
  ownership_type: ParameterValues | null

  // Meter Profile
  profile_id: number
  meter_profile_id: number
  profile: ParameterValues | null
  meter_profile: ParameterValues | null

  // Meter Make
  meter_make_id: number
  meter_make: ParameterValues | null

  // Meter Type
  meter_type_id: number
  meter_type: ParameterValues | null

  // Meter Category
  meter_category_id: number
  meter_category: ParameterValues | null

  // Accuracy Class
  accuracy_class_id: number
  accuracy_class: ParameterValues | null

  // Dialing Factor
  dialing_factor_id: number
  dialing_factor: ParameterValues | null

  company_seal_num: string | null
  digit_count: number | null
  manufacture_date: string | null
  supply_date: string | null

  // Meter Unit
  meter_unit_id: number
  meter_unit: ParameterValues | null

  // Meter Reset Type
  meter_reset_type_id: number
  meter_reset_type: ParameterValues | null

  smart_meter_ind: boolean
  bidirectional_ind: boolean

  // Meter Phase
  meter_phase_id: number
  meter_phase: ParameterValues | null

  decimal_digit_count: number | null
  programmable_pt_ratio: number | null
  programmable_ct_ratio: number | null
  meter_mf: number | null
  warranty_period: number | null
  meter_constant: number | null
  batch_code: string | null

  // Internal CT/PT ratios
  internal_ct_primary: number | null
  internal_ct_secondary: number | null
  internal_pt_primary: number | null
  internal_pt_secondary: number | null

  created_ts: string | null
  updated_ts: string | null
  created_by: number
  updated_by: number
  transformers: MeterTransformer[]
}

export interface MeterTransformer {
  meter_ctpt_id: number
  ownership_type_id: number | string
  accuracy_class_id: number | string
  burden_id: number | string
  make_id: number | string
  type_id: number | string
  ownership_type?: Partial<ParameterValues> | null
  accuracy_class?: Partial<ParameterValues> | null
  burden?: Partial<ParameterValues> | null
  make?: Partial<ParameterValues> | null
  type?: Partial<ParameterValues> | null
  ctpt_serial: string
  ratio_primary_value: string | null
  ratio_secondary_value: string | null
  manufacture_date?: string | null
  created_ts: string | null
  updated_ts?: string | null
  created_by: number
  updated_by?: number | null
  is_active?: boolean
}

export interface MeterTransformerAssignment {
  version_id: number
  ctpt_id: number
  meter_id: number
  meter_serial?: string | null
  faulty_date?: string | null
  ctpt_energise_date?: string | null
  ctpt_change_date?: string | null
  status_id: number
  status_label?: string | null
  change_reason_id: number
  change_reason_label?: string | null
  created_ts?: string | null
  updated_ts?: string | null
  created_by: number
  updated_by?: number | null
  ctpt_type?: string | null
  ratio?: string | number | null
}

export interface MeteringTimezoneSlot {
  version_id: number
  metering_timezone_id: number
  pricing_type_id: number
  pricing_type?: Partial<ParameterValues> | null
  timezone_type_id: number
  timezone_type?: Partial<ParameterValues> | null
  timezone_name_id: number
  timezone_name?: Partial<ParameterValues> | null
  from_hrs?: number | null
  from_mins?: number | null
  to_hrs?: number | null
  to_mins?: number | null
  effective_start_ts: string
  effective_end_ts?: string | null
  created_ts: string
  updated_ts?: string | null
  created_by?: number | null
  updated_by?: number | null
  is_active?: boolean | null
}

export interface MeterTimezoneType {
  version_id: number
  rel_id?: number | null
  meter_id: number
  timezone_type_id: number
  timezone_type?: Partial<ParameterValues> | null
  effective_start_ts: string
  effective_end_ts?: string | null
  created_ts: string
  updated_ts?: string | null
  created_by?: number | null
  updated_by?: number | null
  is_active?: boolean | null
}

export interface MeterReading {
  id: number
  meter_reading_detail_id: number
  connection_id: number
  metering_date: string
  reading_start_date: string
  reading_end_date: string
  single_reading: boolean
  multiple_reading: boolean
  anomaly_id: number
  meter_health_id: number
  ctpt_health_id: number
  voltage_r: number
  voltage_y: number
  voltage_b: number
  current_r: number
  current_y: number
  current_b: number
  remarks: string
  created_by: number
  updated_by: number
  is_active: boolean
  values: MeterReadingValue[]
}
export interface MeterReadingValue {
  id: number
  meter_reading_id: number
  meter_id: number
  meter_profile_parameter_id: number
  meter_profile_parameter?: MeterProfileParameter
  time_zone_id: number
  time_zone?: Partial<ParameterValues> | null
  final_reading: number
  initial_reading: number
  difference: number
  meter?: Meter
}
export interface MeterProfileParameter {
  version_id: number
  meter_parameter_id: number
  profile_id: number
  name: string
  display_name: string
  is_export: boolean
}
export interface MeterReadingPowerFactor {
  id: number
  meter_reading_id: number
  average_power_factor: number
  meter_reading: MeterReading
  meter: Meter
}
export interface TariffOrder {
  tariff_order_id: number
  order_descriptor: string
  reference_document: string
  published_date: string
  effective_start: string
  effective_end?: string
  created_by: number
  updated_by: number
  created_ts?: string
  updated_ts?: string
}
export interface TariffConfig {
  tariff_config_id: number
  tariff_order_id: number
  connection_purpose: ParameterValues
  connection_tariff: ParameterValues
  consumption_lower_limit: number
  consumption_upper_limit: number
  demand_charge_kva: number
  energy_charge_kwh: number
  tariff_order: TariffOrder
  effective_start: string
  effective_end?: string
}

export interface BillingRule {
  id: number
  name: string
  effective_start: string
  effective_end: string
  rule: BillingRuleJson
  deleted_at?: string
  created_by?: number
  updated_by?: number
  created_at?: string
  updated_at?: string
}

export interface ComputedProperty {
  id: number
  name: string
  effective_start: string
  effective_end: string
  calculations: JSON
  deleted_at?: string
  created_by?: number
  updated_by?: number
  created_at?: string
  updated_at?: string
}

export interface ChargeHead {
  id: number
  name: ParameterValues
  effective_start: string
  effective_end: string
  calculations: JSON
  deleted_at?: string
  created_by?: number
  updated_by?: number
  created_at?: string
  updated_at?: string
}
export interface BillingRuleJson {
  id: number
  no_of_zones: number
  name: string
  computed_properties: ComputedProperty[]
  charge_heads: ChargeHead[]
}

export interface meterWithTimezoneAndProfile {
    meter_id: number;
    meter: Meter;
    timezones: MeterTimezoneType[];
    meter_profiles: MeterProfileParameter[];
}
