import { ParameterValues } from '@/interfaces/parameter_types'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { useEffect, useState } from 'react'

interface Props {
  formData: any
  setFormValue: any
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  errors?: any
  connectionType: ParameterValues
}

export default function MeterReadingObservationStep({
  formData,
  setFormValue,
  meterHealthTypes,
  ctptHealthTypes,
  ctHealthTypes,
  ptHealthTypes,
  anomalyTypes,
  errors,
  connectionType,
}: Props) {
  const [faultyDateField, setFaultyDateField] = useState(false)

  useEffect(() => {
    const status = meterHealthTypes.find((item) => item.id == Number(formData.meter_health_id))

    setFaultyDateField(status?.parameter_value === 'Not Working')
  }, [formData.meter_health_id, meterHealthTypes])

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
            error={errors?.meter_health_id}
          />
          {faultyDateField && (
            <DatePicker
              label='Faulty Date'
              setValue={setFormValue('faulty_date')}
              value={formData.faulty_date}
              error={errors?.faulty_date}
              required={faultyDateField}
            />
          )}
          {connectionType?.parameter_value === 'HT' && (
            <SelectList
              label='CTPT Health'
              list={ctptHealthTypes}
              dataKey='id'
              displayKey='parameter_value'
              setValue={setFormValue('ctpt_health_id')}
              value={formData.ctpt_health_id}
              error={errors?.ctpt_health_id}
            />
          )}
          {connectionType?.parameter_value === 'LT' && (
            <>
              <SelectList
                label='CT Health'
                list={ctHealthTypes}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('ct_health_id')}
                value={formData.ct_health_id}
                error={errors?.ct_health_id}
              />
              <SelectList
                label='PT Health'
                list={ptHealthTypes}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('pt_health_id')}
                value={formData.pt_health_id}
                error={errors?.pt_health_id}
              />
            </>
          )}
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
