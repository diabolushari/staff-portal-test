import { ParameterValues } from './parameter_types'
import { Party } from './parties'

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
  meter?: Meter | null
  transformers?: MeterTransformerAssignment[]
  notice_date?: string
  intimation_date?: string
  change_date?: string
  energise_date?: string
  meter_profile?: ParameterValues
  meter_mf?: number | null
}

export interface DateTimeField {
  date: string
  timezone_type: number
  timezone: string
}

export interface ConnectionPartyMapping {
  version_id: number
  rel_id?: number
  connection_id: number
  party_id: number
  party_relation_type_id: number
  effective_start: DateTimeField
  effective_end: DateTimeField | null
  is_active: boolean
  created_by?: number
  updated_by?: number
  deleted_by?: number | null
  deleted_ts?: DateTimeField | null
  party_type_id?: number
  party_type?: {
    id: number
    parameter_value: string
  }
  party: Party
}

export interface ConnectionFlag {
  connection_id: number
  created_by: number
  effective_end: string
  effective_start: string
  flag_id: number
  id: number
  is_current: boolean
  updated_by: number
  updated_ts: string
  flag: ParameterValues | null
}

export interface ConnectionGenerationType {
  connection_id: number
  created_by: number
  effective_end: string
  effective_start: string
  generation_type_id: number
  generation_type: ParameterValues | null
  id: number
  is_current: boolean
  updated_by: number
  updated_ts: string
  generation_sub_type: ParameterValues | null
  generation_sub_type_id: number
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
  other_purposes: number[] | null
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
  power_intensive: boolean
  excess_demand: boolean
  no_of_main_meters: number
  remarks?: string
  application_no: string
  admin_office: Office | null
  service_office: Office | null
  meter_count?: number
  meter_mappings: MeterConnectionMapping[]
  consumer_profiles?: Consumer[]
  latest_meter_reading?: MeterReading
  connection_flags?: ConnectionFlag[]
  connection_generation_types?: ConnectionGenerationType[]
  previous_reading: MeterReading
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
  virtual_account_number: string
  department_name_id: number | string
  department_name: ParameterValues
  contact_person: string
  manufacturing_info: Record<string, any>
  tax_info: Record<string, any>
  identity_info: Record<string, any>
  application_info: Record<string, any>
  addresses?: Record<string, any>

  contact_folio: any
  flags?: ConnectionFlag[]
  contact_details?: Contact[]
}

export interface Contact {
  connection_id: number | string
  version_id: number | null
  primary_address_id: number | null
  billing_address_id: number | null
  premises_address_id: number | null
  primary_email?: string
  primary_phone?: string
  contact_folio: any
  primary_address?: Address
  billing_address?: Address
  premises_address?: Address
}

export interface ConsumerData {
  consumer: Consumer
  contact: Contact
  connection?: Connection
}

export interface Address {
  address_id: number | string
  address_line1: string
  address_line2: string
  city_town_village: string
  district: GeoRegion
  district_id: number
  pincode: number
  state: GeoRegion
  state_id: number
}

export interface GeoRegion {
  id: number
  name: string
  type_id: number
  type: ParameterValues
  classification_id: number
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
  meter_id: number
  meter_serial: string

  ownership_type_id: number
  ownership_type: ParameterValues | null
  meter_make_id: number
  meter_make: ParameterValues | null

  meter_type_id: number
  meter_type: ParameterValues | null

  meter_category_id: number | null
  meter_category: ParameterValues | null

  accuracy_class_id: number
  accuracy_class: ParameterValues | null

  dialing_factor_id: number
  dialing_factor: ParameterValues | null

  company_seal_num: string | null
  digit_count: number | null
  manufacture_date: string | null
  supply_date: string | null

  meter_unit_id: number
  meter_unit: ParameterValues | null

  meter_reset_type_id: number
  meter_reset_type: ParameterValues | null

  smart_meter_ind: boolean
  bidirectional_ind: boolean

  meter_phase_id: number
  meter_phase: ParameterValues | null

  decimal_digit_count: number | null
  programmable_pt_ratio: number | null
  programmable_ct_ratio: number | null
  warranty_period: number | null
  meter_constant: number | null
  batch_code: string | null

  internal_ct_primary: number | null
  internal_ct_secondary: number | null
  internal_pt_primary: number | null
  internal_pt_secondary: number | null

