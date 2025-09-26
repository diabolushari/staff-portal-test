import { meterNavItems } from '@/components/Navbar/navitems'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import CardHeader from '@/ui/Card/CardHeader'
import ListSearch from '@/ui/Search/ListSearch'
import { router } from '@inertiajs/react'
import { Barcode, Calendar, Cpu, Factory, Shield } from 'lucide-react'

export interface Meter {
  meter_id: number
  meter_serial: string
  company_seal_num: string | null
  manufacture_date: string | null
  supply_date: string | null
  accuracy_class?: ParameterValues
  meter_type?: ParameterValues
  meter_make?: ParameterValues
  ownership_type?: ParameterValues
  meter_unit?: ParameterValues

  smart_meter_ind?: boolean
}

interface Props {
  meters: Meter[]
}

export default function MeterIndex({ meters }: Props) {
  function handleShow(id: number) {
    router.get(`/meters/${id}`)
  }

  return (
    <MainLayout navItems={meterNavItems}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title='Meters search'
          placeholder='Enter meter serial'
          url={route('meters.index')}
        />

        <div className='relative w-full rounded-lg bg-white'>
          <CardHeader title='Meter Info' />

          <div className='flex flex-col px-7 pb-7'>
            {meters && meters.length > 0 ? (
              meters.map((meter) => (
                <div
                  key={meter.meter_id}
                  onClick={() => handleShow(meter.meter_id)}
                  className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
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
                </div>
              ))
            ) : (
              <div className='p-6 text-center text-slate-500'>
                <p>No meters found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
