import { meterNavItems, transformerNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import MainLayout from '@/layouts/main-layout'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useState, useMemo } from 'react'

// --- Type Definitions ---
interface ParameterOption {
  id: number
  parameter_value: string
}

export interface MeterTransformerFormProps {
  ownershipTypes: ParameterOption[]
  accuracyClasses: ParameterOption[]
  burdens: ParameterOption[]
  makes: ParameterOption[]
  types: ParameterOption[]
  transformer?: any // for edit mode
}

const breadcrumbs = [
  { title: 'Meter CTPT', href: '/meter-ctpt' },
  {
    title: 'Add Meter CTPT',
    href: '/meter-ctpt/create',
  },
]

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

export default function MeterTransformerForm({
  ownershipTypes,
  accuracyClasses,
  burdens,
  makes,
  types,
  transformer,
}: MeterTransformerFormProps) {
  const isEditing = Boolean(transformer)

  const [transformerType, setTransformerType] = useState<string>(
    transformer?.type?.parameter_value ?? ''
  )

  const transformerInfo = useMemo(() => {
    const type = transformerType?.toUpperCase()
    if (type === 'CT') {
      return {
        primary: 'Primary Current',
        secondary: 'Secondary Current',
        primaryUnit: 'A',
        secondaryUnit: 'A',
      }
    } else if (type === 'PT') {
      return {
        primary: 'Primary Voltage',
        secondary: 'Secondary Voltage',
        primaryUnit: 'V',
        secondaryUnit: 'V',
      }
    }
    return {
      primary: 'Primary Ratio',
      secondary: 'Secondary Ratio',
      primaryUnit: '',
      secondaryUnit: '',
    }
  }, [transformerType])

  const { formData, setFormValue } = useCustomForm({
    ctpt_serial: transformer?.ctpt_serial ?? '',
    ownership_type_id: transformer?.ownership_type_id ?? null,
    accuracy_class_id: transformer?.accuracy_class_id ?? null,
    burden_id: transformer?.burden_id ?? null,
    make_id: transformer?.make_id ?? null,
    type_id: transformer?.type_id ?? null,
    ratio_primary_value: transformer?.ratio_primary_value ?? '',
    ratio_secondary_value: transformer?.ratio_secondary_value ?? '',
    manufacture_date: toYMD(transformer?.manufacture_date) ?? '',
  })

  const { post, loading, errors } = useInertiaPost(
    isEditing ? `/meter-ctpt/${transformer.meter_ctpt_id}` : '/meter-ctpt',
    {
      showErrorToast: true,
    }
  )

  const handletypeChange = (id: string | number) => {
    const numericId = Number(id)
    const selected = types.find((t) => t.id == numericId)?.parameter_value || ''
    setTransformerType(selected)
    setFormValue('type_id')(numericId)
    console.log('Selected Type:', selected, 'id:', numericId, types)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      ctpt_serial: formData.ctpt_serial,
      ownership_type_id: toNumberOrUndef(formData.ownership_type_id),
      accuracy_class_id: toNumberOrUndef(formData.accuracy_class_id),
      burden_id: toNumberOrUndef(formData.burden_id),
      make_id: toNumberOrUndef(formData.make_id),
      type_id: toNumberOrUndef(formData.type_id),
      ratio_primary_value: formData.ratio_primary_value || '',
      ratio_secondary_value: formData.ratio_secondary_value || '',
      manufacture_date: toISOorNull(formData.manufacture_date),
    }

    console.log('Payload:', payload)

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
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterNavItems}
    >
      <div className='p-6'>
        <CardHeader
          title={isEditing ? 'Edit CTPT' : 'Create CTPT'}
          subheading={isEditing ? 'Update CTPT details' : 'Add a new CTPT to the system'}
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
                  label='CT/PT Serial'
                  required
                  value={formData.ctpt_serial}
                  setValue={setFormValue('ctpt_serial')}
                  error={errors.ctpt_serial}
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
                  label='Make'
                  value={formData.make_id}
                  setValue={setFormValue('make_id')}
                  list={makes}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.make_id}
                />
                <SelectList
                  label='Type'
                  value={formData.type_id}
                  setValue={handletypeChange}
                  list={types}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.type_id}
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
                  label='Burden'
                  value={formData.burden_id}
                  setValue={setFormValue('burden_id')}
                  list={burdens}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.burden_id}
                />
                <Input
                  label={transformerInfo.primary}
                  type='text'
                  value={formData.ratio_primary_value}
                  setValue={setFormValue('ratio_primary_value')}
                  error={errors.ratio_primary_value}
                />

                <Input
                  label={transformerInfo.secondary}
                  type='text'
                  value={formData.ratio_secondary_value}
                  setValue={setFormValue('ratio_secondary_value')}
                  error={errors.ratio_secondary_value}
                />

                <DatePicker
                  label='Manufacture Date'
                  value={formData.manufacture_date}
                  setValue={setFormValue('manufacture_date')}
                  error={errors.manufacture_date}
                />
              </>
            )}

            <div className='flex justify-end gap-3 border-t pt-6'>
              <Button
                type='button'
                label='Cancel'
                variant='secondary'
                onClick={() => router.get('/meter-ctpt')}
                disabled={loading}
              />
              <Button
                type='submit'
                label={isEditing ? 'Update Transformer' : 'Create Transformer'}
                disabled={loading}
              />
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
