import capitalSnakeCase from '@/formaters/capitalcase'
import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import useInertiaPost from '@/hooks/useInertiaPost'
import AppLayout from '@/layouts/app-layout'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import { BreadcrumbItem } from '@/types'
import { useEffect, useState } from 'react'
import { ParameterDefinition, ParameterValues } from '@/interfaces/paramater_types'
import DatePicker from '@/ui/form/DatePicker'

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
export default function ParameterValueCreate({
  parameter_value,
}: {
  parameter_value?: ParameterValues
}) {
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
    attribute_1_value: parameter_value?.attribute1_value ?? '',
    attribute_2_value: parameter_value?.attribute2_value ?? '',
    attribute_3_value: parameter_value?.attribute3_value ?? '',
    attribute_4_value: parameter_value?.attribute4_value ?? '',
    attribute_5_value: parameter_value?.attribute5_value ?? '',
    effective_start_date: parameter_value?.effective_start_date ?? '',
    effective_end_date: parameter_value?.effective_end_date ?? '',
    sort_priority: parameter_value?.sort_priority ?? '',
    notes: parameter_value?.notes ?? '',
  })

  const { post, errors } = useInertiaPost(
    parameter_value
      ? route('parameter-value.update', parameter_value.id)
      : route('parameter-value.store'),
    {
      onComplete: () => {
        window.location.href = route('parameter-value.index')
      },
    }
  )
  const [definitions] = useFetchRecord<ParameterDefinition[]>(`/api/parameter-definitions`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(parameter_value ? { ...formData, _method: 'PUT' } : formData)
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
    <AppLayout breadcrumbs={breadcrumbs}>
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
              <div className='col-span-2 flex flex-col'>
                <DynamicSelectList
                  url='/api/parameter-definitions'
                  dataKey='id'
                  displayKey='parameterName'
                  label='Definition'
                  setValue={setFormValue('definition_id')}
                  value={formData.definition_id}
                  error={errors?.definition_id}
                />
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
                        value={formData.attribute_1_value}
                        setValue={setFormValue('attribute_1_value')}
                        error={errors?.attribute_1_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute2_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute2_name}
                        value={formData.attribute_2_value}
                        setValue={setFormValue('attribute_2_value')}
                        error={errors?.attribute_2_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute3_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute3_name}
                        value={formData.attribute_3_value}
                        setValue={setFormValue('attribute_3_value')}
                        error={errors?.attribute_3_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute4_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute4_name}
                        value={formData.attribute_4_value}
                        setValue={setFormValue('attribute_4_value')}
                        error={errors?.attribute_4_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute5_name && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute5_name}
                        value={formData.attribute_5_value}
                        setValue={setFormValue('attribute_5_value')}
                        error={errors?.attribute_5_value}
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
    </AppLayout>
  )
}
