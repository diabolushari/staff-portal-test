import { Card } from '@/components/ui/card'
import { SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'
import { FileText, Banknote, Undo2 } from 'lucide-react'

interface Props {
  sdRegister?: SdRegister
}

const LatestUpdateDetailCard = ({ sdRegister }: Props) => {
  return (
    <Card className='rounded-xl p-6'>
      <div className='space-y-6'>
        {/* Latest Demand */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 text-gray-600'>
            <FileText className='h-5 w-5' />
            <span className='text-sm font-medium'>Latest Demand</span>
          </div>

          <div className='text-right'>
            <p className='text-sm font-semibold text-gray-800'>
              ₹{sdRegister?.sd_demand?.total_sd_amount}
            </p>
            <p className='text-xs text-gray-400'>{getDisplayDate(sdRegister?.generated_date)}</p>
          </div>
        </div>

        {/* Latest Collection */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 text-gray-600'>
            <Banknote className='h-5 w-5' />
            <span className='text-sm font-medium'>Latest Collection</span>
          </div>

          <div className='text-right'>
            <p className='text-sm font-semibold text-green-600'>₹2,550</p>
            <p className='text-xs text-gray-400'>20 Sep 2023</p>
          </div>
        </div>

        {/* Latest Refund */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 text-gray-600'>
            <Undo2 className='h-5 w-5' />
            <span className='text-sm font-medium'>Latest Refund</span>
          </div>

          <div className='text-right'>
            <p className='text-sm font-semibold text-orange-500'>₹0.00</p>
            <p className='text-xs text-gray-400'>--</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default LatestUpdateDetailCard
