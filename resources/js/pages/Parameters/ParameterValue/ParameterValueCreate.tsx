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
import { ParameterDefinition, ParameterValues } from '@/interfaces/paramater_service'

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
export default function ParameterValueCreate({ data }: { data?: ParameterValues }) {
  const attributeValuePresent =
    data?.attribute1Value ||
    data?.attribute2Value ||
    data?.attribute3Value ||
    data?.attribute4Value ||
    data?.attribute5Value
  const [selectedDefinition, setSelectedDefinition] = useState<ParameterDefinition | null>(
    attributeValuePresent ? data?.definitionId : null
  )
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    definitionId: data?.definitionId ?? '',
    parameterCode: data?.parameterCode ?? '',
    parameterValue: data?.parameterValue ?? '',
    attribute1Value: data?.attribute1Value ?? '',
    attribute2Value: data?.attribute2Value ?? '',
    attribute3Value: data?.attribute3Value ?? '',
    attribute4Value: data?.attribute4Value ?? '',
    attribute5Value: data?.attribute5Value ?? '',
    effectiveStartDate: data?.effectiveStartDate ?? '',
    effectiveEndDate: data?.effectiveEndDate ?? '',
    sortPriority: data?.sortPriority ?? '',
    notes: data?.notes ?? '',
  })

  const { post, errors } = useInertiaPost(
    data ? route('parameter-value.update', data.id) : route('parameter-value.store'),
    {
      onComplete: () => {
        window.location.href = route('parameter-value.index')
      },
    }
  )
  const [definitions] = useFetchRecord<ParameterDefinition[]>(`/api/parameter-definitions`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(data ? { ...formData, _method: 'PUT' } : formData)
  }

  useEffect(() => {
    if (formData.definitionId && definitions?.length) {
      const definition = definitions.find((d: ParameterDefinition) => d.id == formData.definitionId)
      setSelectedDefinition(definition ?? null)
    }
  }, [formData.definitionId, definitions])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='flex min-h-screen items-center justify-center bg-white dark:bg-gray-900'>
        <div className='w-3/4 rounded-xl bg-white p-8 py-8 shadow-md dark:bg-gray-800'>
          <div className='mx-auto max-w-5xl py-8'>
            {/* Heading text color adapts */}
            <h2 className='mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100'>
              {data ? 'Edit Parameter Value' : 'Create Parameter Value'}
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
                  setValue={setFormValue('definitionId')}
                  value={formData.definitionId}
                  error={errors?.definition_id}
                />
              </div>

              <div className='flex flex-col'>
                <Input
                  label='Parameter Code'
                  value={formData.parameterCode}
                  setValue={setFormValue('parameterCode')}
                  error={errors?.parameter_code}
                  formatter={capitalSnakeCase}
                />
              </div>

              <div className='flex flex-col'>
                <Input
                  label='Parameter Value'
                  value={formData.parameterValue}
                  setValue={setFormValue('parameterValue')}
                  error={errors?.parameter_value}
                />
              </div>

              {selectedDefinition && (
                <>
                  <div className='col-span-2 flex flex-col'>
                    <StrongText className='dark:text-gray-300'>Attribute Values</StrongText>
                  </div>

                  {selectedDefinition?.attribute1 && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute1}
                        value={formData.attribute1Value}
                        setValue={setFormValue('attribute1Value')}
                        error={errors?.attribute1_value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute2 && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute2}
                        value={formData.attribute2Value}
                        setValue={setFormValue('attribute2Value')}
                        error={errors?.attribute2Value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute3 && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute3}
                        value={formData.attribute3Value}
                        setValue={setFormValue('attribute3Value')}
                        error={errors?.attribute3Value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute4 && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute4}
                        value={formData.attribute4Value}
                        setValue={setFormValue('attribute4Value')}
                        error={errors?.attribute4Value}
                      />
                    </div>
                  )}
                  {selectedDefinition?.attribute5 && (
                    <div className='flex flex-col'>
                      <Input
                        label={selectedDefinition.attribute5}
                        value={formData.attribute5Value}
                        setValue={setFormValue('attribute5Value')}
                        error={errors?.attribute5Value}
                      />
                    </div>
                  )}
                </>
              )}

              {selectedDefinition?.isEffectiveDateDriven && (
                <div className='flex flex-col'>
                  <Input
                    label='Effective Start Date'
                    type='date'
                    value={formData.effectiveStartDate}
                    setValue={setFormValue('effectiveStartDate')}
                    error={errors?.effectiveStartDate}
                  />
                </div>
              )}
              {selectedDefinition?.isEffectiveDateDriven && (
                <div className='flex flex-col'>
                  <Input
                    label='Effective End Date'
                    type='date'
                    value={formData.effectiveEndDate}
                    setValue={setFormValue('effectiveEndDate')}
                    error={errors?.effectiveEndDate}
                  />
                </div>
              )}

              <div className='flex flex-col'>
                <Input
                  label='Sort Priority'
                  type='number'
                  value={formData.sortPriority}
                  setValue={setFormValue('sortPriority')}
                  error={errors?.sortPriority}
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
