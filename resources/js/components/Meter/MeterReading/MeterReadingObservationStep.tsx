import { ParameterValues } from '@/interfaces/parameter_types'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'

interface Props {
  formData: any
  setFormValue: any
  anomalyTypes: ParameterValues[]
  errors?: any
}

export default function MeterReadingObservationStep({
  formData,
  setFormValue,
  anomalyTypes,
  errors,
}: Props) {
  return (
    <>
      <div className='w-full'>
        <div className='grid gap-4 md:grid-cols-2'>
          <SelectList
            label='Anomaly'
            list={anomalyTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('anomaly_id')}
            value={formData.anomaly_id}
            error={errors?.anomaly_id}
          />
        </div>
        <div className='grid gap-4 md:grid-cols-3'>
          <Input
            label='Voltage R'
            value={formData.voltage_r}
            setValue={setFormValue('voltage_r')}
            type='number'
            error={errors?.voltage_r}
          />
          <Input
            label='Voltage Y'
            value={formData.voltage_y}
            setValue={setFormValue('voltage_y')}
            type='number'
            error={errors?.voltage_y}
          />
          <Input
            label='Voltage B'
            value={formData.voltage_b}
            setValue={setFormValue('voltage_b')}
            type='number'
            error={errors?.voltage_b}
          />

          <Input
            label='Current R'
            value={formData.current_r}
            setValue={setFormValue('current_r')}
            type='number'
            error={errors?.current_r}
          />
          <Input
            label='Current Y'
            value={formData.current_y}
            setValue={setFormValue('current_y')}
            type='number'
            error={errors?.current_y}
          />
          <Input
            label='Current B'
            value={formData.current_b}
            setValue={setFormValue('current_b')}
            type='number'
            error={errors?.current_b}
          />
        </div>
        <TextArea
          label='Remarks'
          value={formData.remarks}
          setValue={setFormValue('remarks')}
          error={errors?.remarks}
        />
      </div>
    </>
  )
}
