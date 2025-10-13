import { useState } from 'react'
import MainLayout from '@/layouts/main-layout'
import Stepper from '@/components/Stepper'
import MeterReadingGeneralStep from '@/components/Meter/MeterReading/MeterReadingGeneralStep'
import MeterReadingObservationStep from '@/components/Meter/MeterReading/MeterReadingObservationStep'
import MeterReadingsStep from '@/components/Meter/MeterReading/MeterReadingsStep'
import { consumerNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { BreadcrumbItem } from '@/types'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'

interface Props {
  connectionWithConsumer: any
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  metersWithTimezonesAndProfiles: any[]
  latestMeterReading: any
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
}: Readonly<Props>) {
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
    connection_id: connectionWithConsumer?.connection?.connection_id,
    metering_date: getToday(),
    reading_start_date: getNextDay(latestMeterReading?.reading_end_date) ?? '',
    reading_end_date: getMonthEnd(getNextDay(latestMeterReading?.reading_end_date)) ?? '',
    reading_type: '',
    meter_health_id: '',
    faulty_date: '',
    ctpt_health_id: '',
    anomaly_id: '',
    ct_health_id: '',
    pt_health_id: '',
    readings_by_meter: [],
  })
  const { post, errors } = useInertiaPost(route('meter-reading.store'))

  const [activeStep, setActiveStep] = useState(0)
  const [saveAndAddNewReading, setSaveAndAddNewReading] = useState(false)

  const carryForwardInitialReadings = (latestMeterReading: any, setFormValue: any) => {
    if (!latestMeterReading?.values) return

    setFormValue('readings_by_meter', (prev: any[]) => {
      return prev.map((reading) => {
        // find matching parameter + timezone in the old values
        const prevValue = latestMeterReading.values.find(
          (v: any) =>
            v.parameter_id === reading.parameter_id && v.timezone_id === reading.timezone_id
        )

        if (prevValue) {
          return {
            ...reading,
            initial_reading: prevValue.final_reading, // carry forward
          }
        }

        return reading
      })
    })
  }

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
