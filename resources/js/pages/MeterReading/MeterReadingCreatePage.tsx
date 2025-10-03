import { useState } from 'react'
import MainLayout from '@/layouts/main-layout'
import Stepper from '@/components/Stepper'
import MeterReadingGeneralStep from '@/components/Meter/MeterReading/MeterReadingGeneralStep'
import MeterReadingObservationStep from '@/components/Meter/MeterReading/MeterReadingObservationStep'
import MeterReadingsStep from '@/components/Meter/MeterReading/MeterReadingsStep'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { BreadcrumbItem } from '@/types'
import { ParameterValues } from '@/interfaces/parameter_types'

interface Props {
  connectionWithConsumer: any
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  metersWithTimezonesAndProfiles: any[]
  latestMeterReading: any
}

export default function MeterReadingCreatePage({
  connectionWithConsumer,
  meterHealthTypes,
  ctptHealthTypes,
  anomalyTypes,
  metersWithTimezonesAndProfiles,
  latestMeterReading,
}: Readonly<Props>) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Meter Reading',
      href: `/meter-reading/${connectionWithConsumer?.connection?.connection_id}/create`,
    },
  ]
  const getNextDay = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    date.setDate(date.getDate() + 1)
    return date.toISOString().split('T')[0] // format YYYY-MM-DD
  }
  const { formData, setFormValue } = useCustomForm({
    connection_id: connectionWithConsumer?.connection?.connection_id,
    metering_date: '',
    reading_start_date: getNextDay(latestMeterReading?.reading_end_date),
    reading_end_date: '',
    reading_type: '',
    meter_health_id: '',
    ctpt_health_id: '',
    anomaly_id: '',
    readings_by_meter: [],
  })

  const { post, errors } = useInertiaPost(route('meter-reading.store'))

  const [activeStep, setActiveStep] = useState(0)

  // Check if a step has any errors
  const hasStepError = (fields: string[]) => fields.some((f) => errors?.[f])
  const getFirstErrorStep = () => {
    if (hasStepError(['metering_date', 'reading_start_date', 'reading_end_date', 'reading_type']))
      return 0
    if (hasStepError(['meter_health_id', 'ctpt_health_id', 'anomaly_id'])) return 1
    // last step (readings) we don't force navigation
    return activeStep
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    post(formData)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={connectionsNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        <form onSubmit={handleSubmit}>
          <Stepper
            activeStep={activeStep}
            onStepChange={setActiveStep}
            steps={[
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
                content: (
                  <MeterReadingGeneralStep
                    connectionWithConsumer={connectionWithConsumer}
                    formData={formData}
                    setFormValue={setFormValue}
                    errors={errors}
                  />
                ),
              },
              {
                id: 2,
                title: 'Observations',
                status: hasStepError(['meter_health_id', 'ctpt_health_id', 'anomaly_id'])
                  ? 'error'
                  : 'default',
                content: (
                  <MeterReadingObservationStep
                    formData={formData}
                    setFormValue={setFormValue}
                    meterHealthTypes={meterHealthTypes}
                    ctptHealthTypes={ctptHealthTypes}
                    anomalyTypes={anomalyTypes}
                    errors={errors}
                  />
                ),
              },
              {
                id: 3,
                title: 'Readings',
                status: 'default', // don't enforce errors on last step
                content: (
                  <MeterReadingsStep
                    metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
                    formData={formData}
                    setFormValue={setFormValue}
                  />
                ),
              },
            ]}
          />
        </form>
      </div>
    </MainLayout>
  )
}
