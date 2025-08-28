import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import Input from '@/ui/form/Input'
import useCustomForm from '@/hooks/useCustomForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import SelectList from '@/ui/form/SelectList'

interface Props {
  consumer_types: ParameterValues[]
}

export default function ConsumerFormComponent({ consumer_types }: Props) {
  const { formData, setFormValue } = useCustomForm({
    connection_id: '',
    consumer_type_id: '',
  })
  return (
    <form className='flex flex-col gap-6'>
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <Input
              label='Connection id'
              setValue={() => {}}
              value=''
              disabled
              style='disabled'
            />
            <SelectList
              label='Consumer Type'
              list={consumer_types}
              dataKey='id'
              displayKey='parameter_value'
              setValue={setFormValue('consumer_type_id')}
              value={formData.consumer_type_id}
              required
            />
          </div>
        </div>
      </Card>
    </form>
  )
}
