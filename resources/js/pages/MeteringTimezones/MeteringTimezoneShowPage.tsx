import { router } from '@inertiajs/react'
import { Edit, Trash2, Clock, Calendar, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { InfoItem } from '@/components/meteringtimezones/InfoItem'
import { Section } from '@/components/meteringtimezones/Section'

// --- TYPES AND INTERFACES ---
export interface MeteringTimezone {
  version_id: number
  metering_timezone_id: number
  pricing_type: { id: number; parameter_value: string }
  timezone_type: { id: number; parameter_value: string }
  timezone_name: { id: number; parameter_value: string }
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

interface Props {
  timezone: MeteringTimezone
}

// --- MAIN COMPONENT: MeteringTimezoneShowPage ---
export default function MeteringTimezoneShowPage({ timezone }: Readonly<Props>) {
  console.log(timezone)

  // --- STATE ---
  const [loading, setLoading] = useState(false)

  // --- BREADCRUMBS AND FORMATTERS ---
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Metering Timezones', href: route('metering-timezone.index') },
    {
      title: timezone.timezone_name.parameter_value,
      href: route('metering-timezone.show', timezone.metering_timezone_id),
    },
  ]

  const formatTime = (hrs: number, mins: number): string => {
    const formattedHrs = hrs.toString().padStart(2, '0')
    const formattedMins = mins.toString().padStart(2, '0')
    return `${formattedHrs}:${formattedMins}`
  }

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

  // --- EVENT HANDLERS ---
  const handleEdit = () => {
    router.get(route('metering-timezone.edit', timezone.metering_timezone_id))
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this metering timezone?')) {
      setLoading(true)
      router.delete(route('metering-timezone.destroy', timezone.metering_timezone_id), {
        onFinish: () => setLoading(false),
      })
    }
  }

  // --- RENDER LOGIC ---
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Metering Timezones'
    >
      <div className='container mx-auto py-8'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold text-gray-800'>
              {timezone.timezone_name.parameter_value}
            </h1>
            <p className='text-gray-500'>Metering Timezone Details</p>
          </div>
          <div className='flex gap-2'>
            <Button
              label='Edit'
              onClick={handleEdit}
              variant='outline'
              disabled={loading}
              icon={<Edit className='mr-2 h-4 w-4' />}
            />
            <Button
              label='Delete'
              onClick={handleDelete}
              variant='destructive'
              disabled={loading}
              icon={<Trash2 className='mr-2 h-4 w-4' />}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <Card className='overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
          <CardContent className='p-8'>
            {/* --- Configuration Information --- */}
            <Section title='Configuration'>
              <InfoItem
                label='Timezone Name'
                value={timezone.timezone_name.parameter_value}
                icon={<Settings className='h-4 w-4' />}
              />
              <InfoItem
                label='Pricing Type'
                value={timezone.pricing_type.parameter_value}
                icon={<Settings className='h-4 w-4' />}
              />
              <InfoItem
                label='Timezone Type'
                value={timezone.timezone_type.parameter_value}
                icon={<Settings className='h-4 w-4' />}
              />
            </Section>

            <Separator className='my-6' />

            {/* --- Time Configuration --- */}
            <Section title='Time Configuration'>
              <InfoItem
                label='Start Time'
                value={formatTime(timezone.from_hrs, timezone.from_mins)}
                icon={<Clock className='h-4 w-4' />}
              />
              <InfoItem
                label='End Time'
                value={formatTime(timezone.to_hrs, timezone.to_mins)}
                icon={<Clock className='h-4 w-4' />}
              />
              <InfoItem
                label='Duration'
                value={`${timezone.to_hrs * 60 + timezone.to_mins - (timezone.from_hrs * 60 + timezone.from_mins)} minutes`}
                icon={<Clock className='h-4 w-4' />}
              />
              <InfoItem
                label='Time Range'
                value={`${formatTime(timezone.from_hrs, timezone.from_mins)} - ${formatTime(timezone.to_hrs, timezone.to_mins)}`}
                icon={<Clock className='h-4 w-4' />}
              />
            </Section>

            <Separator className='my-6' />

            {/* --- Audit Information --- */}
            <Section title='History'>
              <InfoItem
                label='Created Date'
                value={formatDateTime(timezone.created_ts)}
                icon={<Calendar className='h-4 w-4' />}
              />
              <InfoItem
                label='Last Updated'
                value={formatDateTime(timezone.updated_ts)}
                icon={<Calendar className='h-4 w-4' />}
              />
              <InfoItem
                label='Created By'
                value={`User ${timezone.created_by}`}
                icon={<User className='h-4 w-4' />}
              />
              <InfoItem
                label='Updated By'
                value={timezone.updated_by ? `User ${timezone.updated_by}` : 'Not updated'}
                icon={<User className='h-4 w-4' />}
              />
            </Section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
