import { settingsReferenceData } from '@/components/Navbar/navitems'
import capitalSnakeCase from '@/formaters/capitalcase'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition, ParameterDomain, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import DatePicker from '@/ui/form/DatePicker'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Parameter Values',
    href: '/parameter-value',
  },
  {
    title: 'Create Parameter Value',
    href: '/parameter-value/create',
  },
]

interface Props {
  parameter_value?: ParameterValues
  definitions: ParameterDefinition[]
  domains: ParameterDomain[]
}

export default function ParameterValueCreate({ parameter_value, definitions, domains }: Props) {
  // don't use loose type check values like 0 want be counted
  const attributeValuePresent =
    parameter_value?.attribute1_value ||
    parameter_value?.attribute2_value ||
    parameter_value?.attribute3_value ||
    parameter_value?.attribute4_value ||
    parameter_value?.attribute5_value

  const [selectedDefinition, setSelectedDefinition] = useState<ParameterDefinition | null>(
    attributeValuePresent ? parameter_value?.definition_id : null
  )

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    definition_id: parameter_value?.definition_id ?? '',
    parameter_code: parameter_value?.parameter_code ?? '',
    parameter_value: parameter_value?.parameter_value ?? '',
    attribute1_value: parameter_value?.attribute1_value ?? '',
    attribute2_value: parameter_value?.attribute2_value ?? '',
    attribute3_value: parameter_value?.attribute3_value ?? '',
    attribute4_value: parameter_value?.attribute4_value ?? '',
    attribute5_value: parameter_value?.attribute5_value ?? '',
    effective_start_date: parameter_value?.effective_start_date ?? '',
    effective_end_date: parameter_value?.effective_end_date ?? '',
    sort_priority: parameter_value?.sort_priority ?? '',
    notes: parameter_value?.notes ?? '',
    domain_name: parameter_value?.definition?.parameter_domain ?? '',
    _method: parameter_value != null ? 'PUT' : undefined,
  })
  console.log(parameter_value)
  const { post, errors } = useInertiaPost<typeof formData>(
    parameter_value
      ? route('parameter-value.update', parameter_value.id)
      : route('parameter-value.store'),
    {
      onComplete: () => {
        window.location.href = route('parameter-value.index')
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(formData)
  }

  useEffect(() => {
    if (formData.definition_id && definitions?.length) {
      const definition = definitions.find(
        (d: ParameterDefinition) => d.id == formData.definition_id
      )
      setSelectedDefinition(definition ?? null)
    }
  }, [formData.definition_id, definitions])

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={settingsReferenceData}
    >
      <div className='flex min-h-screen items-center justify-center bg-white dark:bg-gray-900'>
        <div className='w-3/4 rounded-xl bg-white p-8 py-8 shadow-md dark:bg-gray-800'>
          <div className='mx-auto max-w-5xl py-8'>
            {/* Heading text color adapts */}
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100'>
              {parameter_value ? 'Edit Parameter Value' : 'Create Parameter Value'}
            </h2>

            <form
              onSubmit={handleSubmit}
              className='grid grid-cols-1 gap-6 md:grid-cols-2'
            >
              <div className='col-span-2 flex flex-col gap-6'>
                <SelectList
                  label='Domain'
                  setValue={setFormValue('domain_name')}
                  value={formData.domain_name}
                  error={errors?.domain_name}
                  list={domains}
                  dataKey='domain_name'
                  displayKey='domain_name'
                />
                {formData.domain_name && (
                  <DynamicSelectList
                    label='Definition'
                    url={`/api/parameter-definitions/?domain_name=${formData.domain_name}`}
                    setValue={setFormValue('definition_id')}
                    value={formData.definition_id}
                    error={errors?.definition_id}
                    dataKey='id'
                    displayKey='parameter_name'
                  />
                )}
              </div>

              <div className='flex flex-col'>
                <Input
                  label='Parameter Code'
                  value={formData.parameter_code}
                  setValue={setFormValue('parameter_code')}
                  error={errors?.parameter_code}
                  formatter={capitalSnakeCase}
                />
              </div>

              <div className='flex flex-col'>
                <Input
                  label='Parameter Value'
                  value={formData.parameter_value}
                  setValue={setFormValue('parameter_value')}
                  error={errors?.parameter_value}
                />
              </div>

              {selectedDefinition && (
                <>
                  <div className='col-span-2 flex flex-col'>
                    <StrongText className='dark:text-gray-300'>Attribute Values</StrongText>
                  </div>

                  {selectedDefinition?.attribute1_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute1_name}
                        value={formData.attribute1_value}
                        setValue={setFormValue('attribute1_value')}
                        error={errors?.attribute1_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute2_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute2_name}
                        value={formData.attribute2_value}
                        setValue={setFormValue('attribute2_value')}
                        error={errors?.attribute2_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute3_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute3_name}
                        value={formData.attribute3_value}
                        setValue={setFormValue('attribute3_value')}
                        error={errors?.attribute3_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute4_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute4_name}
                        value={formData.attribute4_value}
                        setValue={setFormValue('attribute4_value')}
                        error={errors?.attribute4_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute5_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute5_name}
                        value={formData.attribute5_value}
                        setValue={setFormValue('attribute5_value')}
                        error={errors?.attribute5_value}
                      />
                    </div>
                  )}
                </>
              )}

              {selectedDefinition?.is_effective_date_driven && (
                <div className='flex flex-col'>
                  <DatePicker
                    label='Effective Start Date'
                    value={formData.effective_start_date}
                    setValue={setFormValue('effective_start_date')}
                    error={errors?.effective_start_date}
                  />
                </div>
              )}
              {selectedDefinition?.is_effective_date_driven && (
                <div className='flex flex-col'>
                  <DatePicker
                    label='Effective End Date'
                    value={formData.effective_end_date}
                    setValue={setFormValue('effective_end_date')}
                    error={errors?.effective_end_date}
                  />
                </div>
              )}

              <div className='flex flex-col'>
                <Input
                  label='Sort Priority'
                  type='number'
                  value={formData.sort_priority}
                  setValue={setFormValue('sort_priority')}
                  error={errors?.sort_priority}
                />
              </div>

              <div className='flex flex-col md:col-span-2'>
                <TextArea
                  label='Notes'
                  value={formData.notes}
                  setValue={setFormValue('notes')}
                  error={errors?.notes}
                />
              </div>

              <div className='col-span-full mt-4 flex justify-between gap-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => history.back()}
                  label='Cancel'
                />
                <Button
                  type='submit'
                  label='Save'
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
