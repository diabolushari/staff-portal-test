import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { InfoItem } from '@/components/meteringtimezones/InfoItem'
import MeterTimeZoneFormModal from '@/components/meteringtimezones/MeterTimeZoneFormModal'
import { Section } from '@/components/meteringtimezones/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import { Calendar, Clock, Settings, User } from 'lucide-react'
import { useState } from 'react'

// --- TYPES ---
export interface MeteringTimezone {
  version_id: number
  metering_timezone_id: number
  pricing_type: ParameterValues
  timezone_type: ParameterValues
  timezone_name: ParameterValues
  from_hrs: number
  from_mins: number
  to_hrs: number
  to_mins: number
  effective_start_ts: string
  effective_end_ts: string | null
  is_active: boolean
  created_ts: string
  updated_ts: string
  created_by: number
  updated_by: number | null
}

export interface MeteringTimezoneResponse {
  timezone_type: ParameterValues
  metering_timezones: MeteringTimezone[]
}

interface Props {
  timezone: MeteringTimezoneResponse
  timezoneTypes: ParameterValues[]
  pricingTypes: ParameterValues[]
  timezoneNameParameter: ParameterDefinition
  timeZonetypeParameter: ParameterDefinition
  timezoneNames: ParameterValues[]
}

// --- COMPONENT ---
export default function MeteringTimezoneShowPage({
  timezone,
  pricingTypes,
  timezoneNameParameter,
  timezoneNames,
}: Readonly<Props>) {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<MeteringTimezone | null | undefined>(null)
  const [selectedTimezone, setSelectedTimezone] = useState<MeteringTimezone | null | undefined>(
    undefined
  )

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Metering Timezones',
      href: route('metering-timezone.index'),
    },
  ]
  const { timezone_type, metering_timezones } = timezone

  const formatTime = (hrs: number, mins: number) =>
    `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateDuration = (tz: MeteringTimezone) => {
    const start = tz.from_hrs * 60 + tz.from_mins
    const end = tz.to_hrs * 60 + tz.to_mins
    return end >= start ? end - start : 1440 - start + end
  }

  const handleEdit = (tz: MeteringTimezone) => {
    setIsEditing(true)
    setSelectedTimezone(tz)
  }

  const handleDelete = (zone: MeteringTimezone) => {
    setDeleteModalOpen(true)
    setDeleteItem(zone)
  }

  // --- RENDER ---
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Metering Timezones'
      selectedTopNav='Consumers'
    >
      <div className='container mx-auto py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-800'>
            {timezone_type?.parameter_value}
          </h1>
          <p className='text-gray-500'>Metering Timezone Details</p>
        </div>

        {/* Timezone Cards */}
        {metering_timezones.map((tz) => (
          <Card
            key={tz.version_id}
            className='mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm'
          >
            <CardContent className='p-8'>
              {/* Card Header */}
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  {tz.timezone_name.parameter_value}
                </h2>
                <div className='flex gap-2'>
                  <EditButton onClick={() => handleEdit(tz)} />
                  <DeleteButton onClick={() => handleDelete(tz)} />
                </div>
              </div>

              {/* Configuration */}
              <Section title='Configuration'>
                <InfoItem
                  label='Pricing Type'
                  value={tz.pricing_type.parameter_value}
                  icon={<Settings className='h-4 w-4' />}
                />
                <InfoItem
                  label='Timezone Type'
                  value={tz.timezone_type.parameter_value}
                  icon={<Settings className='h-4 w-4' />}
                />
                <InfoItem
                  label='Status'
                  value={tz.is_active ? 'Active' : 'Inactive'}
                  icon={<Settings className='h-4 w-4' />}
                />
              </Section>

              <Separator className='my-6' />

              {/* Time Configuration */}
              <Section title='Time Configuration'>
                <InfoItem
                  label='Start Time'
                  value={formatTime(tz.from_hrs, tz.from_mins)}
                  icon={<Clock className='h-4 w-4' />}
                />
                <InfoItem
                  label='End Time'
                  value={formatTime(tz.to_hrs, tz.to_mins)}
                  icon={<Clock className='h-4 w-4' />}
                />
                <InfoItem
                  label='Duration'
                  value={`${calculateDuration(tz)} minutes`}
                  icon={<Clock className='h-4 w-4' />}
                />
                <InfoItem
                  label='Time Range'
                  value={`${formatTime(tz.from_hrs, tz.from_mins)} - ${formatTime(
                    tz.to_hrs,
                    tz.to_mins
                  )}`}
                  icon={<Clock className='h-4 w-4' />}
                />
              </Section>

              <Separator className='my-6' />

              {/* History */}
              <Section title='History'>
                <InfoItem
                  label='Created Date'
                  value={formatDateTime(tz.created_ts)}
                  icon={<Calendar className='h-4 w-4' />}
                />
                <InfoItem
                  label='Last Updated'
                  value={formatDateTime(tz.updated_ts)}
                  icon={<Calendar className='h-4 w-4' />}
                />
                <InfoItem
                  label='Created By'
                  value={`User ${tz.created_by}`}
                  icon={<User className='h-4 w-4' />}
                />
                <InfoItem
                  label='Updated By'
                  value={tz.updated_by ? `User ${tz.updated_by}` : 'Not updated'}
                  icon={<User className='h-4 w-4' />}
                />
              </Section>
            </CardContent>
          </Card>
        ))}
      </div>
      {isEditing && selectedTimezone && (
        <MeterTimeZoneFormModal
          timezone={selectedTimezone}
          timezoneType={selectedTimezone.timezone_type}
          pricingTypes={pricingTypes}
          timezoneNames={timezoneNames}
          timezoneNameParameter={timezoneNameParameter}
          onClose={() => setIsEditing(false)}
        />
      )}
      {deleteItem && deleteModalOpen && (
        <DeleteModal
          title={`Delete Metering Timezone ${deleteItem.timezone_name.parameter_value}`}
          setShowModal={setDeleteModalOpen}
          url={route('metering-timezone.destroy', deleteItem.metering_timezone_id)}
        />
      )}
    </MainLayout>
  )
}
