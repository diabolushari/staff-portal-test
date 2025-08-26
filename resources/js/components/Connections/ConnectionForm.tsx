import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'

interface Props {
  connection?: any
  connectionTypes: ParameterValues[]
  connectionStatus: ParameterValues[]
  voltageTypes: ParameterValues[]
  tariffTypes: ParameterValues[]
  connectionCategory: ParameterValues[]
  connectionSubCategory: ParameterValues[]
  billingProcesses: ParameterValues[]
  phaseTypes: ParameterValues[]
}
export default function ConnectionForm({
  connection,
  connectionTypes,
  connectionStatus,
  voltageTypes,
  tariffTypes,
  connectionCategory,
  connectionSubCategory,
  billingProcesses,
  phaseTypes,
}: Props) {
  const { formData, setFormValue } = useCustomForm({
    connectionType: connection?.connectionType?.id ?? '',
    connectionStatus: connection?.connectionStatus?.id ?? '',
    consumerNumber: connection?.consumerNumber ?? '',
    voltageType: connection?.voltageType?.id ?? '',
    tariffType: connection?.tariffType?.id ?? '',
    connectionCategory: connection?.connectionCategory?.id ?? '',
    connectionSubCategory: connection?.connectionSubCategory?.id ?? '',
    billingProcess: connection?.billingProcess?.id ?? '',
    phaseType: connection?.phaseType?.id ?? '',
  })
  const { post } = useInertiaPost(route('connections.store'))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='flex grid-cols-2 gap-2 gap-4 md:grid'>
          <SelectList
            label='Connection Type'
            list={connectionTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connectionType')}
            value={formData.connectionType}
            required={true}
          />
          <SelectList
            label='Connection Status'
            list={connectionStatus}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connectionStatus')}
            value={formData.connectionStatus}
            required={true}
          />
          <Input
            label='Consumer Number'
            value={formData.consumerNumber}
            setValue={setFormValue('consumerNumber')}
            placeholder='Enter 13 digit unique consumer number'
            required={true}
            type='number'
          />
          <SelectList
            label='Voltage type'
            list={voltageTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('voltageType')}
            value={formData.voltageType}
            required={true}
          />
          <SelectList
            label='Tariff type'
            list={tariffTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('tariffType')}
            value={formData.tariffType}
            required={true}
          />
          <SelectList
            label='Connection Category'
            list={connectionCategory}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connectionCategory')}
            value={formData.connectionCategory}
            required={true}
          />
          <SelectList
            label='Connection Subcategory'
            list={connectionSubCategory}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connectionSubCategory')}
            value={formData.connectionSubCategory}
            required={true}
          />
          <SelectList
            label='Billing Process'
            list={billingProcesses}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('billingProcess')}
            value={formData.billingProcess}
            required={true}
          />
          <SelectList
            label='Phase Type'
            list={phaseTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('phaseType')}
            value={formData.phaseType}
            required={true}
          />
        </div>
      </form>
    </div>
  )
}
