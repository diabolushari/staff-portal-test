export interface SystemModule {
  id: number
  name: string
}

export interface ParameterDomain {
  id: number
  domainName: string
  description: string
  domainCode: string
  managedByModule: number
  managedByModuleName?: string
}

export interface ParameterDefinition {
  id: number
  name: string
  domainId: number
  domainName?: string
  attribute1: string
  attribute2: string
  attribute3: string
  attribute4: string
  attribute5: string
  isEffectiveDateDriven: boolean
}

export interface ParameterValues {
  id: number
  name: string
  definitionId: number
  parameterCode: string
  parameterValue: string
  definitionName?: string
  attribute1Value?: string
  attribute2Value?: string
  attribute3Value?: string
  attribute4Value?: string
  attribute5Value?: string
  sortPriority: number
  notes: string
  effectiveStartDate: string
  effectiveEndDate: string
}
