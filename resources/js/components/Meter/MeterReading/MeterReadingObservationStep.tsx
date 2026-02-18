import { ParameterValues } from '@/interfaces/parameter_types'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { MeterHealth } from './ReadingForm/useMeterHealthForm'
import NormalText from '@/typography/NormalText'
import { MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'

interface Props {
  formData: any
  setFormValue: any
  anomalyTypes: ParameterValues[]
  errors?: any
  meterHealthData: MeterHealth[]
  updateRybValues: (
    meterId: number,
    value: number,
    type: 'voltage_r' | 'voltage_y' | 'voltage_b' | 'current_r' | 'current_y' | 'current_b'
  ) => void
}

export default function MeterReadingObservationStep({
  formData,
  setFormValue,
  anomalyTypes,
  errors,
  meterHealthData,
  updateRybValues,
}: Props) {
  const filteredMeterHealthData = meterHealthData.filter((meter) =>
    formData.meters.includes(meter.meter_id)
  )

  return (
    <>
      <div className='flex w-full flex-col gap-4'>
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

        {filteredMeterHealthData.map((meter) => (
          <div className='border p-4'>
            <NormalText>Meter #{meter.meter_serial}</NormalText>
            <div className='grid gap-4 md:grid-cols-3'>
              <Input
                key={meter.meter_id}
                label='Voltage R (kV)'
                value={meter.voltage_r}
                setValue={(value) => updateRybValues(meter.meter_id, value, 'voltage_r')}
                type='number'
                error={errors?.voltage_r}
              />
              <Input
                label='Voltage Y (kV)'
                value={meter.voltage_y}
                setValue={(value) => updateRybValues(meter.meter_id, value, 'voltage_y')}
                type='number'
                error={errors?.voltage_y}
              />
              <Input
                label='Voltage B (kV)'
                value={meter.voltage_b}
                setValue={(value) => updateRybValues(meter.meter_id, value, 'voltage_b')}
                type='number'
                error={errors?.voltage_b}
              />

              <Input
                label='Current R (A)'
                value={meter.current_r}
                setValue={(value) => updateRybValues(meter.meter_id, value, 'current_r')}
                type='number'
                error={errors?.current_r}
              />
              <Input
                label='Current Y (A)'
                value={meter.current_y}
                setValue={(value) => updateRybValues(meter.meter_id, value, 'current_y')}
                type='number'
                error={errors?.current_y}
              />
              <Input
                label='Current B (A)'
                value={meter.current_b}
                setValue={(value) => updateRybValues(meter.meter_id, value, 'current_b')}
                type='number'
                error={errors?.current_b}
              />
            </div>
          </div>
        ))}

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
