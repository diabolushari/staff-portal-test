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
  system_module?: Partial<SystemModule> | null
}
