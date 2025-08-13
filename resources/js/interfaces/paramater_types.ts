export interface SystemModule {
  id: number
  name: string
}

export interface ParameterDomain {
  id: number
  domain_name: string
  description?: string
  domain_code?: string
  managed_by_module?: number | string
  managed_by_module_name?: string
  system_module?: Partial<SystemModule> | null
}
export interface ParameterDefinition {
  id: number | string
  parameter_name: string
  domain_id: number
  is_effective_date_driven: boolean
  attribute1_name?: string
  attribute2_name?: string
  attribute3_name?: string
  attribute4_name?: string
  attribute5_name?: string
  domain_name?: string
}
  