import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { SystemModule } from '@/interfaces/paramater_types'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'

interface Props {
  systemModules: SystemModule[]
  setSystemModuleId: (id: number) => void
}

export default function ParameterDomainSearchForm({
  systemModules,
  setSystemModuleId,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    system_module_id: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div>
      <form
        action=''
        onSubmit={handleSubmit}
      >
        <SelectList
          list={systemModules}
          dataKey='id'
          displayKey='name'
          setValue={setFormValue('system_module_id')}
          value={formData.system_module_id}
          label='System Module'
        />
        <Button
          label='Search'
          type='submit'
        />
      </form>
    </div>
  )
}
