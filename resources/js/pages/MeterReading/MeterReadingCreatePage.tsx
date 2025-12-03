import MeterReadingGeneralStep from '@/components/Meter/MeterReading/MeterReadingGeneralStep'
import MeterReadingObservationStep from '@/components/Meter/MeterReading/MeterReadingObservationStep'
import MeterReadingsStep from '@/components/Meter/MeterReading/MeterReadingsStep'
import useMeterHealthForm from '@/components/Meter/MeterReading/ReadingForm/useMeterHealthForm'
import useMeterReadingForm from '@/components/Meter/MeterReading/ReadingForm/useMeterReadingForm'
import { consumerNavItems } from '@/components/Navbar/navitems'
import Stepper from '@/components/Stepper'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  ConsumerData,
  MeterReading,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import { useMemo, useState } from 'react'

export interface MeterReadingForm extends MeterReading {
  reading_type: string
  _method: 'PUT' | 'POST' | undefined
}

interface Step {
  id: number
  title: string
  status?: 'default' | 'error' | 'completed'
  cardTitle?: string
  cardSubtitle?: string
}

interface Props {
  connectionWithConsumer: ConsumerData
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  latestMeterReading: MeterReading
  editMode: boolean
}

const getNextDay = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
}
const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const getMonthEnd = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const lastDay = new Date(year, month, +1)
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
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Connections',
      href: '/connections',
    },
    {
      title: connectionWithConsumer?.connection?.consumer_number.toString() ?? '',
      href: `/connections/${connectionWithConsumer?.connection?.connection_id}`,
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

  const { readingValues, updateReading } = useMeterReadingForm(
    metersWithTimezonesAndProfiles,
    latestMeterReading,
    editMode ? latestMeterReading : null
  )

  const { healthData, updateMeterHealth, updateCTPTHealth } = useMeterHealthForm(
    metersWithTimezonesAndProfiles
  )

  const { formData, setFormValue } = useCustomForm<MeterReadingForm>({
    id: editMode ? latestMeterReading?.id : 0,
    connection_id: connectionWithConsumer?.connection?.connection_id ?? 0,
    metering_date: getToday(),
    reading_start_date: getNextDay(latestMeterReading?.reading_end_date) ?? '',
    reading_end_date: editMode
      ? latestMeterReading?.reading_end_date
      : (getMonthEnd(getNextDay(latestMeterReading?.reading_end_date)) ?? ''),
    reading_type: editMode ? latestMeterReading?.single_reading : '',
    anomaly_id: editMode ? latestMeterReading?.anomaly_id : 0,
    voltage_r: editMode ? latestMeterReading?.voltage_r : 0,
    voltage_y: editMode ? latestMeterReading?.voltage_y : 0,
    voltage_b: editMode ? latestMeterReading?.voltage_b : 0,
    current_r: editMode ? latestMeterReading?.current_r : 0,
    current_y: editMode ? latestMeterReading?.current_y : 0,
    current_b: editMode ? latestMeterReading?.current_b : 0,
    remarks: editMode ? latestMeterReading?.remarks : '',
    _method: editMode ? 'PUT' : undefined,
  })

  const { post, errors } = useInertiaPost(
    editMode ? route('meter-reading.update', formData.id) : route('meter-reading.store'),
    {
      showErrorToast: true,
    }
  )

  const [activeStep, setActiveStep] = useState(0)

  // Check if a step has any errors
  const hasStepError = (fields: string[]) => fields.some((f) => errors?.[f])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement | null>, multipleReading = false) => {
    e?.preventDefault()

    post({
      ...formData,
      readings_by_meter: readingValues,
      meter_health: healthData,
      multiple_reading: multipleReading,
    })
  }

  const steps: Step[] = useMemo(() => {
    return [
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
      },
      {
        id: 3,
        title: 'Readings',
        status: 'default',
        cardTitle: `Readings for ${connectionWithConsumer?.consumer?.organization_name ?? connectionWithConsumer?.connection?.consumer_number}`,
        cardSubtitle: `${formData.reading_start_date} to ${formData.reading_end_date}`,
      },
    ]
  }, [connectionWithConsumer, formData, hasStepError])

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={consumerNavItems}
      selectedItem='Meter & Readings'
      selectedTopNav='Consumers'
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        <form onSubmit={handleSubmit}>
          <Stepper
            activeStep={activeStep}
            onStepChange={setActiveStep}
            steps={steps}
          >
            {activeStep === 0 && (
              <MeterReadingGeneralStep
                connectionWithConsumer={connectionWithConsumer}
                formData={formData}
                setFormValue={setFormValue}
                errors={errors}
                latestMeterReading={latestMeterReading}
              />
            )}
            {activeStep === 1 && (
              <MeterReadingObservationStep
                formData={formData}
                setFormValue={setFormValue}
                anomalyTypes={anomalyTypes}
                errors={errors}
              />
            )}
            {activeStep === 2 && (
              <MeterReadingsStep
                healthData={healthData}
                metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
                formData={formData}
                readingValues={readingValues}
                updateReading={updateReading}
                setFormValue={setFormValue}
                latestMeterReading={latestMeterReading}
                meterHealthTypes={meterHealthTypes}
                ctptHealthTypes={ctptHealthTypes}
                ctHealthTypes={ctHealthTypes}
                ptHealthTypes={ptHealthTypes}
                updateMeterHealth={updateMeterHealth}
                updateCTPTHealth={updateCTPTHealth}
              />
            )}
          </Stepper>
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
              <Button
                type='submit'
                label='Submit'
              />
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
