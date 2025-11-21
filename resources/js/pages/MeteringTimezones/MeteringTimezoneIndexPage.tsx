import { router } from '@inertiajs/react'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import CardHeader from '@/ui/Card/CardHeader'
import ListSearch from '@/ui/Search/ListSearch'

interface TimezoneGroup {
  timezone_type: { id: number; parameter_value: string }
  metering_timezones: MeteringTimezone[]
}

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
  timezones:
    | {
        data?: TimezoneGroup[]
      }
    | TimezoneGroup[]
}

export default function MeteringTimezonesIndexPage({ timezones }: Props) {
  const timezonesData = Array.isArray(timezones) ? timezones : timezones?.data || []
  const [groups] = useState<TimezoneGroup[]>(timezonesData)

  function handleShow(id: number) {
    router.get(`/metering-timezone/${id}`)
  }

  function formatTime(hrs: number, mins: number): string {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      selectedItem='Metering Timezones'
      addBtnText='Metering Timezone'
      addBtnUrl={route('metering-timezone.create')}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title='Metering Timezones search'
          placeholder='Enter timezone name'
        />

        <div className='relative w-full rounded-lg bg-white'>
          <CardHeader title='Metering Timezones' />

          <div className='flex flex-col gap-6 px-7 pb-7'>
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group.timezone_type.id}
                  className='rounded-lg border border-gray-200 bg-white shadow-sm'
                >
                  {/* Header */}
                  <div className='font-inter border-b border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800'>
                    {group.timezone_type.parameter_value}
                  </div>

                  {/* Timezones row */}
                  <div className='flex w-full items-center gap-6 overflow-x-auto px-4 py-3 text-sm text-slate-700'>
                    {group.metering_timezones.map((tz) => (
                      <div
                        key={tz.metering_timezone_id}
                        onClick={() => handleShow(tz.metering_timezone_id)}
                        className='flex min-w-[220px] cursor-pointer flex-col'
                      >
                        <div className='font-medium text-slate-900'>
                          {tz.timezone_name.parameter_value}
                        </div>
                        <div className='flex items-center gap-1 text-slate-600'>
                          <Clock className='h-3.5 w-3.5 text-slate-500' />
                          {formatTime(tz.from_hrs, tz.from_mins)} -{' '}
                          {formatTime(tz.to_hrs, tz.to_mins)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className='p-6 text-center text-slate-500'>
                <p>No metering timezones found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
