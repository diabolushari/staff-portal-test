import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, OfficeWithHierarchy } from '@/interfaces/data_interfaces'
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
import TextArea from '@/ui/form/TextArea'

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
  indicators: ParameterValues[]
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
  indicators,
}: Props) {
  console.log(indicators)
  const [subCategories, setSubCategories] = useState<ParameterValues[]>([])
  const [category, setCategory] = useState<string>('')

  const [indicatorSubSelection, setIndicatorSubSelection] = useState<Record<number, string>>({})

  const [indicatorSubOptions, setIndicatorSubOptions] = useState<Record<number, ParameterValues[]>>(
    {}
  )
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
    metering_type_id: connection?.metering_type_id ?? '',
    renewable_type_id: connection?.renewable_type_id ?? '',
    connected_date: connection?.connected_date
      ? formatDateForInput(connection?.connected_date)
      : '',
    consumer_legacy_code: connection?.consumer_legacy_code ?? '',
    power_load_kw_val: connection?.power_load_kw_val ?? '',
    light_load_kw_val: connection?.light_load_kw_val ?? '',
    othercons_flag: connection?.othercons_flag ?? false,
    _method: connection ? 'PUT' : undefined,
    power_intensive: connection?.power_intensive ?? false,
    excess_demand: connection?.excess_demand ?? false,
    no_of_main_meters: connection?.no_of_main_meters ?? '',
    remarks: connection?.remarks ?? '',
    application_no: connection?.application_no ?? '',
    indicators: indicators.map((i) => ({
      indicator_id: i.id,
      selected: false,
      sub_id: null,
    })),
    indicators_with_sub: [] as any,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    connection ? route('connections.update', connection.connection_id) : route('connections.store'),
    {
      onComplete: () => {
        router.visit(route('consumer.create'))
      },
      showErrorToast: true,
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  const toggleIndicator = async (id: number) => {
    const exists = formData.indicators.includes(id)

    // Toggle indicator ID
    setFormValue('indicators')(
      exists ? formData.indicators.filter((x: number) => x !== id) : [...formData.indicators, id]
    )

    // If unchecked → cleanup
    if (exists) {
      setIndicatorSubOptions((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })

      setIndicatorSubSelection((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
      return
    }

    // If checked → fetch subcategories
    const indicator = indicators.find((i) => i.id === id)
    if (!indicator) return

    const res = await fetch(
      `/api/parameter-values?attribute_name=attribute1Value&attribute_value=${indicator.parameter_value}`
    )

    const data: ParameterValues[] = await res.json()

    if (data.length > 0) {
      setIndicatorSubOptions((prev) => ({
        ...prev,
        [id]: data,
      }))
    }
  }

  const groupedIndicators = indicators.reduce<Record<string, ParameterValues[]>>((acc, item) => {
    const key = item.attribute2_value || 'Others'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const [adminOfficeApiData] = useFetchRecord<OfficeWithHierarchy>(
    formData.admin_office_code ? '/api/office/code/' + formData.admin_office_code : ''
  )
  const [serviceOfficeApiData] = useFetchRecord<OfficeWithHierarchy>(
    formData.service_office_code ? '/api/office/code/' + formData.service_office_code : ''
  )

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
  useEffect(() => {
    if (Number(formData?.light_load_kw_val) >= 0 && Number(formData?.power_load_kw_val) >= 0) {
      setFormValue('connected_load_kw_val')(
        Number(formData?.light_load_kw_val) + Number(formData?.power_load_kw_val)
      )
    }
  }, [formData?.light_load_kw_val, formData?.power_load_kw_val])
  const setIndicatorSubValue = (indicatorId: number, subId: string) => {
    setIndicatorSubSelection((prev) => ({
      ...prev,
      [indicatorId]: subId,
    }))

    const filtered = formData.indicators_with_sub.filter((i: any) => i.indicator_id !== indicatorId)

    setFormValue('indicators_with_sub')([...filtered, { indicator_id: indicatorId, sub_id: subId }])
  }

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
          <Input
            label='Application No'
            setValue={setFormValue('application_no')}
            value={formData.application_no}
            error={errors?.application_no}
          />
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
          <Input
            label='Number of Main Meters'
            setValue={setFormValue('no_of_main_meters')}
            value={formData.no_of_main_meters}
            error={errors?.no_of_main_meters}
            required
          />
          <div className='col-span-2'>
            <TextArea
              label='Remarks'
              setValue={setFormValue('remarks')}
              value={formData.remarks}
              error={errors?.remarks}
            />
          </div>
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
            value={formData?.connected_load_kw_val}
            error={errors?.connected_load_kw_val}
            disabled={true}
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
          <CheckBox
            label='Power Intensive'
            toggleValue={toggleBoolean('power_intensive')}
            value={formData.power_intensive}
          />
          <CheckBox
            label='Excess Demand'
            toggleValue={toggleBoolean('excess_demand')}
            value={formData.excess_demand}
          />
        </div>
      </Card>

      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Indicators</StrongText>
        </div>

        <div className='mt-6 space-y-6 p-4'>
          {Object.entries(groupedIndicators).map(([section, items]) => (
            <div key={section}>
              {/* Section Title */}
              <StrongText className='mb-3 block text-sm font-semibold text-gray-700'>
                {section}
              </StrongText>

              {/* Checkboxes */}
              <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                {items.map((indicator: ParameterValues) => {
                  const isChecked = formData.indicators.includes(indicator.id)
                  const subOptions = indicatorSubOptions[indicator.id]

                  return (
                    <div
                      key={indicator.id}
                      className='space-y-2'
                    >
                      <CheckBox
                        label={indicator.parameter_value}
                        value={isChecked}
                        toggleValue={() => toggleIndicator(indicator.id)}
                      />

                      {/* Show dropdown ONLY if subcategories exist */}
                      {isChecked && subOptions?.length > 0 && (
                        <SelectList
                          label={`${indicator.parameter_value} Type`}
                          list={subOptions}
                          dataKey='id'
                          displayKey='parameter_value'
                          value={indicatorSubSelection[indicator.id] ?? ''}
                          setValue={(val) => setIndicatorSubValue(indicator.id, val)}
                          required
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
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
