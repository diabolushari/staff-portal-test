import { router } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import MainLayout from '@/layouts/main-layout' // Changed to MainLayout as per your file
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import CheckBox from '@/ui/form/CheckBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { meterNavItems } from '@/components/Navbar/navitems'

// --- Type Definitions ---
// Reusable type for a single dropdown option
interface ParameterOption {
  id: number
  parameterValue: string
}

// The complete props interface for the MeterForm component
export interface MeterFormProps {
  ownershipTypes: ParameterOption[]
  makes: ParameterOption[]
  types: ParameterOption[]
  categories: ParameterOption[]
  accuracyClasses: ParameterOption[]
  phases: ParameterOption[] // Note: 'phases' is passed but not in the CreateMeterRequest
  dialingFactors: ParameterOption[]
  units: ParameterOption[]
  resetTypes: ParameterOption[]
  internalPtRatios: ParameterOption[]
  internalCtRatios: ParameterOption[]
  meter?: any // Add meter prop for edit mode later
}

// --- Helper Functions ---
const toYMD = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
}

const toISOorNull = (ymd: string) => (ymd ? new Date(ymd).toISOString() : null)
const toNumberOrUndef = (v: unknown) => {
  if (v === null || v === undefined || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export default function MeterForm({
  ownershipTypes,
  makes,
  types,
  categories,
  accuracyClasses,
  dialingFactors,
  units,
  resetTypes,
  internalPtRatios,
  internalCtRatios,
  meter,
}: MeterFormProps) {
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
    internal_pt_ratio_id: meter?.internal_pt_ratio?.id ?? null,
    internal_ct_ratio_id: meter?.internal_ct_ratio?.id ?? null,
    manufacture_date: toYMD(meter?.manufacture_date),
    supply_date: toYMD(meter?.supply_date),
    meter_unit_id: meter?.meter_unit_id ?? null,
    meter_reset_type_id: meter?.meter_reset_type_id ?? null,
    smart_meter_ind: meter?.smart_meter_ind ?? false,
    bidirectional_ind: meter?.bidirectional_ind ?? false,
  })

  const { post, loading, errors } = useInertiaPost(isEditing ? `/meters/${meter.id}` : '/meters')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Payload must match the CreateMeterRequest protobuf message
    const payload = {
      meter_serial: formData.meter_serial,
      ownership_type_id: toNumberOrUndef(formData.ownership_type_id),
      meter_make_id: toNumberOrUndef(formData.meter_make_id),
      meter_type_id: toNumberOrUndef(formData.meter_type_id),
      meter_category_id: toNumberOrUndef(formData.meter_category_id),
      accuracy_class_id: toNumberOrUndef(formData.accuracy_class_id),
      dialing_factor_id: toNumberOrUndef(formData.dialing_factor_id),
      company_seal_num: formData.company_seal_num,
      digit_count: toNumberOrUndef(formData.digit_count),
      internal_pt_ratio_id: toNumberOrUndef(formData.internal_pt_ratio_id),
      internal_ct_ratio_id: toNumberOrUndef(formData.internal_ct_ratio_id),
      manufacture_date: toISOorNull(formData.manufacture_date),
      supply_date: toISOorNull(formData.supply_date),
      meter_unit_id: toNumberOrUndef(formData.meter_unit_id),
      meter_reset_type_id: toNumberOrUndef(formData.meter_reset_type_id),
      smart_meter_ind: formData.smart_meter_ind,
      bidirectional_ind: formData.bidirectional_ind,
    }

    if (isEditing) {
      post({ ...payload, _method: 'PUT' })
    } else {
      post(payload)
    }
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
                  displayKey='parameterValue'
                  error={errors.meter_make_id}
                />
                <SelectList
                  label='Meter Type'
                  value={formData.meter_type_id}
                  setValue={setFormValue('meter_type_id')}
                  list={types}
                  dataKey='id'
                  displayKey='parameterValue'
                  error={errors.meter_type_id}
                />
                <SelectList
                  label='Ownership Type'
                  value={formData.ownership_type_id}
                  setValue={setFormValue('ownership_type_id')}
                  list={ownershipTypes}
                  dataKey='id'
                  displayKey='parameterValue'
                  error={errors.ownership_type_id}
                />
                <SelectList
                  label='Category'
                  value={formData.meter_category_id}
                  setValue={setFormValue('meter_category_id')}
                  list={categories}
                  dataKey='id'
                  displayKey='parameterValue'
                  error={errors.meter_category_id}
                />
                <Input
                  label='Company Seal Number'
                  value={formData.company_seal_num}
                  setValue={setFormValue('company_seal_num')}
                  error={errors.company_seal_num}
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
                  displayKey='parameterValue'
                  error={errors.accuracy_class_id}
                />
                <SelectList
                  label='Dialing Factor'
                  value={formData.dialing_factor_id}
                  setValue={setFormValue('dialing_factor_id')}
                  list={dialingFactors}
                  dataKey='id'
                  displayKey='parameterValue'
                  error={errors.dialing_factor_id}
                />
                <SelectList
                  label='Unit'
                  value={formData.meter_unit_id}
                  setValue={setFormValue('meter_unit_id')}
                  list={units}
                  dataKey='id'
                  displayKey='parameterValue'
                  error={errors.meter_unit_id}
                />
                <SelectList
                  label='Reset Type'
                  value={formData.meter_reset_type_id}
                  setValue={setFormValue('meter_reset_type_id')}
                  list={resetTypes}
                  dataKey='id'
                  displayKey='parameterValue'
                  error={errors.meter_reset_type_id}
                />
                <Input
                  label='Digit Count'
                  type='number'
                  value={formData.digit_count}
                  setValue={setFormValue('digit_count')}
                  error={errors.digit_count}
                />
                <SelectList
                  label='Internal PT Ratio'
                  value={formData.internal_pt_ratio_id}
                  setValue={setFormValue('internal_pt_ratio_id')}
                  list={internalPtRatios}
                  dataKey='id'
                  displayKey='parameterValue'
                  error={errors.internal_pt_ratio_id}
                />
                <SelectList
                  label='Internal CT Ratio'
                  value={formData.internal_ct_ratio_id}
                  setValue={setFormValue('internal_ct_ratio_id')}
                  list={internalCtRatios}
                  dataKey='id'
                  displayKey='parameterValue'
                  error={errors.internal_ct_ratio_id}
                />
                <div className='flex items-center space-x-4 pt-6'>
                  {/* --- FIX START --- */}
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
                  {/* --- FIX END --- */}
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
