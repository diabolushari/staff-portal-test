import { ParameterValues } from '@/interfaces/parameter_types'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import RadioGroup from '@/ui/form/RadioGroup'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'

interface Props {
  formData: any
  setFormValue: any
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
}

export default function MeterReadingObservationStep({
  formData,
  setFormValue,
  meterHealthTypes,
  ctptHealthTypes,
  anomalyTypes,
}: Props) {
  return (
    <>
      <div className='w-full'>
        <div className='grid gap-4 md:grid-cols-2'>
          <SelectList
            label='Meter Health'
            list={meterHealthTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('meter_health_id')}
            value={formData.meter_health_id}
          />
          <SelectList
            label='CTPT Health'
            list={ctptHealthTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('ctpt_health_id')}
            value={formData.ctpt_health_id}
          />
          <SelectList
            label='Anomaly'
            list={anomalyTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('anomaly_id')}
            value={formData.anomaly_id}
          />
        </div>
        <div className='grid gap-4 md:grid-cols-3'>
          <Input
            label='Voltage R'
            value={formData.voltage_r}
            setValue={setFormValue('voltage_r')}
            type='number'
          />
          <Input
            label='Voltage B'
            value={formData.voltage_b}
            setValue={setFormValue('voltage_b')}
            type='number'
          />
          <Input
            label='Voltage Y'
            value={formData.voltage_y}
            setValue={setFormValue('voltage_y')}
            type='number'
          />
          <Input
            label='Current R'
            value={formData.current_r}
            setValue={setFormValue('current_r')}
            type='number'
          />
          <Input
            label='Current B'
            value={formData.current_b}
            setValue={setFormValue('current_b')}
            type='number'
          />
          <Input
            label='Current Y'
            value={formData.current_y}
            setValue={setFormValue('current_y')}
            type='number'
          />
        </div>
        <TextArea
          label='Remarks'
          value={formData.remarks}
          setValue={setFormValue('remarks')}
        />
      </div>
    </>
  )
}
