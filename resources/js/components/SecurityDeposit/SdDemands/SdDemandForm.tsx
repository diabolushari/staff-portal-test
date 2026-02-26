import { Button } from '@/components/ui/button'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import CheckBox from '@/ui/form/CheckBox'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'

interface Props {
  demandTypes: ParameterValues[]
  calculationBasics: ParameterValues[]
  sdDemand?: SdDemand
  connection: Connection
}

const SdDemandForm = ({ demandTypes, calculationBasics, sdDemand, connection }: Props) => {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    connection_id: connection.connection_id,
    demand_type_id: sdDemand?.demand_type_id ?? '',
    calculation_basic_id: sdDemand?.calculation_basic_id ?? '',
    total_sd_amount: sdDemand?.total_sd_amount ?? '',
    applicable_from: sdDemand?.applicable_from ?? '',
    applicable_to: sdDemand?.applicable_to ?? '',
    is_active: sdDemand?.is_active ?? true,
    _method: sdDemand ? 'PUT' : undefined,
  })

  const url = sdDemand
    ? route('sd-demands.update', {
        sd_demand: sdDemand.sd_demand_id,
      })
    : route('sd-demands.store')

  const { post, loading, errors } = useInertiaPost<typeof formData>(url, {
    showErrorToast: true,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-4'>
          <SelectList
            label='Demand Type'
            list={demandTypes}
            value={formData.demand_type_id}
            setValue={setFormValue('demand_type_id')}
            dataKey='id'
            displayKey='parameter_value'
            error={errors.demand_type_id}
            required
            placeholder='Select Demand Type'
          />
          <Input
            type='number'
            label='Total SD Amount'
            value={formData.total_sd_amount}
            setValue={setFormValue('total_sd_amount')}
            error={errors?.total_sd_amount}
            placeholder='Enter Total SD Amount'
            required
          />
          <SelectList
            label='Calculation Basic'
            list={calculationBasics}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('calculation_basic_id')}
            value={formData.calculation_basic_id}
            error={errors?.calculation_basic_id}
            placeholder='Select Calculation Basic'
          />

          <Datepicker
            value={formData.applicable_from}
            setValue={setFormValue('applicable_from')}
            label='Applicable From'
            error={errors?.applicable_from}
            placeholder='Select Applicable From'
            required
          />
          <Datepicker
            value={formData.applicable_to}
            setValue={setFormValue('applicable_to')}
            label='Applicable To'
            error={errors?.applicable_to}
            placeholder='Select Applicable To'
          />

          <CheckBox
            label='Is Active'
            value={formData.is_active}
            toggleValue={toggleBoolean('is_active')}
            error={errors?.is_active}
          />
        </div>
        <div className='flex justify-end'>
          <Button
            variant={'default'}
            type='submit'
            disabled={loading}
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SdDemandForm
