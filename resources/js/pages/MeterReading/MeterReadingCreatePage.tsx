import MeterReadingGeneralStep from '@/components/Meter/MeterReading/MeterReadingGeneralStep'
import MeterReadingObservationStep from '@/components/Meter/MeterReading/MeterReadingObservationStep'
import MeterReadingsStep from '@/components/Meter/MeterReading/MeterReadingsStep'
import { consumerNavItems } from '@/components/Navbar/navitems'
import Stepper from '@/components/Stepper'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ConsumerData, MeterReading } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import { useEffect, useState } from 'react'

interface Props {
  connectionWithConsumer: ConsumerData
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  metersWithTimezonesAndProfiles: any[]
  latestMeterReading: MeterReading
  editMode: boolean
}
function transformToFormData(
  values: any[],
  metersWithTimezonesAndProfiles: any[],
  editMode: boolean
) {
  // Group readings by meter

  const groupedByMeter = metersWithTimezonesAndProfiles.map((meter) => {
    const meterReadings = values.filter((v) => v.meter_id === meter.meter_id)

    const parameters = meter.meter_profile.map((profile: any) => {
      const parameterReadings = meterReadings.filter(
        (r) => r.parameter_id === profile.meter_parameter_id
      )

      const readings = meter.timezones.map((tz: any) => {
        const match = parameterReadings.find((r) => r.timezone_id === tz.timezone_id)
        return {
          timezone_id: tz.timezone_id,
          timezone_name: tz.timezone_name,
          values: {
            initial: editMode ? (match?.initial_reading ?? 0) : match?.final_reading,
            final: editMode ? match?.final_reading : '',
            diff: editMode ? match?.difference : '0',
          },
        }
      })

      return {
        meter_parameter_id: profile.meter_parameter_id,
        display_name: profile.display_name,
        readings,
      }
    })

    return {
      meter_id: meter.meter_id,
      parameters,
    }
  })

  return groupedByMeter
}

const getNextDay = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0] // format YYYY-MM-DD
}
const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Get last day of current month
const getMonthEnd = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 0-based index
  const lastDay = new Date(year, month, +1) // 0th day of next month = last day of current
  return lastDay.toISOString().split('T')[0]
}

