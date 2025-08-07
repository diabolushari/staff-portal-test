export interface Office {
  officeId: number
  officeCode: string
  officeDescription: string
  officeTypeId: number
  parentOfficeId: number
  effectiveStartDate: string
  effectiveEndDate: string
  contactFolio: {
    phone: string
    email: string
    name: string
    address: string
  }
  location: {
    name: string
    address: string
  }
  officeAddress: {
    name: string
    address: string
  }
  isCurrent: boolean
  createdAt: string
  updatedAt: string
  createdBy: number
  updatedBy: number
}
