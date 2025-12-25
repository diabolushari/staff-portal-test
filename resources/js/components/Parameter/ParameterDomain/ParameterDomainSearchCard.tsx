import FilterBox from '@/components/ui/filterbox'
import useCustomForm from '@/hooks/useCustomForm'
import { SystemModule } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'

interface Props {
  search?: string
  filters?: Record<string, string | number>
  systemModules: SystemModule[]
}

export default function ParameterDomainSearchCard({
  search,
  filters,
  systemModules,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    module_id: filters?.module_id ?? '',
    search: search ? search : (filters?.search ?? ''),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('parameter-domain.index'), formData)
  }

  const handleFilter = () => {
    router.get(route('parameter-domain.index'), formData)
  }

  const selectedModule = systemModules.find(
    (module) => String(module.id) === String(formData.module_id)
  )

  return (
    <div className='relative grid grid-cols-8 rounded-2xl bg-white p-6 shadow-sm'>
      <div className='pointer-events-none absolute inset-0 grid grid-cols-8'>
        <div className='col-span-2 ml-6 h-2/3 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%' />
        <div className='col-span-5' />
        <div className='col-span-1 h-1/2 self-end rounded-tl-full bg-radial-[at_1%_1%] from-[#0078D4]/30 to-[#0078D4]/5 to-90%' />
      </div>

      <div className='col-span-4 flex flex-col gap-4 p-6'>
        <form
          onSubmit={handleSubmit}
          className='w-full'
        >
          <div className='flex items-center justify-between gap-5'>
            <div>
              <Input
                label=''
                setValue={setFormValue('search')}
                value={formData.search}
                showClearButton
                placeholder='Find Parameter Domains'
                style='google'
                className='w-full'
              />
            </div>
            <div>
              <Button
                label='Search'
                type='submit'
              />
            </div>
          </div>
        </form>

        <div className='flex flex-wrap gap-2'>
          {formData.module_id && selectedModule && (
            <FilterBox
              label='System Module'
              value={selectedModule?.name}
              onRemove={() =>
                router.get(route('parameter-domain.index'), {
                  search: formData.search,
                })
              }
            />
          )}
        </div>

        <div className='mt-auto mr-auto'>
          <Button
            onClick={() => router.get(route('parameter-domain.index'))}
            label='Clear filters'
            variant='link'
          />
        </div>
      </div>

      <div className='relative col-span-4 flex justify-end pt-4'>
        <div className='border-kseb-line w-full rounded border bg-white p-5 shadow-sm'>
          <div className='flex flex-col gap-4'>
            <span className='context-subtitle'>Filters</span>

            <SelectList
              list={systemModules}
              dataKey='id'
              displayKey='name'
              setValue={setFormValue('module_id')}
              value={formData.module_id}
              label=''
              showAllOption
              allOptionText='All Modules'
            />

            <div className='ml-auto pt-2'>
              <Button
                label='Apply Filters'
                onClick={handleFilter}
                variant='tertiary'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
