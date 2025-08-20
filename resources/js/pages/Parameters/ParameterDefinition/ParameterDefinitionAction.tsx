import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition } from '@/interfaces/paramater_service'
import AppLayout from '@/layouts/app-layout'
import NormalText from '@/typography/NormalText'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import { router } from '@inertiajs/react'

export default function ParameterDefinitionAction({ data }: { data: ParameterDefinition }) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: data?.name ?? '',
    attribute1: data?.attribute1 ?? '',
    attribute2: data?.attribute2 ?? '',
    attribute3: data?.attribute3 ?? '',
    attribute4: data?.attribute4 ?? '',
    attribute5: data?.attribute5 ?? '',
    isEffectiveDateDriven: data?.isEffectiveDateDriven ?? false,
    domainId: data?.domainId ?? 0,
  })

  const { post, errors } = useInertiaPost(
    data ? route('parameter-definition.update', data.id) : route('parameter-definition.store'),
    {
      onComplete: () => router.visit(route('parameter-definition.index')),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    post(data ? { ...formData, _method: 'PUT' } : formData)
  }

  return (
    <AppLayout>
      <div className='flex items-center justify-center'>
        <div className='w-3/4 items-center justify-center rounded-xl bg-white p-8 py-8 shadow-md'>
          <h2 className='mb-4 text-2xl font-bold'>
            {data ? 'Edit' : 'Create'} Parameter Definition
          </h2>
          <form onSubmit={handleSubmit}>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='col-span-2 flex flex-col'>
                <DynamicSelectList
                  url='/api/parameter-domains'
                  dataKey='id'
                  displayKey='name'
                  setValue={setFormValue('domainId')}
                  value={formData.domainId}
                  label='Parameter Domain'
                  required
                  error={errors?.domainId}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Parameter Name'
                  value={formData.name}
                  setValue={setFormValue('name')}
                  error={errors?.name}
                  required
                />
              </div>
              <div className='flex flex-col'>
                <CheckBox
                  label='Is Effective Date Driven'
                  value={formData.isEffectiveDateDriven}
                  toggleValue={toggleBoolean('isEffectiveDateDriven')}
                />
              </div>
              <div className='col-span-2'>
                <NormalText>Attributes</NormalText>
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 1'
                  value={formData.attribute1}
                  setValue={setFormValue('attribute1')}
                  error={errors?.attribute1}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 2'
                  value={formData.attribute2}
                  setValue={setFormValue('attribute2')}
                  error={errors?.attribute2}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 3'
                  value={formData.attribute3}
                  setValue={setFormValue('attribute3')}
                  error={errors?.attribute3}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 4'
                  value={formData.attribute4}
                  setValue={setFormValue('attribute4')}
                  error={errors?.attribute4}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 5'
                  value={formData.attribute5}
                  setValue={setFormValue('attribute5')}
                  error={errors?.attribute5}
                />
              </div>
            </div>
            <div className='mt-6 flex justify-between gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => window.history.back()}
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
    </AppLayout>
  )
}
