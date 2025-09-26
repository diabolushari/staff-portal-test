import MeterReadingGeneralStep from '@/components/Meter/MeterReading/MeterReadingGeneralStep'
import MeterReadingObservationStep from '@/components/Meter/MeterReading/MeterReadingObservationStep'
import MeterReadingsStep from '@/components/Meter/MeterReading/MeterReadingsStep'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import Stepper from '@/components/Stepper'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ConsumerData } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

interface Props {
  connectionWithConsumer: ConsumerData
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  metersWithTimezonesAndProfiles: any[]
}

export default function MeterReadingCreatePage({
  connectionWithConsumer,
  meterHealthTypes,
  ctptHealthTypes,
  anomalyTypes,
  metersWithTimezonesAndProfiles,
}: Readonly<Props>) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Meter Reading',
      href: `/meter-reading/${connectionWithConsumer?.connection?.connection_id}/create`,
    },
  ]
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    connection_id: connectionWithConsumer?.connection?.connection_id,
    normal_pf: '',
    peak_pf: '',
    offpeak_pf: '',
    average_power_factor: '',
    reading_type: '',
    anomaly_id: '',
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
    readings: [],
    readings_by_meter: [],
  })
  const { post } = useInertiaPost(route('meter-reading.store'), {
    showErrorToast: true,
  })

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
            onSubmit={handleSubmit}
            steps={[
              {
                id: 1,
                title: 'General',
                content: (
                  <MeterReadingGeneralStep
                    connectionWithConsumer={connectionWithConsumer}
                    formData={formData}
                    setFormValue={setFormValue}
                  />
                ),
              },
              {
                id: 2,
                title: 'Observations',
                content: (
                  <MeterReadingObservationStep
                    formData={formData}
                    setFormValue={setFormValue}
                    meterHealthTypes={meterHealthTypes}
                    ctptHealthTypes={ctptHealthTypes}
                    anomalyTypes={anomalyTypes}
                  />
                ),
              },
              {
                id: 3,
                title: 'Readings',
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
