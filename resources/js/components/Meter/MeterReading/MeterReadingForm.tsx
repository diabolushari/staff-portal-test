import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import RadioGroup from '@/ui/form/RadioGroup'
import TextArea from '@/ui/form/TextArea'

export default function MeterReadingForm() {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    normal_pf: '',
    peak_pf: '',
    offpeak_pf: '',
    average_power_factor: '',
    reading_type: '',
    anomaly: '',
    metering_date: '',
    reading_start_date: '',
    reading_end_date: '',
    meter_health_id: '',
    ctpt_health_id: '',
    voltage_r: '',
    voltage_b: '',
    voltage_y: '',
    current_r: '',
    current_b: '',
    current_y: '',
    remarks: '',
  })
  return (
    <Card className='rounded-lg p-7'>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Meter Reading Details
        </StrongText>
      </div>
      <hr className='mb-6 border-[#e5e9eb]' />
      <form className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Input
            label='Normal PF'
            value={formData.normal_pf}
            setValue={setFormValue('normal_pf')}
          />
          <Input
            label='Peak PF'
            value={formData.peak_pf}
            setValue={setFormValue('peak_pf')}
          />
          <Input
            label='Offpeak PF'
            value={formData.offpeak_pf}
            setValue={setFormValue('offpeak_pf')}
          />
          <Input
            label='Average Power Factor'
            value={formData.average_power_factor}
            setValue={setFormValue('average_power_factor')}
          />
          <RadioGroup
            label='Reading Type'
            list={[
              { id: 'single_reading', label: 'Single Reading' },
              { id: 'multiple_reading', label: 'Multiple Reading' },
            ]}
            dataKey='id'
            displayKey='label'
            setValue={setFormValue('reading_type')}
            value={formData.reading_type}
          />

          <TextArea
            label='Anomaly'
            value={formData.anomaly}
            setValue={setFormValue('anomaly')}
          />
          <DatePicker
            label='Metering Date'
            value={formData.metering_date}
            setValue={setFormValue('metering_date')}
          />
          <DatePicker
            label='Reading Start Date'
            value={formData.reading_start_date}
            setValue={setFormValue('reading_start_date')}
          />
          <DatePicker
            label='Reading End Date'
            value={formData.reading_end_date}
            setValue={setFormValue('reading_end_date')}
          />
          <Input
            label='Meter Health'
            value={formData.meter_health_id}
            setValue={setFormValue('meter_health_id')}
          />
          <Input
            label='CTPT Health'
            value={formData.ctpt_health_id}
            setValue={setFormValue('ctpt_health_id')}
          />
          <TextArea
            label='Remarks'
            value={formData.remarks}
            setValue={setFormValue('remarks')}
          />
          <Input
            label='Voltage R'
            value={formData.voltage_r}
            setValue={setFormValue('voltage_r')}
          />
          <Input
            label='Voltage B'
            value={formData.voltage_b}
            setValue={setFormValue('voltage_b')}
          />
          <Input
            label='Voltage Y'
            value={formData.voltage_y}
            setValue={setFormValue('voltage_y')}
          />
          <Input
            label='Current R'
            value={formData.current_r}
            setValue={setFormValue('current_r')}
          />
          <Input
            label='Current B'
            value={formData.current_b}
            setValue={setFormValue('current_b')}
          />
          <Input
            label='Current Y'
            value={formData.current_y}
            setValue={setFormValue('current_y')}
          />
        </div>
        <div className='flex justify-end'>
          <Button
            label='Submit'
            type='submit'
          />
        </div>
      </form>
    </Card>
  )
}
