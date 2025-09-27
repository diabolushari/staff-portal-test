import Field from '@/components/ui/field'
import { ConsumerData } from '@/interfaces/consumers'
import StrongText from '@/typography/StrongText'
import { Tooltip } from '@radix-ui/react-tooltip'
import { ConnectionDetailTooltip } from './ConnectionDetailTooltip'
import DatePicker from '@/ui/form/DatePicker'
import useCustomForm from '@/hooks/useCustomForm'
import RadioGroup from '@/ui/form/RadioGroup'

interface Props {
  connectionWithConsumer: ConsumerData
  formData: any
  setFormValue: any
  errors?: any
}

export default function MeterReadingGeneralStep({
  connectionWithConsumer,
  formData,
  setFormValue,
  errors,
}: Props) {
  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Organization Name: {connectionWithConsumer?.consumer?.organization_name}
        </StrongText>
      </div>
      <hr className='mb-6 border-[#e5e9eb]' />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Field
          label='Tariff'
          value={connectionWithConsumer?.connection?.tariff?.parameter_value}
        />
        <Field
          label='Purpose'
          value={connectionWithConsumer?.connection?.primary_purpose?.parameter_value}
        />
        <ConnectionDetailTooltip connectionWithConsumer={connectionWithConsumer} />

        <div className='col-span-3'>
          <div className='grid gap-4 md:grid-cols-2'>
            <DatePicker
              label='Metering Date'
              value={formData.metering_date}
              setValue={setFormValue('metering_date')}
              error={errors?.metering_date}
            />
            <DatePicker
              label='Reading Start Date'
              value={formData.reading_start_date}
              setValue={setFormValue('reading_start_date')}
              error={errors?.reading_start_date}
            />
            <DatePicker
              label='Reading End Date'
              value={formData.reading_end_date}
              setValue={setFormValue('reading_end_date')}
              error={errors?.reading_end_date}
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
              error={errors?.reading_type}
            />
          </div>
        </div>
      </div>
    </>
  )
}
