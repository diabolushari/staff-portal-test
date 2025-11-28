import StrongText from '@/typography/StrongText'
import Card from '@/ui/Card/Card'
import { router } from '@inertiajs/react'
import { Cpu, Plus } from 'lucide-react'

export default function MeterReadingTab({
  meterReadings,
  connectionId,
}: Readonly<{ meterReadings: any[]; connectionId: number }>) {
  const handleAddMeterReading = () => {
    router.visit(route('meter-reading.create', { id: connectionId }))
  }
  return (
    <Card className='relative w-full rounded-lg bg-white'>
      <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
        <StrongText className='text-lg font-semibold text-gray-900'>
          Meter Reading Information
        </StrongText>
        <button
          onClick={handleAddMeterReading}
          className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
        >
          <Plus className='h-4 w-4' />
          Add Meter Reading
        </button>
      </div>
      <div className='flex flex-col px-6 pb-6'>
        {meterReadings && meterReadings.length > 0 ? (
          meterReadings?.map((meterReadingData) => {
            const { meterReading, relationship } = meterReadingData
            return <div>details here</div>
          })
        ) : (
          <div className='p-8 text-center text-slate-500'>
            <div className='flex flex-col items-center gap-2'>
              <Cpu className='h-12 w-12 text-slate-300' />
              <p className='text-lg font-medium'>No meters found</p>
              <p className='text-sm'>No meters are associated with this connection.</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
