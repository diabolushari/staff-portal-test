import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, Office, OfficeWithHierarchy } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import ComboBox from '@/ui/form/ComboBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { route } from 'ziggy-js'
import { Card } from '../ui/card'

interface Props {
  connection?: Connection
  connectionTypes: ParameterValues[]
  connectionStatus: ParameterValues[]
  voltageTypes: ParameterValues[]
  tariffTypes: ParameterValues[]
  connectionCategory: ParameterValues[]
  billingProcesses: ParameterValues[]
  phaseTypes: ParameterValues[]
  primaryPurposes: ParameterValues[]
  openAccessTypes: ParameterValues[]
  meteringTypes: ParameterValues[]
  renewableTypes: ParameterValues[]
}
const formatDateForInput = (date?: string | Date) => {
  if (!date) return ''
  const d = new Date(date)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  const year = d.getFullYear()
  return `${year}-${month}-${day}`
}

export default function ConnectionForm({
  connection,
  connectionTypes,
  connectionStatus,
  voltageTypes,
  tariffTypes,
  connectionCategory,
  billingProcesses,
  phaseTypes,
  primaryPurposes,
  openAccessTypes,
  meteringTypes,
  renewableTypes,
}: Readonly<Props>) {
  const [adminOfficeData, setAdminOfficeData] = useState<Office | null>(null)
  const [serviceOfficeData, setServiceOfficeData] = useState<Office | null>(null)
  const [subCategories, setSubCategories] = useState<ParameterValues[]>([])
  const [category, setCategory] = useState<string>('')

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    connection_type_id: connection?.connection_type_id ?? '',
    connection_status_id: connection?.connection_status_id ?? '',
    consumer_number: connection?.consumer_number ?? '',
    voltage_type_id: connection?.voltage_id ?? '',
    tariff_type_id: connection?.tariff_id ?? '',
    connection_category_id: connection?.connection_category_id ?? '',
    connection_subcategory_id: connection?.connection_subcategory_id ?? '',
    billing_process_id: connection?.billing_process_id ?? '',
    phase_type_id: connection?.phase_type_id ?? '',
    primary_purpose_id: connection?.primary_purpose_id ?? '',
    admin_office_code: connection?.admin_office_code ?? '',
    service_office_code: connection?.service_office_code ?? '',
    contract_demand_kw_val: connection?.contract_demand_kva_val ?? '',
    connected_load_kw_val: connection?.connected_load_kw_val ?? '',
    solar_indicator: connection?.solar_indicator ?? false,
    multi_source_indicator: connection?.multi_source_indicator ?? false,
    live_indicator: connection?.live_indicator ?? false,
    open_access_type_id: connection?.open_access_type_id ?? '',
    metering_type_id: connection?.metering_type_id ?? '',
    renewable_type_id: connection?.renewable_type_id ?? '',
    connected_date: connection?.connected_date
      ? formatDateForInput(connection?.connected_date)
      : '',
    consumer_legacy_code: connection?.consumer_legacy_code ?? '',
    open_access_selected: connection?.open_access_type_id ? true : false,
    renewable_selected: connection?.renewable_type_id ? true : false,
    power_load_kw_val: connection?.power_load_kw_val ?? '',
    light_load_kw_val: connection?.light_load_kw_val ?? '',
    othercons_flag: connection?.othercons_flag ?? false,
    cpp_flag: connection?.cpp_flag ?? false,
    _method: connection ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    connection ? route('connections.update', connection.connection_id) : route('connections.store'),
    {
      onComplete: () => {
        router.visit(route('consumer.create'))
      },
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const [adminOfficeApiData] = useFetchRecord<OfficeWithHierarchy>(
    formData.admin_office_code ? '/api/office/code/' + formData.admin_office_code : ''
  )
  const [serviceOfficeApiData] = useFetchRecord<OfficeWithHierarchy>(
    formData.service_office_code ? '/api/office/code/' + formData.service_office_code : ''
  )

  useEffect(() => {
    if (adminOfficeApiData?.office) {
      setAdminOfficeData(adminOfficeApiData.office)
    }
    if (serviceOfficeApiData?.office) {
      setServiceOfficeData(serviceOfficeApiData.office)
    }
  }, [adminOfficeApiData, serviceOfficeApiData])
  const handleConnectionCategoryChange = (parameterValueId: string) => {
    setFormValue('connection_category_id')(parameterValueId)
    const category = connectionCategory.find((item) => item.id === Number(parameterValueId))
    setCategory(category?.parameter_value ?? '')
  }

  const [subCategoryData] = useFetchRecord<ParameterValues[]>(
    '/api/parameter-values?attribute_name=attribute1Value&attribute_value=' + category
  )

  useEffect(() => {
    if (subCategoryData) {
      setSubCategories(subCategoryData)
    }
  }, [subCategoryData])
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-6'
    >
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
            disabled={connection?.connection_id ? true : false}
          />
          <Input
            label='Consumer Legacy Code'
            setValue={setFormValue('consumer_legacy_code')}
            value={formData.consumer_legacy_code}
            error={errors?.consumer_legacy_code}
          />
          <SelectList
            label='Connection Status'
            list={connectionStatus}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connection_status_id')}
            value={formData.connection_status_id}
            error={errors?.connection_status_id}
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
          <DatePicker
            label='Connection Date'
            setValue={setFormValue('connected_date')}
            value={formData.connected_date}
            error={errors?.connected_date}
            required
          />
        </div>
      </Card>
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Managed Offices</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <ComboBox
            label='Admin Office'
            url={`/api/offices?sortPriority=3&q=`}
            setValue={(office) => setFormValue('admin_office_code')(office?.office_code ?? '')}
            value={adminOfficeApiData?.office ?? null}
            placeholder='Select Admin Office'
            dataKey='office_code'
            displayKey='office_name'
            displayValue2='office_code'
            error={errors?.admin_office_code}
          />

          <ComboBox
            label='Service Office'
            url={`/api/offices?sortPriority=3&q=`}
            setValue={(office) => setFormValue('service_office_code')(office?.office_code ?? '')}
            value={serviceOfficeApiData?.office ?? null}
            placeholder='Select Service Office'
            dataKey='office_code'
            displayKey='office_name'
            displayValue2='office_code'
            error={errors?.service_office_code}
            disabled={connection?.service_office_code ? true : false}
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
            setValue={handleConnectionCategoryChange}
            value={formData.connection_category_id}
            error={errors?.connection_category_id}
            required
          />
          {subCategories && formData.connection_category_id && (
            <SelectList
              label='Connection Subcategory'
              list={subCategories}
              dataKey='id'
              displayKey='parameter_value'
              setValue={setFormValue('connection_subcategory_id')}
              value={formData.connection_subcategory_id}
              error={errors?.connection_subcategory_id}
              required
            />
          )}
          <SelectList
            label='Metering Type'
            list={meteringTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('metering_type_id')}
            value={formData.metering_type_id}
            error={errors?.metering_type_id}
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
          />
          <Input
            label='Connected Load (kW)'
            setValue={setFormValue('connected_load_kw_val')}
            value={formData.connected_load_kw_val}
            error={errors?.connected_load_kw_val}
          />
          <Input
            label='Power Load (kW)'
            setValue={setFormValue('power_load_kw_val')}
            value={formData.power_load_kw_val}
            error={errors?.power_load_kw_val}
          />
          <Input
            label='Light Load (kW)'
            setValue={setFormValue('light_load_kw_val')}
            value={formData.light_load_kw_val}
            error={errors?.light_load_kw_val}
          />
        </div>
      </Card>

      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Additional Information</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <div className='flex flex-col gap-4'>
            <CheckBox
              label='Open Access'
              toggleValue={toggleBoolean('open_access_selected')}
              value={formData.open_access_selected}
            />
            {formData.open_access_selected && (
              <SelectList
                label='Open Access Type'
                list={openAccessTypes}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('open_access_type_id')}
                value={formData.open_access_type_id}
                error={errors?.open_access_type_id}
                required
              />
            )}
          </div>
          <div>
            <CheckBox
              label='Renewable'
              toggleValue={toggleBoolean('renewable_selected')}
              value={formData.renewable_selected}
            />
            {formData.renewable_selected && (
              <SelectList
                label='Renewable Type'
                list={renewableTypes}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('renewable_type_id')}
                value={formData.renewable_type_id}
                error={errors?.renewable_type_id}
                required
              />
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Indicators</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-4 p-4 md:grid-cols-3'>
          <CheckBox
            label='Solar Indicator'
            toggleValue={toggleBoolean('solar_indicator')}
            value={formData.solar_indicator}
            error={errors?.solar_indicator}
          />
          <CheckBox
            label='Multi Source Indicator'
            toggleValue={toggleBoolean('multi_source_indicator')}
            value={formData.multi_source_indicator}
            error={errors?.multi_source_indicator}
          />
          <CheckBox
            label='Live Indicator'
            toggleValue={toggleBoolean('live_indicator')}
            value={formData.live_indicator}
            error={errors?.live_indicator}
          />
          <CheckBox
            label='Other Cons'
            toggleValue={toggleBoolean('othercons_flag')}
            value={formData.othercons_flag}
            error={errors?.othercons_flag}
          />
          <CheckBox
            label='CPP'
            toggleValue={toggleBoolean('cpp_flag')}
            value={formData.cpp_flag}
            error={errors?.cpp_flag}
          />
        </div>
      </Card>

      {/* Submit */}
      <div className='flex justify-end'>
        <Button
          label='Submit'
          type='submit'
          disabled={loading}
          processing={loading}
          variant={loading ? 'loading' : 'primary'}
        />
      </div>
    </form>
  )
}
