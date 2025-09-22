import { router, usePage } from '@inertiajs/react'
import { meterNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import MainLayout from '@/layouts/main-layout'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import CheckBox from '@/ui/form/CheckBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { ParameterValues } from '@/interfaces/parameter_types'

export interface MeterFormProps {
  ownershipTypes: ParameterValues[]
  makes: ParameterValues[]
  types: ParameterValues[]
  categories: ParameterValues[]
  accuracyClasses: ParameterValues[]
  phases: ParameterValues[]
  dialingFactors: ParameterValues[]
  units: ParameterValues[]
  resetTypes: ParameterValues[]
  internalPtRatios: ParameterValues[]
  internalCtRatios: ParameterValues[]
  meter?: any // Add meter prop for edit mode later
}
// --- Helper Functions ---
const toYMD = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
}
const toISOorNull = (ymd: string) => {
  if (!ymd) return null
  const date = new Date(ymd)
  // Format to match 'Y-m-d\TH:i:sP' exactly, e.g., '2025-09-17T00:00:00+00:00'
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}T00:00:00+00:00`
}
const toNumberOrUndef = (v: unknown) => {
  if (v === null || v === undefined || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}
const toFloatOrUndef = (v: unknown) => {
  if (v === null || v === undefined || v === '') return undefined
  const n = parseFloat(v as string)
  return Number.isFinite(n) ? n : undefined
}
export default function MeterForm({
  ownershipTypes,
  makes,
  types,
  categories,
  accuracyClasses,
  phases,
  dialingFactors,
  units,
  resetTypes,
  meter,
}: MeterFormProps) {
  const { auth } = usePage().props as any // Assuming auth is available in page props
  const isEditing = Boolean(meter)
  const { formData, setFormValue } = useCustomForm({
    meter_serial: meter?.meter_serial ?? '',
    ownership_type_id: meter?.ownership_type_id ?? null,
    meter_make_id: meter?.meter_make_id ?? null,
    meter_type_id: meter?.meter_type_id ?? null,
    meter_category_id: meter?.meter_category_id ?? null,
    accuracy_class_id: meter?.accuracy_class_id ?? null,
    dialing_factor_id: meter?.dialing_factor_id ?? null,
    company_seal_num: meter?.company_seal_num ?? '',
    digit_count: meter?.digit_count ?? '',
    manufacture_date: toYMD(meter?.manufacture_date),
    supply_date: toYMD(meter?.supply_date),
    meter_unit_id: meter?.meter_unit_id ?? null,
    meter_reset_type_id: meter?.meter_reset_type_id ?? null,
    smart_meter_ind: meter?.smart_meter_ind ?? false,
    bidirectional_ind: meter?.bidirectional_ind ?? false,
    meter_phase_id: meter?.meter_phase_id ?? null,
    decimal_digit_count: meter?.decimal_digit_count ?? '',
    programmable_pt_ratio: meter?.programmable_pt_ratio ?? '',
    programmable_ct_ratio: meter?.programmable_ct_ratio ?? '',
    meter_mf: meter?.meter_mf ?? '',
    warranty_period: meter?.warranty_period ?? '',
    meter_constant: meter?.meter_constant ?? '',
    batch_code: meter?.batch_code ?? '',
    internal_ct_primary: meter?.internal_ct_primary ?? '',
    internal_ct_secondary: meter?.internal_ct_secondary ?? '',
    internal_pt_primary: meter?.internal_pt_primary ?? '',
    internal_pt_secondary: meter?.internal_pt_secondary ?? '',
    created_by: auth?.user?.id ?? 0,
    updated_by: auth?.user?.id ?? 0,
    _method: isEditing ? 'PUT' : undefined,
  })
  const { post, loading, errors } = useInertiaPost<typeof formData>(
    isEditing ? `/meters/${meter.id}` : '/meters'
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const basePayload = {
      meter_serial: formData.meter_serial,
      ownership_type_id: toNumberOrUndef(formData.ownership_type_id),
      meter_make_id: toNumberOrUndef(formData.meter_make_id),
      meter_type_id: toNumberOrUndef(formData.meter_type_id),
      meter_category_id: toNumberOrUndef(formData.meter_category_id),
      accuracy_class_id: toNumberOrUndef(formData.accuracy_class_id),
      dialing_factor_id: toNumberOrUndef(formData.dialing_factor_id),
      company_seal_num: formData.company_seal_num,
      digit_count: toNumberOrUndef(formData.digit_count),
      manufacture_date: toISOorNull(formData.manufacture_date),
      supply_date: toISOorNull(formData.supply_date),
      meter_unit_id: toNumberOrUndef(formData.meter_unit_id),
      meter_reset_type_id: toNumberOrUndef(formData.meter_reset_type_id),
      smart_meter_ind: formData.smart_meter_ind,
      bidirectional_ind: formData.bidirectional_ind,
      meter_phase_id: toNumberOrUndef(formData.meter_phase_id),
      decimal_digit_count: toNumberOrUndef(formData.decimal_digit_count),
      programmable_pt_ratio: toFloatOrUndef(formData.programmable_pt_ratio),
      programmable_ct_ratio: toNumberOrUndef(formData.programmable_ct_ratio),
      meter_mf: toFloatOrUndef(formData.meter_mf),
      warranty_period: toNumberOrUndef(formData.warranty_period),
      meter_constant: toNumberOrUndef(formData.meter_constant),
      batch_code: formData.batch_code,
      internal_ct_primary: toNumberOrUndef(formData.internal_ct_primary),
      internal_ct_secondary: toNumberOrUndef(formData.internal_ct_secondary),
      internal_pt_primary: toNumberOrUndef(formData.internal_pt_primary),
      internal_pt_secondary: toNumberOrUndef(formData.internal_pt_secondary),
      created_by: auth?.user?.id ?? 0,
      updated_by: auth?.user?.id ?? 0,
    }
    post(basePayload)
  }
  const renderSection = (title: string, children: React.ReactNode) => (
    <div className='rounded-md border border-slate-200 p-4'>
      <h3 className='mb-4 text-lg font-medium'>{title}</h3>
      <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {children}
      </div>
    </div>
  )
  return (
    <MainLayout navItems={meterNavItems}>
      <div className='p-6'>
        <CardHeader
          title={isEditing ? 'Edit Meter' : 'Create New Meter'}
          subheading={isEditing ? 'Update meter details' : 'Add a new meter to the system'}
        />
        <Card>
          <form
            onSubmit={handleSubmit}
            className='space-y-8'
          >
            {renderSection(
              'Basic Information',
              <>
                <Input
                  label='Meter Serial'
                  required
                  value={formData.meter_serial}
                  setValue={setFormValue('meter_serial')}
                  error={errors.meter_serial}
                />
                <SelectList
                  label='Meter Make'
                  value={formData.meter_make_id}
                  setValue={setFormValue('meter_make_id')}
                  list={makes}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.meter_make_id}
                />
                <SelectList
                  label='Meter Type'
                  value={formData.meter_type_id}
                  setValue={setFormValue('meter_type_id')}
                  list={types}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.meter_type_id}
                />
                <SelectList
                  label='Ownership Type'
                  value={formData.ownership_type_id}
                  setValue={setFormValue('ownership_type_id')}
                  list={ownershipTypes}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.ownership_type_id}
                />
                <SelectList
                  label='Category'
                  value={formData.meter_category_id}
                  setValue={setFormValue('meter_category_id')}
                  list={categories}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.meter_category_id}
                />
                <Input
                  label='Company Seal Number'
                  value={formData.company_seal_num}
                  setValue={setFormValue('company_seal_num')}
                  error={errors.company_seal_num}
                />
                <Input
                  label='Batch Code'
                  value={formData.batch_code}
                  setValue={setFormValue('batch_code')}
                  error={errors.batch_code}
                />
              </>
            )}
            {renderSection(
              'Technical Specifications',
              <>
                <SelectList
                  label='Accuracy Class'
                  value={formData.accuracy_class_id}
                  setValue={setFormValue('accuracy_class_id')}
                  list={accuracyClasses}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.accuracy_class_id}
                />
                <SelectList
                  label='Dialing Factor'
                  value={formData.dialing_factor_id}
                  setValue={setFormValue('dialing_factor_id')}
                  list={dialingFactors}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.dialing_factor_id}
                />
                <SelectList
                  label='Unit'
                  value={formData.meter_unit_id}
                  setValue={setFormValue('meter_unit_id')}
                  list={units}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.meter_unit_id}
                />
                <SelectList
                  label='Reset Type'
                  value={formData.meter_reset_type_id}
                  setValue={setFormValue('meter_reset_type_id')}
                  list={resetTypes}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.meter_reset_type_id}
                />
                <SelectList
                  label='Phase'
                  value={formData.meter_phase_id}
                  setValue={setFormValue('meter_phase_id')}
                  list={phases}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.meter_phase_id}
                />
                <Input
                  label='Digit Count'
                  type='number'
                  value={formData.digit_count}
                  setValue={setFormValue('digit_count')}
                  error={errors.digit_count}
                />
                <Input
                  label='Decimal Digit Count'
                  type='number'
                  value={formData.decimal_digit_count}
                  setValue={setFormValue('decimal_digit_count')}
                  error={errors.decimal_digit_count}
                />
                <Input
                  label='Programmable PT Ratio'
                  type='number'
                  value={formData.programmable_pt_ratio}
                  setValue={setFormValue('programmable_pt_ratio')}
                  error={errors.programmable_pt_ratio}
                />
                <Input
                  label='Programmable CT Ratio'
                  type='number'
                  value={formData.programmable_ct_ratio}
                  setValue={setFormValue('programmable_ct_ratio')}
                  error={errors.programmable_ct_ratio}
                />
                <Input
                  label='Meter MF'
                  type='number'
                  value={formData.meter_mf}
                  setValue={setFormValue('meter_mf')}
                  error={errors.meter_mf}
                />
                <Input
                  label='Warranty Period'
                  type='number'
                  value={formData.warranty_period}
                  setValue={setFormValue('warranty_period')}
                  error={errors.warranty_period}
                />
                <Input
                  label='Meter Constant'
                  type='number'
                  value={formData.meter_constant}
                  setValue={setFormValue('meter_constant')}
                  error={errors.meter_constant}
                />
                <Input
                  label='Internal CT Primary'
                  type='number'
                  value={formData.internal_ct_primary}
                  setValue={setFormValue('internal_ct_primary')}
                  error={errors.internal_ct_primary}
                />
                <Input
                  label='Internal CT Secondary'
                  type='number'
                  value={formData.internal_ct_secondary}
                  setValue={setFormValue('internal_ct_secondary')}
                  error={errors.internal_ct_secondary}
                />
                <Input
                  label='Internal PT Primary'
                  type='number'
                  value={formData.internal_pt_primary}
                  setValue={setFormValue('internal_pt_primary')}
                  error={errors.internal_pt_primary}
                />
                <Input
                  label='Internal PT Secondary'
                  type='number'
                  value={formData.internal_pt_secondary}
                  setValue={setFormValue('internal_pt_secondary')}
                  error={errors.internal_pt_secondary}
                />
                <div className='flex items-center space-x-4 pt-6'>
                  <CheckBox
                    label='Smart Meter'
                    value={formData.smart_meter_ind}
                    toggleValue={() => setFormValue('smart_meter_ind')(!formData.smart_meter_ind)}
                    error={errors.smart_meter_ind}
                  />
                  <CheckBox
                    label='Bidirectional'
                    value={formData.bidirectional_ind}
                    toggleValue={() =>
                      setFormValue('bidirectional_ind')(!formData.bidirectional_ind)
                    }
                    error={errors.bidirectional_ind}
                  />
                </div>
              </>
            )}
            {renderSection(
              'Dates',
              <>
                <DatePicker
                  label='Manufacture Date'
                  value={formData.manufacture_date}
                  setValue={setFormValue('manufacture_date')}
                  error={errors.manufacture_date}
                />
                <DatePicker
                  label='Supply Date'
                  value={formData.supply_date}
                  setValue={setFormValue('supply_date')}
                  error={errors.supply_date}
                />
              </>
            )}
            <div className='flex justify-end gap-3 border-t pt-6'>
              <Button
                type='button'
                label='Cancel'
                variant='secondary'
                onClick={() => router.get('/meters')}
                disabled={loading}
              />
              <Button
                type='submit'
                label={isEditing ? 'Update Meter' : 'Create Meter'}
                disabled={loading}
              />
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