  ct_count: number | null
  pt_count: number | null

  created_ts: string | null
  updated_ts: string | null
  created_by: number | null
  updated_by: number | null

  transformers: MeterTransformer[]
  has_meter_reading?: boolean
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
  is_edit: boolean
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
export interface PrimarySecondaryRatio {
  primary_id: number
  secondary_id: number
  ratio: string
}
export interface MeterTransformerAssignment {
  version_id: number
  ctpt_id: number
  meter_id: number
  meter_serial?: string | null
  status?: Partial<ParameterValues> | null
  faulty_date?: string | null
  ctpt_energise_date?: string | null
  ctpt_change_date?: string | null
  status_id: number
  change_reason_id: number
  change_reason?: Partial<ParameterValues> | null
  created_ts?: string | null
  updated_ts?: string | null
  created_by: number
  updated_by?: number | null
  ctpt?: MeterTransformer | null
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
  remarks: string
  created_by: number
  updated_by: number
  is_active: boolean
  values: MeterReadingValue[]
  power_factors: MeterReadingPowerFactor[]
  healths: MeterHealth[]
}

export interface MeterHealth {
  id: number
  meter_reading_id: number
  meter_id: number
  parameter_id: number
  current_r: number
  current_y: number
  current_b: number
  voltage_r: number
  voltage_y: number
  voltage_b: number
}

export interface MeterReadingValue {
  id: number
  meter_reading_id: number
  meter_id: number
  parameter_id: number
  meter_profile_parameter?: MeterProfileParameter
  timezone_id: number
  time_zone?: Partial<ParameterValues> | null
  final_reading: number
  initial_reading: number
  difference: number
  value: number
  meter?: Meter
}

export interface MeterProfileParameter {
  version_id: number
  meter_parameter_id: number
  profile_id: number
  profile: ParameterValues | null
  name: string
  display_name: string
  is_export: boolean
  is_cumulative: boolean
}
export interface MeterProfileGroupByProfile {
  profile: ParameterValues | null
  parameters: MeterProfileParameter[]
}

export interface MeterReadingPowerFactor {
  id: number
  meter_reading_id: number
  meter_id: number
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

export interface MeterWithTimezoneAndProfile {
  meter_id: number
  meter: Meter
  timezones: {
    timezone_id: number
    timezone_name: string
  }[]
  reading_parameters: MeterProfileParameter[]
  meter_profile: ParameterValues
  meter_mf: number | null
}

export interface BillingGroup {
  version_id: number
  billing_group_id: number
  name: string
  description: string
  effective_start: string
  effective_end: string
  deleted_at?: string
  created_by?: number
  updated_by?: number
  created_at?: string
  updated_at?: string
  connections: BillingGroupConnection[]
}
export interface BillingGroupConnection {
  version_id: number
  connection_id: number
  connection: Connection
  consumer: Consumer
}
export interface Bill {
  bill_id: number
  connection_id: number
  reading_year_month: string
  bill_year_month: string
  bill_date: string
  due_date: string
  dc_date: string
  bill_amount: number
  charge_heads: ChargeHead[]
  computed_properties: ComputedProperty[]
  remarks: string
  created_ts: string
  created_by: number
  deleted_ts?: string
  deleted_by?: number
  connection: Connection
  consumer: Consumer
}

export interface BillGenerationJob {
  id: number
  billing_group_id: number
  reading_year_month: string
  bill_year_month: string
  initialized_date: string

  bill_generation_job_status: BillGenerationJobStatus[]
  billing_group: BillingGroup

  total_connections: number
  total_bills: number
  total_exceptions: number
  total_pending: number
}
export interface BillGenerationJobStatus {
  version_id: number
  bill_generation_job_status_id: number
  connection_id: number
  exception: string
  connection: Connection
  bill?: Bill | null
}
export interface BillWithException {
  bills: Bill[]
  exceptions: BillGenerationJobStatus[]
}

export interface RegionOption {
  region_id: number | string
  region_name: string
  [key: string]: unknown
}

export interface MeterProfileParameter {
  display_name: string
  id: number
  is_active: boolean
  is_cumulative: boolean
  is_export: boolean
  meter_parameter_id: number
  name: string
  profile: ParameterValues | null
  profile_id: number
}
