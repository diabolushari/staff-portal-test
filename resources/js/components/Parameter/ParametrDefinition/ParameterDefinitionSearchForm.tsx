import useCustomForm from '@/hooks/useCustomForm'
import { ParameterDomain } from '@/interfaces/paramater_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'

interface Props {
  parameterDomains: ParameterDomain[]
  filters: {
    search: string
    domain_name: string
  }
}

export default function ParameterDefinitionSearchForm({
  parameterDomains,
  filters,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    domain_name: filters.domain_name ?? '',
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