export default function MeterReadingCreatePage({
  connectionWithConsumer,
  meterHealthTypes,
  ctptHealthTypes,
  ctHealthTypes,
  ptHealthTypes,
  anomalyTypes,
  metersWithTimezonesAndProfiles,
  latestMeterReading,
  editMode,
}: Readonly<Props>) {
  console.log(metersWithTimezonesAndProfiles)

  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Connections',
      href: '/connections',
    },
    {
      title: connectionWithConsumer?.connection?.consumer_number,
      href: `/connection/${connectionWithConsumer?.connection?.connection_id}`,
    },
    {
      title: 'Meter Reading',
      href: `/connection/${connectionWithConsumer?.connection?.connection_id}/meter-reading`,
    },
    {
      title: 'Create',
      href: `/connection/${connectionWithConsumer?.connection?.connection_id}/meter-reading/create`,
    },
  ]
  const { formData, setFormValue } = useCustomForm({
    id: editMode ? latestMeterReading?.id : '',
    connection_id: connectionWithConsumer?.connection?.connection_id,
    metering_date: getToday(),
    reading_start_date: getNextDay(latestMeterReading?.reading_end_date) ?? '',
    reading_end_date: editMode
      ? latestMeterReading?.reading_end_date
      : (getMonthEnd(getNextDay(latestMeterReading?.reading_end_date)) ?? ''),
    reading_type: editMode ? latestMeterReading?.reading_type : '',
    meter_health_id: editMode ? latestMeterReading?.meter_health_id : '',
    faulty_date: editMode ? latestMeterReading?.faulty_date : '',
    ctpt_health_id: editMode ? latestMeterReading?.ctpt_health_id : '',
    anomaly_id: editMode ? latestMeterReading?.anomaly_id : '',
    ct_health_id: editMode ? latestMeterReading?.ct_health_id : '',
    pt_health_id: editMode ? latestMeterReading?.pt_health_id : '',
    voltage_r: editMode ? latestMeterReading?.voltage_r : '',
    voltage_y: editMode ? latestMeterReading?.voltage_y : '',
    voltage_b: editMode ? latestMeterReading?.voltage_b : '',
    current_r: editMode ? latestMeterReading?.current_r : '',
    current_y: editMode ? latestMeterReading?.current_y : '',
    current_b: editMode ? latestMeterReading?.current_b : '',
    remarks: editMode ? latestMeterReading?.remarks : '',
    readings_by_meter: [],
    _method: editMode ? 'PUT' : undefined,
  })
  const { post, errors } = useInertiaPost(
    editMode ? route('meter-reading.update', formData.id) : route('meter-reading.store'),
    {
      showErrorToast: true,
    }
  )

  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    // If already initialized, skip
    if (formData.readings_by_meter?.length > 0) return

    if (latestMeterReading?.values?.length > 0) {
      const transformed = transformToFormData(
        latestMeterReading.values,
        metersWithTimezonesAndProfiles,
        editMode
      )

      setFormValue('readings_by_meter')(transformed)
    } else {
      // Normal initialization (as in your existing code)
      const initializedMeters = metersWithTimezonesAndProfiles.map((meter) => ({
        meter_id: meter.meter_id,
        parameters: meter.meter_profile.map((profile: any) => ({
          meter_parameter_id: profile.meter_parameter_id,
          display_name: profile.display_name,
          readings: meter.timezones.map((tz: any) => ({
            timezone_id: tz.timezone_id,
            timezone_name: tz.timezone_name,
            values: { initial: 0, final: '', diff: '' },
          })),
        })),
      }))
      setFormValue('readings_by_meter')(initializedMeters)
    }
  }, [latestMeterReading, metersWithTimezonesAndProfiles])

  // Check if a step has any errors
  const hasStepError = (fields: string[]) => fields.some((f) => errors?.[f])
  const getFirstErrorStep = () => {
    if (hasStepError(['metering_date', 'reading_start_date', 'reading_end_date', 'reading_type']))
      return 0
    if (hasStepError(['meter_health_id', 'ctpt_health_id', 'anomaly_id'])) return 1
    // last step (readings) we don't force navigation
    return activeStep
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement | null>, multipleReading = false) => {
    e?.preventDefault()

    post({
      ...formData,
      multiple_reading: multipleReading,
    })
  }

  const steps = [
    {
      id: 1,
      title: 'General',
      status: hasStepError([
        'metering_date',
        'reading_start_date',
        'reading_end_date',
        'reading_type',
      ])
        ? 'error'
        : 'default',
      cardTitle: 'General',
      content: (
        <MeterReadingGeneralStep
          connectionWithConsumer={connectionWithConsumer}
          formData={formData}
          setFormValue={setFormValue}
          errors={errors}
          latestMeterReading={latestMeterReading}
        />
      ),
    },
    {
      id: 2,
      title: 'Observations',
      status: hasStepError([
        'meter_health_id',
        'ctpt_health_id',
        'anomaly_id',
        'ct_health_id',
        'pt_health_id',
        'faulty_date',
      ])
        ? 'error'
        : 'default',
      cardTitle: `Observations for ${connectionWithConsumer?.consumer?.organization_name}`,
      cardSubtitle: `${formData.reading_start_date} to ${formData.reading_end_date}`,
      content: (
        <MeterReadingObservationStep
          formData={formData}
          setFormValue={setFormValue}
          meterHealthTypes={meterHealthTypes}
          ctptHealthTypes={ctptHealthTypes}
          anomalyTypes={anomalyTypes}
          errors={errors}
          ctHealthTypes={ctHealthTypes}
          ptHealthTypes={ptHealthTypes}
          connectionType={connectionWithConsumer.connection.connection_type}
        />
      ),
    },
    {
      id: 3,
      title: 'Readings',
      status: 'default',
      cardTitle: `Readings for ${connectionWithConsumer?.consumer?.organization_name}`,
      cardSubtitle: `${formData.reading_start_date} to ${formData.reading_end_date}`,
      content: (
        <MeterReadingsStep
          metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
          formData={formData}
          setFormValue={setFormValue}
          latestMeterReading={latestMeterReading}
        />
      ),
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={consumerNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        <form onSubmit={handleSubmit}>
          <Stepper
            activeStep={activeStep}
            onStepChange={setActiveStep}
            steps={steps}
          />

          <div className='mt-6 flex justify-between'>
            {activeStep >= 0 && (
              <Button
                type='button'
                variant='outline'
                onClick={() => setActiveStep(activeStep - 1)}
                label='Back'
                disabled={activeStep === 0}
              />
            )}

            {activeStep < steps.length - 1 && (
              <Button
                type='button'
                onClick={() => setActiveStep(activeStep + 1)}
                label='Next'
              />
            )}
            {formData.reading_type === 'multiple_reading' && activeStep === steps.length - 1 && (
              <Button
                type='button'
                label='Save & Add New Reading'
                variant='link'
                onClick={() => handleSubmit(null, true)}
              />
            )}

            {activeStep === steps.length - 1 && (
              <>
                <Button
                  type='submit'
                  label='Submit'
                />
              </>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
