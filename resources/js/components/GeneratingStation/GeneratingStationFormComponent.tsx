import { Button } from '@/components/ui/button'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import ComboBox from '@/ui/form/ComboBox'
import { useEffect, useMemo, useState } from 'react'
import { Connection, GeneratingStationAttribute, RegionOption } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import GeneratingStationAttributeForm from './GeneratingStationAttributeForm'
import DynamicAttributeForm from '@/ui/form/DynamicAttributeForm'

interface Props {
  districts: RegionOption[]
  states: RegionOption[]
  generationStatus: ParameterValues[]
  generationTypes: ParameterValues[]
  voltageCategories: ParameterValues[]
  plantTypes: ParameterValues[]
}

const GeneratingStationForm = ({
  districts,
  states,
  generationStatus,
  generationTypes,
  voltageCategories,
  plantTypes,
}: Props) => {
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)

  const { formData, setFormValue } = useCustomForm({
    connection_id: '',

    station_name: '',
    generation_status_id: '',
    installed_capacity: '',
    generation_type_id: '',
    voltage_category_id: '',
    plant_type_id: '',
    commissioning_date: '',
    address_line1: '',
    address_line2: '',
    city_town_village: '',
    pincode: '',
    district_id: '',
    state_id: '',
    is_current: true,
    attributeData: [],
  })

  const [selectedGenerationType, setSelectedGenerationType] = useState<ParameterValues | null>(null)

  const [attributeData, setAttributeData] = useState<GeneratingStationAttribute[] | null>(null)

  const url = route('generating-stations.store')

  const { post, loading, errors } = useInertiaPost<typeof formData>(url, {
    showErrorToast: true,
  })

  const customFormData = useMemo(() => {
    return {
      ...formData,
      connection_id: selectedConnection?.connection_id,
      attributeData: attributeData?.map((attr) => ({
        attribute_definition_id: attr.attribute_definition_id,
        attribute_value: attr.attribute_value,
      })),
    }
  }, [formData, selectedConnection, attributeData])

  useEffect(() => {
    if (!formData.generation_type_id) return

    const selected = generationTypes.find((g) => g.id == Number(formData.generation_type_id))

    setSelectedGenerationType(selected ?? null)
  }, [formData.generation_type_id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(customFormData)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-4 py-4'>
          {/* Connection ComboBox */}
          <ComboBox
            label='Connection'
            url={`/api/consumer-number?q=`}
            setValue={setSelectedConnection}
            value={selectedConnection}
            dataKey='connection_id'
            displayKey='consumer_number'
            displayValue2='consumer_legacy_code'
            placeholder='Search Connection'
          />

          <Input
            label='Station Name'
            value={formData.station_name}
            setValue={setFormValue('station_name')}
            error={errors.station_name}
            required
          />

          <SelectList
            label='Generation Type'
            list={generationTypes}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.generation_type_id}
            setValue={setFormValue('generation_type_id')}
            error={errors.generation_type_id}
            required
          />
        </div>
        <DynamicAttributeForm
          selectedValue={selectedGenerationType}
          domainName='Station'
          parameterName='Generating Station Attribute'
          foreignKeyName='station_id'
          foreignKeyValue={null}
          attributeData={attributeData}
          setAttributeData={setAttributeData}
        />
        <div className='grid grid-cols-2 gap-4 py-4'>
          <SelectList
            label='Voltage Category'
            list={voltageCategories}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.voltage_category_id}
            setValue={setFormValue('voltage_category_id')}
            error={errors.voltage_category_id}
            required
          />

          <SelectList
            label='Plant Type'
            list={plantTypes}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.plant_type_id}
            setValue={setFormValue('plant_type_id')}
            error={errors.plant_type_id}
            required
          />
          <SelectList
            label='Generation Status'
            list={generationStatus}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.generation_status_id}
            setValue={setFormValue('generation_status_id')}
            error={errors.generation_status_id}
            required
          />
          <Input
            type='number'
            label='Installed Capacity'
            value={formData.installed_capacity}
            setValue={setFormValue('installed_capacity')}
            error={errors.installed_capacity}
            required
          />

          <Datepicker
            label='Commissioning Date'
            value={formData.commissioning_date}
            setValue={setFormValue('commissioning_date')}
            error={errors.commissioning_date}
            placeholder='Select Commissioning Date'
            required
          />

          <div className='col-span-2 mt-4'>
            <h3 className='border-b pb-1 text-lg font-semibold'>Address Details</h3>
          </div>

          <Input
            label='Address Line 1'
            value={formData.address_line1}
            setValue={setFormValue('address_line1')}
            error={errors.address_line1}
            required
          />

          <Input
            label='Address Line 2'
            value={formData.address_line2}
            setValue={setFormValue('address_line2')}
            error={errors.address_line2}
          />

          <Input
            label='City / Town / Village'
            value={formData.city_town_village}
            setValue={setFormValue('city_town_village')}
            error={errors.city_town_village}
            required
          />

          <Input
            label='Pincode'
            type='number'
            value={formData.pincode}
            setValue={setFormValue('pincode')}
            error={errors.pincode}
            required
          />
          <SelectList
            label='District'
            list={districts}
            dataKey='region_id'
            displayKey='region_name'
            value={formData.district_id}
            setValue={setFormValue('district_id')}
          />

          <SelectList
            label='State'
            list={states}
            dataKey='region_id'
            displayKey='region_name'
            value={formData.state_id}
            setValue={setFormValue('state_id')}
          />
        </div>

        <div className='mt-4 flex justify-end'>
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

export default GeneratingStationForm
