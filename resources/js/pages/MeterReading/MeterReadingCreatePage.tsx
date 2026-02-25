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
  MeterConnectionMapping,
  MeterReading,
  MeterReadingValueGroup,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import { useEffect, useMemo, useRef, useState } from 'react'
import ErrorBanner from '@/ui/Errors/ErrorBanner'
import { getDisplayDate } from '@/utils'
import { ProfileReadingFormRef } from '@/components/Meter/MeterReading/ProfileReadingForm'
import { MeterReadingPreviewRef } from '@/components/Meter/MeterReading/MeterReadingPreview'
import { getMeterEnergisedDate, getMonthEnd, getNextDay, getToday } from '@/utils/DateService'
import dayjs, { Dayjs } from 'dayjs'

export interface MeterReadingForm extends MeterReading {
  meters: number[]
  interim_reason_id: number
  is_interim_reading: boolean
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
  ctHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  latestMeterReading: MeterReading
  editMode: boolean
  interimReasons: ParameterValues[]
  latestMeterReadingGroupByMeter: MeterReadingValueGroup[]
  meterConnectionMappings: MeterConnectionMapping[]
}

export default function MeterReadingCreatePage({
  connectionWithConsumer,
  meterHealthTypes,
  ctHealthTypes,
  anomalyTypes,
  metersWithTimezonesAndProfiles,
  latestMeterReading,
  editMode,
  interimReasons,
  latestMeterReadingGroupByMeter,
  meterConnectionMappings,
}: Readonly<Props>) {
  const breadcrumb: BreadcrumbItem[] = useMemo(() => {
    return [
      {
        title: 'Home',
        href: '/',
      },
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
  }, [connectionWithConsumer])

  const [activeProfile, setActiveProfile] = useState<{
    meterIdx: number
    profileIdx: number
  } | null>(null)

  const [selectedMeters, setSelectedMeters] = useState<number[]>(
    meterConnectionMappings?.map((m) => m.meter_id) ?? []
  )

  const { readingValues, updateReading } = useMeterReadingForm(
    metersWithTimezonesAndProfiles,
    latestMeterReadingGroupByMeter,
    editMode ? latestMeterReading : null
  )

  const { healthData, updateMeterHealth, updateCTPTHealth, updateRybValues } = useMeterHealthForm(
    metersWithTimezonesAndProfiles,
    meterHealthTypes,
    ctHealthTypes,
    latestMeterReadingGroupByMeter,
    anomalyTypes
  )

  const [hasInterimReading, setHasInterimReading] = useState(
    latestMeterReadingGroupByMeter?.length > 0
      ? latestMeterReadingGroupByMeter?.some((h) => h?.reading?.is_interim_reading) === true
        ? true
        : false
      : false
  )

  const isFirstReading: boolean = useMemo(() => {
    if (!meterConnectionMappings?.length) return true

    const readingMeterIds =
      latestMeterReadingGroupByMeter?.map((reading) => reading?.meter?.meter_id) ?? []

    // If any mapped meter does NOT have a reading → first reading
    const hasMeterWithoutReading = selectedMeters.some(
      (meterId) => !readingMeterIds.includes(meterId)
    )

    return hasMeterWithoutReading
  }, [meterConnectionMappings, latestMeterReadingGroupByMeter, selectedMeters])

  const readingStartDate: string = useMemo(() => {
    if (isFirstReading) {
      return getMeterEnergisedDate(
        meterConnectionMappings ?? [],
        latestMeterReadingGroupByMeter,
        selectedMeters
      )
    }

    return getNextDay(latestMeterReading?.reading_end_date) ?? ''
  }, [
    isFirstReading,
    latestMeterReading?.reading_end_date,
    meterConnectionMappings,
    selectedMeters,
  ])

  const [isOnParamaterForm, setIsOnParameterForm] = useState(false)

  const [allProfileHasData, setAllProfileHasData] = useState<boolean>(false)
  const [profileErrorExist, setProfileErrorExist] = useState<boolean>(false)

  const defalultAnomaly = anomalyTypes.find(
    (h) => h.parameter_value.toLowerCase() === 'no visible anomalies'
  )
  const { formData, setFormValue, toggleBoolean } = useCustomForm<MeterReadingForm>({
    id: editMode ? latestMeterReading?.id : 0,
    connection_id: connectionWithConsumer?.connection?.connection_id ?? 0,
    metering_date: getToday(),
    reading_start_date: readingStartDate,
    reading_end_date: editMode
      ? latestMeterReading?.reading_end_date
      : (getMonthEnd(readingStartDate, isFirstReading, meterConnectionMappings) ?? ''),
    anomaly_id: editMode ? latestMeterReading?.anomaly_id : (defalultAnomaly?.id ?? 0),
    remarks: editMode ? latestMeterReading?.remarks : '',
    interim_reason_id: '',
    is_interim_reading: hasInterimReading ? true : false,
    meters:
      meterConnectionMappings?.length >= 1 ? meterConnectionMappings?.map((m) => m.meter_id) : [],
    has_first_reading_meter: isFirstReading,
    _method: editMode ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost(
    editMode ? route('meter-reading.update', formData.id) : route('meter-reading.store'),
    {
      showErrorToast: true,
    }
  )

  useEffect(() => {
    if (formData.is_interim_reading) {
    } else {
      setFormValue('reading_end_date')(getMonthEnd(readingStartDate, isFirstReading) ?? '')
    }
  }, [formData.is_interim_reading])

  useEffect(() => {
    if (!formData.meters?.length) return

    setSelectedMeters(formData.meters)
    const currentMonth = dayjs(latestMeterReading?.reading_end_date).add(1, 'day')

    let effectiveEndDates: Dayjs[] = []

    formData.meters.forEach((meterId) => {
      const mappingsOfMeter = meterConnectionMappings.filter((m) => m.meter_id === meterId)

      console.log(mappingsOfMeter, 'mappingsOfMeter', currentMonth)
      mappingsOfMeter.forEach((mapping) => {
        if (!mapping.effective_end_ts) return

        const endDate = dayjs(mapping.effective_end_ts)

        if (endDate.isSame(currentMonth, 'month')) {
          effectiveEndDates.push(endDate)
        }
      })
    })

    let lastReadingDate: string = ''

    console.log(effectiveEndDates, 'effective ned dates ')
    if (effectiveEndDates.length > 0) {
      // ✅ Get lowest (earliest) effective_end_ts
      const lowestDate = effectiveEndDates.sort((a, b) => a.valueOf() - b.valueOf())[0]

      lastReadingDate = lowestDate.format('YYYY-MM-DD')
    } else {
      const lastReadings = formData.meters
        .map((meterId) =>
          latestMeterReadingGroupByMeter.find((reading) => reading.meter?.meter_id === meterId)
        )
        .filter(Boolean)

      const latestReadingEndDate = lastReadings
        .map((r) => dayjs(r!.reading?.reading_end_date))
        .sort((a, b) => b.valueOf() - a.valueOf())[0]

      if (latestReadingEndDate) {
        lastReadingDate =
          getMonthEnd(getNextDay(latestReadingEndDate.format('YYYY-MM-DD')) ?? '', false) ?? ''
      }
      console.log('lastReadingDate', lastReadingDate)
    }

    if (isFirstReading) {
      setFormValue('reading_end_date')(readingStartDate ?? '')
    }

    setFormValue('reading_end_date')(lastReadingDate)
    setFormValue('reading_start_date')(readingStartDate)
  }, [formData.meters, latestMeterReadingGroupByMeter, meterConnectionMappings, selectedMeters])

  const [activeStep, setActiveStep] = useState(0)

  const previewRefs = useRef<Record<number, MeterReadingPreviewRef | null>>({})
  const accordionOpen = () => {
    Object.values(previewRefs.current).forEach((ref) => {
      ref?.expandAll()
    })
  }

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    accordionOpen()

    post({
      ...formData,
      readings_by_meter: readingValues,
      meter_health: healthData,
    })
  }

  const steps: Step[] = useMemo(() => {
    const hasStepError = (fields: string[]) =>
      fields.some((f) => errors?.[f as keyof typeof errors])

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
        cardSubtitle: `${getDisplayDate(formData.reading_start_date)} to ${getDisplayDate(formData.reading_end_date)}`,
      },
    ]
  }, [connectionWithConsumer, formData, errors])

  const meterMissingErrors = useMemo(() => {
    return {
      title: 'Missing Meters',
      description: 'Connection does not have any meters or ct/pt transformers attached to it.',
      bulletPoints: [
        'Please add meters to the connection first.',
        'If you are adding meters to an existing connection, please make sure the meters are attached to the correct CT/PT transformers.',
      ],
      actionUrl: route('connections.show', connectionWithConsumer?.connection?.connection_id),
    }
  }, [connectionWithConsumer])

  const profileRefs = useRef<Record<string, ProfileReadingFormRef | null>>({})

  const availableMeterIds = useMemo(() => {
    return formData.is_interim_reading
      ? formData.meters
      : metersWithTimezonesAndProfiles.map((meter) => meter.meter_id)
  }, [formData.meters, formData.is_interim_reading, metersWithTimezonesAndProfiles])

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={consumerNavItems}
      selectedItem='Meter & Readings'
      selectedTopNav='Consumers'
    >
      {metersWithTimezonesAndProfiles.length === 0 && (
        <ErrorBanner
          title={meterMissingErrors.title}
          description={meterMissingErrors.description}
          bulletPoints={meterMissingErrors.bulletPoints}
          actionUrl={meterMissingErrors.actionUrl}
        />
      )}
      {metersWithTimezonesAndProfiles.length > 0 && (
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
                  toggleBoolean={toggleBoolean}
                  errors={errors}
                  latestMeterReading={latestMeterReadingGroupByMeter}
                  isFirstReading={isFirstReading}
                  interimReasons={interimReasons}
                  availableMeterIds={availableMeterIds}
                  metersListForInterimReading={metersWithTimezonesAndProfiles}
                  hasInterimReading={hasInterimReading}
                />
              )}
              {activeStep === 1 && (
                <MeterReadingObservationStep
                  formData={formData}
                  setFormValue={setFormValue}
                  anomalyTypes={anomalyTypes}
                  errors={errors}
                  meterHealthData={healthData}
                  updateRybValues={updateRybValues}
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
                  ctHealthTypes={ctHealthTypes}
                  updateMeterHealth={updateMeterHealth}
                  updateCTPTHealth={updateCTPTHealth}
                  setIsOnParameterForm={setIsOnParameterForm}
                  isFirstReading={isFirstReading}
                  isOnparameterForm={isOnParamaterForm}
                  profileRefs={profileRefs}
                  activeProfile={activeProfile}
                  setActiveProfile={setActiveProfile}
                  previewRefs={previewRefs}
                  setAllProfileHasData={setAllProfileHasData}
                  setProfileErrorExist={setProfileErrorExist}
                />
              )}
            </Stepper>
            <div className='mt-6 flex justify-between'>
              {activeStep >= 0 && (
                <Button
                  type='button'
                  variant='secondary'
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

              {activeStep === steps.length - 1 && allProfileHasData && !profileErrorExist && (
                <Button
                  type='submit'
                  label='Submit'
                  disabled={loading}
                  processing={loading}
                  variant={loading ? 'loading' : 'primary'}
                />
              )}
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  )
}
