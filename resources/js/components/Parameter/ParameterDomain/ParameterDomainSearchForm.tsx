import useCustomForm from '@/hooks/useCustomForm'
import { SystemModule } from '@/interfaces/paramater_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'

interface Props {
  systemModules: SystemModule[]
  filters: {
    search: string
    module_id: number
  }
}

export default function ParameterDomainSearchForm({ systemModules, filters }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    module_id: filters.module_id ?? 0,
    search: filters.search ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('parameter-domain.index', formData))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='grid w-2/3 items-end gap-2 md:grid-cols-3'>
          {/* System Module */}
          <div className='relative flex flex-col'>
            <SelectList
              list={systemModules}
              dataKey='id'
              displayKey='name'
              setValue={setFormValue('module_id')}
              value={formData.module_id}
              label='System Module'
            />
            {formData.module_id !== 0 && (
              <button
                type='button'
                onClick={() => setFormValue('module_id')(0)}
                className='absolute top-8 right-2 text-xs text-gray-500 hover:text-red-500'
              >
                ✕
              </button>
            )}
          </div>

          {/* Search */}
          <div className='relative flex flex-col'>
            <Input
              label='Search'
              value={formData.search}
              setValue={setFormValue('search')}
            />
            {formData.search && (
              <button
                type='button'
                onClick={() => setFormValue('search')('')}
                className='absolute top-8 right-2 text-xs text-gray-500 hover:text-red-500'
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Button */}
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
