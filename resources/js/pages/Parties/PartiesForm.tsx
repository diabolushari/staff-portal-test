import useCustomForm from '@/hooks/useCustomForm'
import AppLayout from '@/layouts/app-layout'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useMemo, useState } from 'react'

//TODO: Move to interface file.
interface Party {
  // Backend-owned identifiers (not rendered)
  version_id: number
  party_id: number

  // Editable fields
  party_code: number
  party_legacy_code: string
  name: string
  party_type_id: number
  status_id: number
  effective_start: string | null
  effective_end: string | null
  is_current: boolean

  // Contact information
  mobile_number?: number | string | null
  telephone_number?: number | string | null
  email_address?: string | null
  address?: string | null
  fax_number?: number | string | null
}

interface PartiesFormProps {
  partyTypes: Array<{ id: number; parameterValue: string }>
  partyStatus: Array<{ id: number; parameterValue: string }>
  party?: Party // provided in edit mode
}

//TODO: use dayjs
function toYMD(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function PartiesForm({ partyTypes, partyStatus, party }: PartiesFormProps) {
  //TODO: use party != null everywhere
  const isEditing = Boolean(party)

  const initialFormData =
    isEditing && party
      ? {
          // editable business fields
          party_code: party.party_code?.toString() ?? '',
          party_legacy_code: party.party_legacy_code ?? '',
          name: party.name ?? '',
          party_type_id: party.party_type_id ?? 1,
          status_id: party.status_id ?? 1,
          // dates (nullable)
          effective_start: toYMD(party.effective_start),
          effective_end: toYMD(party.effective_end),
          is_current: party.is_current ?? true,
          // contacts
          mobile_number: party.mobile_number?.toString() ?? '',
          telephone_number: party.telephone_number?.toString() ?? '',
          email_address: party.email_address ?? '',
          address: party.address ?? '',
          fax_number: party.fax_number?.toString() ?? '',
          // meta for backend auditing, adjust as needed
          updated_by: 1,
          // keep identifiers internally for update payload only
          __party_id: party.party_id,
          __version_id: party.version_id,
        }
      : {
          // create mode
          party_code: '',
          party_legacy_code: '',
          name: '',
          party_type_id: 1,
          status_id: 1,
          effective_start: '',
          effective_end: '',
          is_current: true,
          mobile_number: '',
          telephone_number: '',
          email_address: '',
          address: '',
          fax_number: '',
          created_by: 1,
        }

  const { formData, setFormValue } = useCustomForm(initialFormData)

  // Local UI validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const toNumberOrUndef = (v: unknown) => {
    if (v === null || v === undefined || v === '') return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }

  const toISOorNull = (ymd: string) => {
    if (!ymd) return null
    const d = new Date(ymd)
    if (Number.isNaN(d.getTime())) return null
    return d.toISOString()
  }

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    // Required: party_code (digits only)
    if (!formData.party_code?.toString().trim()) {
      e.party_code = 'Party Code is required.'
    } else if (!/^\d+$/.test(String(formData.party_code))) {
      e.party_code = 'Party Code must contain only digits.'
    }

    // Required: name
    if (!formData.name?.toString().trim()) {
      e.name = 'Name is required.'
    }

    // Optional: email format
    if (formData.email_address && formData.email_address.trim().length > 0) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)
      if (!emailOk) e.email_address = 'Enter a valid email address.'
    }

    // Optional: phone formats (digits only)
    const phoneFields = ['mobile_number', 'telephone_number', 'fax_number'] as const
    for (const f of phoneFields) {
      const v = String((formData as any)[f] ?? '')
      if (v && v.trim() && !/^\d+$/.test(v.trim())) {
        e[f] = 'Use digits only.'
      }
    }

    return e
  }, [formData])

  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }))

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Ensure required fields show errors
    markTouched('party_code')
    markTouched('name')

    if (Object.keys(errors).length > 0) return

    if (isEditing) {
      // Update payload: include party_id and version_id as requested (not shown in UI)
      const updatePayload: Record<string, any> = {
        version_id: (formData as any).__version_id,
        party_id: (formData as any).__party_id,
        party_code: toNumberOrUndef(formData.party_code),
        party_legacy_code: formData.party_legacy_code,
        name: formData.name,
        party_type_id: toNumberOrUndef(formData.party_type_id),
        status_id: toNumberOrUndef(formData.status_id),
        effective_start: toISOorNull(formData.effective_start),
        effective_end: toISOorNull(formData.effective_end),
        is_current: Boolean(formData.is_current),
        updated_by: (formData as any).updated_by,
        mobile_number: toNumberOrUndef(formData.mobile_number),
        telephone_number: toNumberOrUndef(formData.telephone_number),
        email_address: formData.email_address || '',
        address: formData.address || '',
        fax_number: toNumberOrUndef(formData.fax_number),
        _method: 'PUT',
      }

      // URL can still use version_id (or party_id) per your routes; payload contains both as required.
      router.post(`/parties/${(formData as any).__version_id}`, updatePayload)
    } else {
      const createPayload: Record<string, any> = {
        party_code: toNumberOrUndef(formData.party_code),
        party_legacy_code: formData.party_legacy_code,
        name: formData.name,
        party_type_id: toNumberOrUndef(formData.party_type_id),
        status_id: toNumberOrUndef(formData.status_id),
        effective_start: toISOorNull(formData.effective_start),
        effective_end: toISOorNull(formData.effective_end),
        is_current: Boolean(formData.is_current),
        created_by: (formData as any).created_by,
        mobile_number: toNumberOrUndef(formData.mobile_number),
        telephone_number: toNumberOrUndef(formData.telephone_number),
        email_address: formData.email_address || '',
        address: formData.address || '',
        fax_number: toNumberOrUndef(formData.fax_number),
      }
      //TODO: useInertiaPost
      router.post('/parties', createPayload)
    }
  }

  return (
    <AppLayout>
      <div className='p-6'>
        <CardHeader
          title={isEditing ? 'Edit Party' : 'Create New Party'}
          subheading={isEditing ? 'Update party details' : 'Add a new party'}
        />
        <Card>
          <form
            onSubmit={onSubmit}
            className='space-y-8'
          >
            {/* Basic Information */}
            <div className='rounded-md border border-slate-200 p-4'>
              <h3 className='mb-4 text-lg font-medium text-slate-900'>Basic Information</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Input
                  label='Party Code *'
                  value={formData.party_code}
                  setValue={(val) => {
                    setFormValue('party_code')(val)
                    if (!touched.party_code) markTouched('party_code')
                  }}
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  placeholder='Enter numeric party code'
                  required
                  error={touched.party_code ? errors.party_code : ''}
                />
                <Input
                  label='Legacy Code'
                  value={formData.party_legacy_code}
                  setValue={setFormValue('party_legacy_code')}
                  type='text'
                />
                <Input
                  label='Name *'
                  value={formData.name}
                  setValue={(val) => {
                    setFormValue('name')(val)
                    if (!touched.name) markTouched('name')
                  }}
                  type='text'
                  required
                  error={touched.name ? errors.name : ''}
                />
                <SelectList
                  label='Party Type'
                  value={formData.party_type_id}
                  setValue={setFormValue('party_type_id')}
                  type='number'
                  list={partyTypes}
                  dataKey='id'
                  displayKey='parameterValue'
                />
                <SelectList
                  label='Status'
                  value={formData.status_id}
                  setValue={setFormValue('status_id')}
                  type='number'
                  list={partyStatus}
                  dataKey='id'
                  displayKey='parameterValue'
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className='rounded-md border border-slate-200 p-4'>
              <h3 className='mb-4 text-lg font-medium text-slate-900'>Contact Information</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Input
                  label='Mobile Number'
                  value={formData.mobile_number}
                  setValue={setFormValue('mobile_number')}
                  type='text'
                  inputMode='tel'
                  pattern='[0-9]*'
                  placeholder='e.g., 9876543210'
                  error={touched.mobile_number ? errors.mobile_number : ''}
                  onBlur={() => markTouched('mobile_number')}
                />
                <Input
                  label='Telephone Number'
                  value={formData.telephone_number}
                  setValue={setFormValue('telephone_number')}
                  type='text'
                  inputMode='tel'
                  pattern='[0-9]*'
                  placeholder='e.g., 04712345678'
                  error={touched.telephone_number ? errors.telephone_number : ''}
                  onBlur={() => markTouched('telephone_number')}
                />
                <Input
                  label='Email Address'
                  value={formData.email_address}
                  setValue={setFormValue('email_address')}
                  type='email'
                  placeholder='user@example.com'
                  error={touched.email_address ? errors.email_address : ''}
                  onBlur={() => markTouched('email_address')}
                />

                {/* Address - polished multiline textarea with counter */}
                <div className='md:col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-slate-700'>Address</label>
                  <textarea
                    className='block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-0 outline-none placeholder:text-slate-400 focus:border-slate-400'
                    rows={3}
                    maxLength={500}
                    placeholder='Flat/House, Street, Locality, City, State, PIN'
                    value={formData.address ?? ''}
                    onChange={(e) => setFormValue('address')(e.target.value)}
                    onBlur={() => markTouched('address')}
                  />
                  <div className='mt-1 text-right text-xs text-slate-500'>
                    {formData.address?.length ?? 0}/500
                  </div>
                </div>

                <Input
                  label='Fax Number'
                  value={formData.fax_number}
                  setValue={setFormValue('fax_number')}
                  type='text'
                  inputMode='tel'
                  pattern='[0-9]*'
                  placeholder='e.g., 04712345679'
                  error={touched.fax_number ? errors.fax_number : ''}
                  onBlur={() => markTouched('fax_number')}
                />
              </div>
            </div>

            {/* Validity Period */}
            <div className='rounded-md border border-slate-200 p-4'>
              <h3 className='mb-4 text-lg font-medium text-slate-900'>Validity Period</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <DatePicker
                  label='Effective Start Date'
                  value={formData.effective_start}
                  setValue={setFormValue('effective_start')}
                  helperText='Leave blank if start date is unknown.'
                />
                <DatePicker
                  label='Effective End Date'
                  value={formData.effective_end}
                  setValue={setFormValue('effective_end')}
                  helperText='Leave blank if ongoing.'
                />
              </div>
              {/* If needed later, add a switch for is_current */}
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-3 border-t pt-6'>
              <Button
                type='button'
                label='Cancel'
                variant='secondary'
                onClick={() => router.get('/parties')}
              />
              <Button
                type='submit'
                label={isEditing ? 'Update Party' : 'Create Party'}
              />
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
