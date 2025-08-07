export interface SystemModule {
  id: number
  name: string
}

export interface ParameterDomain {
  id: number
  name: string
  description: string
  domainCode: string
  managedByModule: number
}

export interface ParameterDefinition {
  id: number
  name: string
  description: string
  domainCode: string
  managedByModule: number
}

export interface ParameterValue {
  id: number
  name: string
  description: string
  domainCode: string
  managedByModule: number
}
