import Field from '@/components/ui/field'
import { ConsumerData, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import RadioGroup from '@/ui/form/RadioGroup'
import { ConnectionDetailTooltip } from './ConnectionDetailTooltip'
import dayjs from 'dayjs'
import Datepicker from '@/ui/form/DatePicker'
import { ParameterValues } from '@/interfaces/parameter_types'
import SelectList from '@/ui/form/SelectList'
import MultiSelectList from '@/ui/form/MultiSelect'

interface Props {
  connectionWithConsumer: ConsumerData
  formData: any
  setFormValue: any
  errors?: any
  latestMeterReading?: any
  isFirstReading?: boolean
  isInterimReading?: boolean
  interimReasons: ParameterValues[]
  metersListForInterimReading: MeterWithTimezoneAndProfile[]
}

export default function MeterReadingGeneralStep({
  connectionWithConsumer,
  formData,
  setFormValue,
  errors,
  latestMeterReading,
  isFirstReading,
  isInterimReading,
  interimReasons,
  metersListForInterimReading,
}: Props) {
  const maxDate = dayjs().format('DD-MM-YYYY')
  const maxDateForReadingStartDate = dayjs(maxDate).subtract(1, 'day').format('DD-MM-YYYY')

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Organization: {connectionWithConsumer?.consumer?.organization_name}
        </StrongText>
        <RadioGroup
          label='Reading Type'
          list={[
            { id: 'single_reading', label: 'Single Reading' },
            { id: 'interim_reading', label: 'Interim Reading' },
          ]}
          dataKey='id'
          displayKey='label'
          setValue={setFormValue('reading_type')}
          value={formData.reading_type}
          error={errors?.reading_type}
        />
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
            {isInterimReading && (
              <SelectList
                label='Interim Reason'
                list={interimReasons}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('interim_reason')}
                value={formData?.interim_reason}
                error={errors?.interim_reason}
              />
            )}
            {isInterimReading && (
              <MultiSelectList
                label='Meters'
                list={metersListForInterimReading}
                dataKey='meter_id'
                displayKey='meter_serial'
                setValue={setFormValue('meters')}
                value={formData?.meters}
                error={errors?.meters}
              />
            )}

            <div className='col-span-2 grid md:grid-cols-2'>
              <Datepicker
                label='Meter Reading Date'
                value={formData?.metering_date}
                setValue={setFormValue('metering_date')}
                error={errors?.metering_date}
                max={maxDate}
              />
            </div>

            <Datepicker
              label='Billing Period Start'
              value={formData.reading_start_date}
              setValue={(value) => {
                setFormValue('reading_start_date')(value)
                if (isFirstReading) {
                  setFormValue('reading_end_date')(value)
                }
              }}
              error={errors?.reading_start_date}
              disabled={latestMeterReading?.reading_end_date}
              max={maxDateForReadingStartDate}
            />
            <Datepicker
              label='Billing Period End'
              value={formData.reading_end_date}
              setValue={setFormValue('reading_end_date')}
              error={errors?.reading_end_date}
              max={maxDate}
              disabled={!isFirstReading && !isInterimReading}
            />
          </div>
        </div>
      </div>
    </>
  )
}
