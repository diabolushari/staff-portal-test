export interface SystemModule {
  id: number
  name: string
}

export interface ParameterDomain {
  id: number | string
  domain_name: string
  description?: string
  domain_code?: string
  managed_by_module?: number | string
  managed_by_module_name?: string
}
export interface ParameterDefinition {
  id: number | string
  name: string
  domain_id: number
  is_effective_date_driven: boolean
  attribute1_name?: string
  attribute2_name?: string
  attribute3_name?: string
  attribute4_name?: string
  attribute5_name?: string
}
  