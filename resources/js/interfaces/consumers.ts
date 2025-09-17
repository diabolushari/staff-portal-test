import { ParameterValues } from "./parameter_types"

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

export interface Connection {
  connection_id: number
  admin_office_code: number
  service_office_code: number
  billing_process_id: number
  billing_process: ParameterValues
  consumer_legacy_code: string
  connected_date: string
  connected_load_info: string | null
  connected_load_kw_val: number
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
  contract_demand_kw_val: number
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
  version_id: number
}

export interface OfficeHierarchy {
  hierarchy_id: number
  hierarchy_code: string
  hierarchy_name: string
}

export interface ConsumerData {
  consumer: {
    connection_id: number | string
    consumer_type_id: number | string
    organization_name: string
    applicant_code: string
    consumer_pan: string
    consumer_tan?: string | null
    consumer_gstin?: string | null
    consumer_type: ParameterValues[]
    [key: string]: any
  }
  contact: {
    connection_id: number | string
    version_id: number | null
    primary_address_id: number | null
    billing_address_id: number | null
    premises_address_id: number | null
    [key: string]: any
  }
  connection?: Connection
}

export interface OfficeHierarchyRel {
  child_office_code: number
  hierarchy_code: string
  hierarchy_rel_hist_id: number
  parent_office_code: number
}
