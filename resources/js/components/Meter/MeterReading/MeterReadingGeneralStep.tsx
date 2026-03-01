import Field from '@/components/ui/field'
import { ConsumerData, MeterReadingValueGroup } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { ConnectionDetailTooltip } from './ConnectionDetailTooltip'
import dayjs from 'dayjs'
import Datepicker from '@/ui/form/DatePicker'
import { ParameterValues } from '@/interfaces/parameter_types'
import SelectList from '@/ui/form/SelectList'
import CheckBox from '@/ui/form/CheckBox'
import { getDisplayDate } from '@/utils'
import { useEffect, useState } from 'react'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import Button from '@/ui/button/Button'
import axios from 'axios'
import { handleHttpErrors } from '@/ui/alerts'

interface Props {
  connectionWithConsumer: ConsumerData
  formData: MeterReadingForm
  setFormValue: <K extends keyof MeterReadingForm>(key: K) => (value: MeterReadingForm[K]) => void
  toggleBoolean: (key: keyof MeterReadingForm) => () => void
  errors?: Record<string, string | undefined>
  latestMeterReadings?: MeterReadingValueGroup[]
  isFirstReading?: boolean
  interimReasons: ParameterValues[]
}

interface MeterRow {
  meterId: number
  meterSerial: string
  latestMeterReadingDate: string | null
  checked: boolean
}

export default function MeterReadingGeneralStep({
  connectionWithConsumer,
  formData,
  setFormValue,
  toggleBoolean,
  errors,
  latestMeterReadings,
  isFirstReading,
  interimReasons,
}: Props) {
  const maxDate = dayjs().format('DD-MM-YYYY')
  const maxDateForReadingStartDate = dayjs(maxDate).subtract(1, 'day').format('DD-MM-YYYY')
  const [openDateField, setOpenDateField] = useState(true)
  const [meterRows, setMeterRows] = useState<MeterRow[]>([])

  const getLastReadingDate = (latestMeterReadingDate: string | null): string => {
    if (!latestMeterReadingDate) {
      return '-'
    }

    return getDisplayDate(latestMeterReadingDate)
  }

  const handleMeterSelection = (meterId: number): void => {
    setMeterRows((previousMeterRows) => {
      return previousMeterRows.map((meterRow) => {
        if (meterRow.meterId !== meterId) {
          return meterRow
        }

        return {
          ...meterRow,
          checked: !meterRow.checked,
        }
      })
    })
  }

  const handleValidate = async (): Promise<void> => {
    try {
      const selectedMeterIds = meterRows
        .filter((meterRow) => meterRow.checked)
        .map((meterRow) => meterRow.meterId)

      const response = await axios.post('/api/connections/period-details', {
        connection_id: formData.connection_id,
        meter_ids: selectedMeterIds,
        start_date: formData.reading_start_date ?? null,
        end_date: formData.reading_end_date ?? null,
      })

      console.log('Period details response:', response.data)
    } catch (error) {
      handleHttpErrors(error)
    }
  }

  useEffect(() => {
    if (isFirstReading) {
      setOpenDateField(true)
      return
    }
  }, [isFirstReading])

  useEffect(() => {
    const availableRows =
      latestMeterReadings
        ?.filter((latestMeterReading) => latestMeterReading?.meter != null)
        .map((latestMeterReading) => ({
          meterId: latestMeterReading.meter.meter_id,
          meterSerial: latestMeterReading.meter.meter_serial,
          latestMeterReadingDate: latestMeterReading?.reading?.reading_end_date ?? null,
        })) ?? []

    setMeterRows((previousMeterRows) => {
      if (availableRows.length === 0) {
        return []
      }

      const previousCheckedMap = new Map(
        previousMeterRows.map((meterRow) => [meterRow.meterId, meterRow.checked])
      )

      return availableRows.map((meterRow) => ({
        ...meterRow,
        checked: previousCheckedMap.get(meterRow.meterId) ?? true,
      }))
    })
  }, [latestMeterReadings])

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Organization: {connectionWithConsumer?.consumer?.organization_name}
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
            <CheckBox
              label='Interim Reading'
              toggleValue={toggleBoolean('is_interim_reading')}
              value={formData.is_interim_reading}
              error={errors?.is_interim_reading}
            />
            <CheckBox
              label='Use For Billing'
              toggleValue={toggleBoolean('is_billable')}
              value={formData.is_billable}
              error={errors?.is_billable}
            />
            {formData.is_interim_reading && (
              <SelectList
                label='Interim Reason'
                list={interimReasons}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('interim_reason_id')}
                value={formData?.interim_reason_id}
                error={errors?.interim_reason_id}
              />
            )}

            <div className='col-span-2'>
              <div className='mb-2 text-sm font-medium text-[#252c32]'>Meters</div>
              <div className='grid gap-3'>
                {meterRows?.map((meterRow) => {
                  return (
                    <label
                      key={meterRow.meterId}
                      className='flex cursor-pointer items-start gap-3 rounded-lg border border-[#e5e9eb] p-3'
                    >
                      <input
                        type='checkbox'
                        checked={meterRow.checked}
                        onChange={() => handleMeterSelection(meterRow.meterId)}
                        className='mt-1 h-4 w-4'
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-[#252c32]'>
                          Meter Serial: {meterRow.meterSerial}
                        </span>
                        <span className='text-xs text-[#5f6d79]'>
                          Last Reading Date: {getLastReadingDate(meterRow.latestMeterReadingDate)}
                        </span>
                      </div>
                    </label>
                  )
                })}

                {(!meterRows || meterRows.length === 0) && (
                  <div className='rounded-lg border border-dashed border-[#d8dde0] p-3 text-sm text-[#5f6d79]'>
                    No meters available
                  </div>
                )}
              </div>
            </div>

            <div className='col-span-2 grid md:grid-cols-2'>
              <Datepicker
                label='Meter Reading Date'
                value={formData?.metering_date}
                setValue={setFormValue('metering_date')}
                error={errors?.metering_date}
                max={maxDate}
              />
            </div>

            {openDateField && (
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
                disabled={!isFirstReading}
                max={maxDateForReadingStartDate}
              />
            )}
            {openDateField && (
              <Datepicker
                label='Billing Period End'
                value={formData.reading_end_date}
                setValue={setFormValue('reading_end_date')}
                error={errors?.reading_end_date}
                max={maxDate}
                disabled={!isFirstReading && !formData.is_interim_reading}
              />
            )}

            <div className='col-span-2 flex justify-end'>
              <Button
                type='button'
                label='Validate'
                onClick={handleValidate}
                variant='secondary'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
