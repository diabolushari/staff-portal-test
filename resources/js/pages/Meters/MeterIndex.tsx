import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { router } from '@inertiajs/react'
import { Barcode, Calendar, Cpu, Factory, Shield } from 'lucide-react'
import { Meter } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import { BreadcrumbItem } from '@/types'
import { ParameterValues } from '@/interfaces/parameter_types'
import MeterSearch from '@/components/Meter/MeterSearch'

interface Props {
  oldMeterSerial: string
  oldSmartMeterInd: boolean
  oldBidirectionalInd: boolean
  oldMeterTypeId: string
  oldMeterProfileId: string
  oldMeterMakeId: string
  oldOwnershipTypeId: string
  oldProgrammableCtRatio: string
  oldProgrammablePtRatio: string
  oldSortBy: string
  oldSortDirection: string
  meters: Paginator<Meter>
  types: ParameterValues[]
  meterProfiles: ParameterValues[]
  ownershipTypes: ParameterValues[]
}

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
    title: 'Meters',
    href: '/meters',
  },
]

const handleShow = (id: number) => {
  router.get(`/meters/${id}`)
}

export default function MeterIndex({
  oldMeterSerial,
  oldSmartMeterInd,
  oldBidirectionalInd,
  oldMeterTypeId,
  oldMeterProfileId,
  oldMeterMakeId,
  oldOwnershipTypeId,
  oldProgrammableCtRatio,
  oldProgrammablePtRatio,
  meters,
  types,
  meterProfiles,
  ownershipTypes,
}: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Meters'
      addBtnText='Meter'
      addBtnUrl={route('meters.create')}
      title='Meters'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <MeterSearch
          oldMeterSerial={oldMeterSerial}
          oldSmartMeterInd={oldSmartMeterInd}
          oldBidirectionalInd={oldBidirectionalInd}
          oldMeterTypeId={oldMeterTypeId}
          oldMeterProfileId={oldMeterProfileId}
          oldMeterMakeId={oldMeterMakeId}
          oldOwnershipTypeId={oldOwnershipTypeId}
          oldProgrammableCtRatio={oldProgrammableCtRatio}
          oldProgrammablePtRatio={oldProgrammablePtRatio}
          types={types}
          meterProfiles={meterProfiles}
          ownershipTypes={ownershipTypes}
        />

        <div className='relative w-full rounded-lg bg-white'>
          <div className='flex flex-col px-7 pb-7'>
            {meters && meters?.data?.length > 0 ? (
              meters?.data?.map((meter) => (
                <button
                  key={meter.meter_id}
                  onClick={() => handleShow(meter.meter_id)}
                  className='mb-4 w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] text-left transition-shadow last:mb-0 hover:shadow-md'
                >
                  <div className='flex items-start justify-between'>
                    {/* Left side info */}
                    <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                      <div className='flex flex-col gap-1'>
                        {/* Serial + Seal */}
                        <div className='flex items-center gap-2'>
                          <div className='font-inter text-base font-semibold text-black'>
                            {meter.meter_serial}
                          </div>
                          {meter.company_seal_num && (
                            <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                              <div className='font-inter text-xs text-blue-800'>
                                Seal: {meter.company_seal_num}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Meter Type + Make */}
                        <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                          {meter.meter_type && (
                            <div className='flex items-center gap-1'>
                              <Cpu className='h-3.5 w-3.5 text-slate-500' />
                              {meter.meter_type.parameter_value}
                            </div>
                          )}
                          {meter.meter_make && (
                            <div className='flex items-center gap-1'>
                              <Factory className='h-3.5 w-3.5 text-slate-500' />
                              {meter.meter_make.parameter_value}
                            </div>
                          )}
                        </div>

                        {/* Accuracy class + ownership */}
                        <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                          {meter.accuracy_class && (
                            <div className='flex items-center gap-1'>
                              <Shield className='h-3.5 w-3.5 text-slate-500' />
                              Accuracy: {meter.accuracy_class.parameter_value}
                            </div>
                          )}
                          {meter.ownership_type && (
                            <div className='flex items-center gap-1'>
                              <Barcode className='h-3.5 w-3.5 text-slate-500' />
                              Owner: {meter.ownership_type.parameter_value}
                            </div>
                          )}
                        </div>

                        {/* Dates */}
                        <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                          {meter.manufacture_date && (
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-3.5 w-3.5 text-slate-500' />
                              Mfg: {meter.manufacture_date}
                            </div>
                          )}
                          {meter.supply_date && (
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-3.5 w-3.5 text-slate-500' />
                              Supply: {meter.supply_date}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side status */}
                    <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                      <div
                        className={`rounded-[50px] px-2.5 py-px ${
                          meter.smart_meter_ind ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <div
                          className={`font-inter text-xs font-normal ${
                            meter.smart_meter_ind ? 'text-green-700' : 'text-red-700'
                          }`}
                        >
                          {meter.smart_meter_ind ? 'Smart' : 'Normal'}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className='p-6 text-center text-slate-500'>
                <p>No meters found.</p>
              </div>
            )}
            <Pagination
              pagination={meters}
              filters={{
                meter_serial: oldMeterSerial,
                smart_meter_ind: oldSmartMeterInd,
                bidirectional_ind: oldBidirectionalInd,
                meter_type_id: oldMeterTypeId,
                meter_profile_id: oldMeterProfileId,
                meter_make_id: oldMeterMakeId,
                ownership_type_id: oldOwnershipTypeId,
                programmable_ct_ratio: oldProgrammableCtRatio,
                programmable_pt_ratio: oldProgrammablePtRatio,
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
