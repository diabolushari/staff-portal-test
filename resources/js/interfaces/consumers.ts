export interface Office {
  id: number
  office_name: string
  office_code: string
  office_description: string
  office_type_id: number
  parent_office_id: number
  effective_start: string
  effective_end: string
  contact_folio: {
    phone: string
    email: string
    name: string
    address: string
  }
  location: {
    name: string
    address: string
  }
  office_address: {
    name: string
    address: string
  }
  is_current: boolean
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}
