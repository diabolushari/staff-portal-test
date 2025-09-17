import useCustomForm from '@/hooks/useCustomForm'
import { ParameterDomain, SystemModule } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'

interface Props {
  parameterDomains: ParameterDomain[]
  systemModules: SystemModule[]
  filters: {
    search: string
    domain_name: string
    module_name: string
  }
}

export default function ParameterDefinitionSearchForm({
  parameterDomains,
  systemModules,
  filters,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    domain_name: filters.domain_name ?? '',
    module_name: filters.module_name ?? '',
    search: filters.search ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('parameter-definition.index', formData))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='grid w-2/3 items-end gap-2 md:grid-cols-3'>
          <div>
            {systemModules && (
              <SelectList
                list={systemModules}
                dataKey='name'
                displayKey='name'
                setValue={setFormValue('module_name')}
                value={formData.module_name}
                label='System Module'
                showAllOption
                allOptionText='All Modules'
              />
            )}
          </div>
          <div className='flex flex-col'>
            {parameterDomains && (
              <SelectList
                list={parameterDomains}
                dataKey='domain_name'
                displayKey='domain_name'
                setValue={setFormValue('domain_name')}
                value={formData.domain_name}
                label='Parameter Domain'
                showAllOption
                allOptionText='All Domains'
              />
            )}
          </div>

          <div className='flex flex-col'>
            <Input
              label='Search'
              value={formData.search}
              setValue={setFormValue('search')}
              showClearButton={true}
            />
          </div>

          <div className='flex flex-col'>
            <Button
              label='Search'
              type='submit'
            />
          </div>
        </div>
      </form>
    </div>
  )
}
