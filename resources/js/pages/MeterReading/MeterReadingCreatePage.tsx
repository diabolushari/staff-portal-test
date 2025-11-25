import MeterReadingGeneralStep from '@/components/Meter/MeterReading/MeterReadingGeneralStep'
import MeterReadingObservationStep from '@/components/Meter/MeterReading/MeterReadingObservationStep'
import MeterReadingsStep from '@/components/Meter/MeterReading/MeterReadingsStep'
import { consumerNavItems, metadataNavItems } from '@/components/Navbar/navitems'
import Stepper from '@/components/Stepper'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  ConsumerData,
  Meter,
  MeterProfileParameter,
  MeterReading,
  meterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import { useEffect, useMemo, useState } from 'react'

interface MeterHealth {
  meter_id: number
  meter_serial: string | null
  meter_health_id?: number | null
  ctpts?: { ctpt_id: number; health: number | null; ctpt_serial: string }[]
}
interface ReadingForm extends MeterReading {
  readings_by_meter: any[]
  reading_type: string
  _method: 'PUT' | 'POST' | undefined
  meter_health: MeterHealth[]
}

interface Props {
  connectionWithConsumer: ConsumerData
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  ptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  metersWithTimezonesAndProfiles: meterWithTimezoneAndProfile[]
  latestMeterReading: MeterReading
  editMode: boolean
}

function transformToFormData(
  values: any[],
  metersWithTimezonesAndProfiles: meterWithTimezoneAndProfile[],
  editMode: boolean
) {
  const groupedByMeter = metersWithTimezonesAndProfiles.map((meter) => {
    const meterReadings = values.filter((v) => v.meter_id === meter.meter_id)

    const parameters = meter.meter_profiles.map((profile: MeterProfileParameter) => {
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

const storeIntialMetersHealthData = (
  metersWithTimezonesAndProfiles: meterWithTimezoneAndProfile[]
) => {
  return metersWithTimezonesAndProfiles.map((meter) => ({
    meter_id: meter.meter_id,
    meter_health_id: null,
    meter_serial: meter.meter.meter_serial,
    ctpts: meter.meter.transformers.map((ctpt) => ({
      ctpt_id: ctpt.meter_ctpt_id,
      health: null,
      ctpt_serial: ctpt.ctpt_serial,
    })),
  }))
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
      title: String(connectionWithConsumer?.connection?.consumer_number) ?? '',
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

  const { formData, setFormValue } = useCustomForm<ReadingForm>({
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
    readings_by_meter: [],
    meter_health: storeIntialMetersHealthData(metersWithTimezonesAndProfiles),
    _method: editMode ? 'PUT' : undefined,
  })

  const { post, errors } = useInertiaPost(
    editMode ? route('meter-reading.update', formData.id) : route('meter-reading.store'),
    {
      showErrorToast: true,
    }
  )
  const updateMeterHealth = (meterHealthId: number, meter: Meter) => {
    const updated = [...formData.meter_health]
    const existingIdx = updated?.findIndex((m) => m.meter_id === meter.meter_id)

    if (existingIdx !== -1) {
      // Update existing meter health
      updated[existingIdx].meter_health_id = meterHealthId
    } else {
      // Add new meter health entry
      updated?.push({
        meter_id: meter.meter_id,
        meter_serial: meter.meter_serial,
        meter_health_id: meterHealthId,
        ctpts: [],
      })
    }

    setFormValue('meter_health')(updated)
  }
  const updateCTPTHealth = (meterId: number, ctptId: number, healthId: number, meter: Meter) => {
    const updated = [...formData.meter_health]
    const existingIdx = updated?.findIndex((m) => m.meter_id === meterId)

    if (existingIdx !== -1) {
      const ctptList = updated[existingIdx].ctpts || []
      const ctptIdx = ctptList?.findIndex((c) => c.ctpt_id === ctptId)

      if (ctptIdx !== -1) {
        ctptList[ctptIdx].health = healthId
      } else {
        ctptList.push({ ctpt_id: ctptId, health: healthId })
      }

      updated[existingIdx].ctpts = ctptList
    } else {
      updated.push({
        meter_id: meterId,
        meter_serial: meter.meter_serial,
        meter_health_id: undefined,
        ctpts: [
          {
            ctpt_id: ctptId,
            health: healthId,
            ctpt_serial: meter.transformers.find((t) => t.meter_ctpt_id === ctptId)?.ctpt_serial,
          },
        ],
      })
    }

    setFormValue('meter_health')(updated)
  }

  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (formData.readings_by_meter?.length > 0) return

    if (latestMeterReading?.values?.length > 0) {
      const transformed = transformToFormData(
        latestMeterReading.values,
        metersWithTimezonesAndProfiles,
        editMode
      )

      setFormValue('readings_by_meter')(transformed)
    } else {
      const initializedMeters = metersWithTimezonesAndProfiles.map((meter) => ({
        meter_id: meter.meter_id,
        parameters: meter.meter_profiles.map((profile: any) => ({
          meter_parameter_id: profile.meter_parameter_id,
          display_name: profile.display_name,
          readings: meter?.timezones?.map((tz: any) => ({
            timezone_id: tz.timezone_id,
            timezone_name: tz.timezone_name,
            values: { initial: 0, final: '', diff: '', mf: 0 },
          })),
        })),
      }))
      setFormValue('readings_by_meter')(initializedMeters)
    }
  }, [latestMeterReading, metersWithTimezonesAndProfiles])

  // Check if a step has any errors
  const hasStepError = (fields: string[]) => fields.some((f) => errors?.[f])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement | null>, multipleReading = false) => {
    e?.preventDefault()

    post({
      ...formData,
      multiple_reading: multipleReading,
    })
  }

  const steps = useMemo(() => {
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
                metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
                formData={formData}
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
