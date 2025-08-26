import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Office } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import ComboBox from '@/ui/form/ComboBox'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import StrongText from '@/typography/StrongText'
import { route } from 'ziggy-js'
import { useState } from 'react'
import { Card } from '../ui/card'

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
  primaryPurposes: ParameterValues[]
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
  primaryPurposes,
}: Props) {
  const [adminOfficeData, setAdminOfficeData] = useState<Office | null>(null)
  const [serviceOfficeData, setServiceOfficeData] = useState<Office | null>(null)

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    connection_type_id: connection?.connection_type_id ?? '',
    connection_status_id: connection?.connection_status_id ?? '',
    consumer_number: connection?.consumer_number ?? '',
    voltage_type_id: connection?.voltage_type_id ?? '',
    tariff_type_id: connection?.tariff_type_id ?? '',
    connection_category_id: connection?.connection_category_id ?? '',
    connection_subcategory_id: connection?.connection_subcategory_id ?? '',
    billing_process_id: connection?.billing_process_id ?? '',
    phase_type_id: connection?.phase_type_id ?? '',
    primary_purpose_id: connection?.primary_purpose_id ?? '',
    admin_office_id: connection?.admin_office_id ?? '',
    service_office_id: connection?.service_office_id ?? '',
    contract_demand_kw_val: connection?.contract_demand_kw_val ?? '',
    connected_load_kw_val: connection?.connected_load_kw_val ?? '',
    solar_indicator: connection?.solar_indicator ?? false,
    multi_source_indicator: connection?.multi_source_indicator ?? false,
    live_indicator: connection?.live_indicator ?? false,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(route('connections.store'))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const handleAdminOfficeChange = (item: Office | null) => {
    setFormValue('admin_office_id')(item?.office_code ?? '')
    setAdminOfficeData(item)
  }

  const handleServiceOfficeChange = (item: Office | null) => {
    setFormValue('service_office_id')(item?.office_code ?? '')
    setServiceOfficeData(item)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-6'
    >
      {/* Basic Information */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <SelectList
            label='Connection Type'
            list={connectionTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connection_type_id')}
            value={formData.connection_type_id}
            error={errors?.connection_type_id}
            required
          />
          <SelectList
            label='Connection Status'
            list={connectionStatus}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connection_status_id')}
            value={formData.connection_status_id}
            error={errors?.connection_status_id}
            required
          />
          <Input
            label='Consumer Number'
            value={formData.consumer_number}
            setValue={setFormValue('consumer_number')}
            placeholder='Enter 13 digit unique consumer number'
            error={errors?.consumer_number}
            required
            type='number'
          />
          <SelectList
            label='Voltage Type'
            list={voltageTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('voltage_type_id')}
            value={formData.voltage_type_id}
            error={errors?.voltage_type_id}
            required
          />
          <SelectList
            label='Tariff Type'
            list={tariffTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('tariff_type_id')}
            value={formData.tariff_type_id}
            error={errors?.tariff_type_id}
            required
          />
        </div>
      </Card>

      {/* Categorization */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Categorization</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <SelectList
            label='Connection Category'
            list={connectionCategory}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connection_category_id')}
            value={formData.connection_category_id}
            error={errors?.connection_category_id}
            required
          />
          <SelectList
            label='Connection Subcategory'
            list={connectionSubCategory}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connection_subcategory_id')}
            value={formData.connection_subcategory_id}
            error={errors?.connection_subcategory_id}
            required
          />
          <SelectList
            label='Billing Process'
            list={billingProcesses}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('billing_process_id')}
            value={formData.billing_process_id}
            error={errors?.billing_process_id}
            required
          />
          <SelectList
            label='Phase Type'
            list={phaseTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('phase_type_id')}
            value={formData.phase_type_id}
            error={errors?.phase_type_id}
            required
          />
          <SelectList
            label='Primary Purpose'
            list={primaryPurposes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('primary_purpose_id')}
            value={formData.primary_purpose_id}
            error={errors?.primary_purpose_id}
            required
          />
        </div>
      </Card>

      {/* Managed Offices */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Managed Offices</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <ComboBox
            label='Admin Office'
            url={`/api/offices?sortPriority=3&q=`}
            setValue={handleAdminOfficeChange}
            value={adminOfficeData}
            placeholder='Select Admin Office'
            dataKey='office_id'
            displayKey='office_name'
            displayValue2='office_code'
            error={errors?.admin_office_id}
          />
          <ComboBox
            label='Service Office'
            url={`/api/offices?sortPriority=3&q=`}
            setValue={handleServiceOfficeChange}
            value={serviceOfficeData}
            placeholder='Select Service Office'
            dataKey='office_id'
            displayKey='office_name'
            displayValue2='office_code'
            error={errors?.service_office_id}
          />
        </div>
      </Card>

      {/* Load & Capacity */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Load & Capacity</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <Input
            label='Contract Demand (kW)'
            setValue={setFormValue('contract_demand_kw_val')}
            value={formData.contract_demand_kw_val}
            error={errors?.contract_demand_kw_val}
            required
          />
          <Input
            label='Connected Load (kW)'
            setValue={setFormValue('connected_load_kw_val')}
            value={formData.connected_load_kw_val}
            error={errors?.connected_load_kw_val}
            required
          />
        </div>
      </Card>

      {/* Indicators */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Indicators</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-4 p-4 md:grid-cols-3'>
          <CheckBox
            label='Solar Indicator'
            toggleValue={toggleBoolean('solar_indicator')}
            value={formData.solar_indicator}
          />
          <CheckBox
            label='Multi Source Indicator'
            toggleValue={toggleBoolean('multi_source_indicator')}
            value={formData.multi_source_indicator}
          />
          <CheckBox
            label='Live Indicator'
            toggleValue={toggleBoolean('live_indicator')}
            value={formData.live_indicator}
          />
        </div>
      </Card>

      {/* Submit */}
      <div className='flex justify-end'>
        <Button
          label='Submit'
          type='submit'
          disabled={loading}
          variant='primary'
        />
      </div>
    </form>
  )
}
