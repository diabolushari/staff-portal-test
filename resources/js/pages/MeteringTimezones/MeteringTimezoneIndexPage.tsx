import { router } from '@inertiajs/react'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import ListSearch from '@/ui/Search/ListSearch'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import { BreadcrumbItem } from '@/types'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import Button from '@/ui/button/Button'
import ParameterValueModal from '@/components/Parameter/ParameterValue/ParameterValueModal'
import AddButton from '@/ui/button/AddButton'
import MeterTimeZoneFormModal from '@/components/meteringtimezones/MeterTimeZoneFormModal'

interface TimezoneGroup {
  timezone_type: ParameterValues
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
  timezone_types: ParameterValues[]
  pricing_types: ParameterValues[]
  timezone_names: ParameterValues[]
  timezone_type_parameter: ParameterDefinition
  timezone_name_parameter: ParameterDefinition
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings-page',
  },
  {
    title: 'Metering Timezones',
    href: '/metering-timezones',
  },
]

export default function MeteringTimezonesIndexPage({
  timezones,
  timezone_types,
  pricing_types,
  timezone_names,
  timezone_type_parameter,
  timezone_name_parameter,
}: Props) {
  const [selectedTimeZone, setSelectedTimeZone] = useState<MeteringTimezone | null>(null)
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [selecedDefinition, setSelectedDefinition] = useState<ParameterDefinition | null>(null)
  const [selectedType, setSelectedType] = useState<ParameterValues | null>(null)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const timezonesData = Array.isArray(timezones) ? timezones : timezones?.data || []
  const [groups] = useState<TimezoneGroup[]>(timezonesData)

  const timezoneTypesWithoutTimezones = timezone_types.filter(
    (type) => !groups.some((group) => group.timezone_type.id === type.id)
  )

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
      selectedTopNav='Consumers'
      title='Metering Timezones'
      breadcrumb={breadcrumbs}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title=''
          placeholder='Enter timezone name'
        />

        <div className='relative w-full rounded-lg bg-white'>
          <div className='flex flex-col gap-6 px-7 pb-7'>
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group.timezone_type.id}
                  className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
                  onClick={() => handleShow(group.timezone_type.id)}
                >
                  {/* Header */}
                  <div className='font-inter flex items-center justify-between border-b border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800'>
                    {group.timezone_type.parameter_value}
                    <div
                      className='flex items-center gap-2'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DeleteButton
                        onClick={() => setSelectedTimeZone(group.metering_timezones[0])}
                      />
                      <AddButton
                        onClick={() => {
                          setSelectedType(group?.timezone_type)
                          setShowCreateModal(true)
                        }}
                      />
                    </div>
                  </div>

                  {/* Timezones row */}
                  <div className='flex w-full items-center gap-6 overflow-x-auto px-4 py-3 text-sm text-slate-700'>
                    {group.metering_timezones.map((tz) => (
                      <div
                        key={tz.metering_timezone_id}
                        className='flex min-w-[220px] flex-col'
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

            {/* Display timezone types without any metering timezones */}
            {timezoneTypesWithoutTimezones.length > 0 && (
              <>
                <div className='mt-4 border-t border-gray-200 pt-4'>
                  <h3 className='mb-3 text-sm font-semibold text-slate-700'>
                    Timezone Types don't have any metering timezones
                  </h3>
                </div>
                {timezoneTypesWithoutTimezones.map((type) => (
                  <div
                    key={type.id}
                    className='rounded-lg border border-gray-200 bg-white shadow-sm'
                  >
                    <div className='font-inter border-b border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800'>
                      {type.parameter_value}
                      <AddButton
                        onClick={() => {
                          setSelectedType(type)
                          setShowCreateModal(true)
                        }}
                      />
                    </div>
                    <div className='px-4 py-3 text-sm text-slate-500'>
                      No metering timezones configured
                    </div>
                  </div>
                ))}
              </>
            )}
            <Button
              onClick={() => {
                setSelectedDefinition(timezone_type_parameter)
                setShowAddModal(true)
              }}
              variant='secondary'
              label='Create new Timezone Group'
            />
          </div>
        </div>
        {showAddModal && selecedDefinition !== null && (
          <ParameterValueModal
            onClose={() => setShowAddModal(false)}
            definition={selecedDefinition}
            title='Time Zone Group'
          />
        )}
        {showCreateModal && selectedType !== null && (
          <MeterTimeZoneFormModal
            onClose={() => setShowCreateModal(false)}
            timezoneType={selectedType}
            timezoneNames={timezone_names}
            pricingTypes={pricing_types}
            timezoneNameParameter={timezone_name_parameter}
          />
        )}
      </div>
    </MainLayout>
  )
}
