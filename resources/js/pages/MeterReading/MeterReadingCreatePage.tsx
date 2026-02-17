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
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import { useEffect, useMemo, useRef, useState } from 'react'
import ErrorBanner from '@/ui/Errors/ErrorBanner'
import dayjs from 'dayjs'
import { getDisplayDate } from '@/utils'
import { ProfileReadingFormRef } from '@/components/Meter/MeterReading/ProfileReadingForm'
import { MeterReadingPreviewRef } from '@/components/Meter/MeterReading/MeterReadingPreview'
import { set } from 'date-fns'

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
  ctHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  latestMeterReading: MeterReading
  editMode: boolean
  interimReasons: ParameterValues[]
}

const getNextDay = (dateStr: string) => {
  if (!dateStr) {
    return ''
  }
  const date = dayjs(dateStr)
  return date.add(1, 'day').format('YYYY-MM-DD')
}
const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const getMonthEnd = (dateStr: string, isFirstReading: boolean) => {
  if (!dateStr) return ''

  // First reading use the same date
  if (isFirstReading) {
    return dayjs(dateStr).format('YYYY-MM-DD')
  }

  // Not first reading end of that month
  return dayjs(dateStr).endOf('month').format('YYYY-MM-DD')
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

  const { readingValues, updateReading } = useMeterReadingForm(
    metersWithTimezonesAndProfiles,
    latestMeterReading,
    editMode ? latestMeterReading : null
  )

  const { healthData, updateMeterHealth, updateCTPTHealth, updateRybValues } = useMeterHealthForm(
    metersWithTimezonesAndProfiles,
    meterHealthTypes,
    ctHealthTypes,
    latestMeterReading
  )

  const [isInterimReading, setIsInterimReading] = useState(false)
  const [metersListForInterimReading, setMetersListForInterimReading] = useState<
    MeterWithTimezoneAndProfile[]
  >(metersWithTimezonesAndProfiles)

  const getMeterEnergisedDate = (meterMappings: MeterConnectionMapping[] = []): string => {
    if (!meterMappings.length) return ''

    // 1️⃣ Try ENERGY_CONSUMPTION meter first
    const energyMeter = meterMappings.find(
      (m) =>
        m.meter_use_category?.parameter_value?.toLowerCase() === 'energy consumption' &&
        m.energise_date
    )

    if (energyMeter?.energise_date) {
      return dayjs(energyMeter.energise_date).format('YYYY-MM-DD')
    }

    // 2️⃣ Otherwise take the first energised_date
    const latestMeter = meterMappings
      .filter((m) => m.energise_date)
      .sort((a, b) => dayjs(a.energise_date!).valueOf() - dayjs(b.energise_date!).valueOf())[0]

    return latestMeter?.energise_date ? dayjs(latestMeter.energise_date).format('YYYY-MM-DD') : ''
  }

  const isFirstReading = useMemo(() => {
    return latestMeterReading == null
  }, [latestMeterReading])

  const readingStartDate = useMemo(() => {
    if (isFirstReading) {
      return getMeterEnergisedDate(connectionWithConsumer?.connection?.meter_mappings ?? [])
    }
    // if (latestMeterReading?.reading_start_date == latestMeterReading?.reading_end_date) {
    //   return latestMeterReading?.reading_end_date
    // }

    return getNextDay(latestMeterReading?.reading_end_date) ?? ''
  }, [isFirstReading, latestMeterReading?.reading_end_date, connectionWithConsumer])

  const [isOnParamaterForm, setIsOnParameterForm] = useState(false)

  const [allProfileHasData, setAllProfileHasData] = useState<boolean>(false)
  const [profileErrorExist, setProfileErrorExist] = useState<boolean>(false)

  const { formData, setFormValue } = useCustomForm<MeterReadingForm>({
    id: editMode ? latestMeterReading?.id : 0,
    connection_id: connectionWithConsumer?.connection?.connection_id ?? 0,
    metering_date: getToday(),
    reading_start_date: readingStartDate,
    reading_end_date: editMode
      ? latestMeterReading?.reading_end_date
      : (getMonthEnd(readingStartDate, isFirstReading) ?? ''),
    reading_type: editMode ? latestMeterReading?.single_reading : 'single_reading',
    anomaly_id: editMode ? latestMeterReading?.anomaly_id : 0,
    remarks: editMode ? latestMeterReading?.remarks : '',
    interim_reason: '',
    meters: [],
    _method: editMode ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost(
    editMode ? route('meter-reading.update', formData.id) : route('meter-reading.store'),
    {
      showErrorToast: true,
    }
  )

  useEffect(() => {
    if (formData.reading_type === 'interim_reading') {
      setIsInterimReading(true)
    } else {
      setIsInterimReading(false)
      setFormValue('reading_end_date')(getMonthEnd(readingStartDate, isFirstReading) ?? '')
    }
  }, [formData.reading_type])

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
      multiple_reading: false,
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
                  errors={errors}
                  latestMeterReading={latestMeterReading}
                  isFirstReading={isFirstReading}
                  isInterimReading={isInterimReading}
                  interimReasons={interimReasons}
                  metersListForInterimReading={metersListForInterimReading}
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
                  isInterimReading={isInterimReading}
                  metersListForInterimReading={metersListForInterimReading}
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
              {formData.reading_type === 'multiple_reading' && activeStep === steps.length - 1 && (
                <Button
                  type='button'
                  label='Save & Add New Reading'
                  variant='link'
                  onClick={() => handleSubmit()}
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
