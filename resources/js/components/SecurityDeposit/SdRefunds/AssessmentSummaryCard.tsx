import { Card } from '@/components/ui/card'
import { SdBalanceSummary, SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'

interface Props {
  balanceSummary: SdBalanceSummary
  sdRegister: SdRegister
  isRefundCard?: boolean
  isCollectionCard?: boolean
}

const AssessmentSummaryCard = ({
  balanceSummary,
  sdRegister,
  isRefundCard = false,
  isCollectionCard = false,
}: Props) => {
  const diffAmount =
    Number(balanceSummary.sd_principal_on_file) - Number(sdRegister.sd_demand?.total_sd_amount)

  const refund = diffAmount > 0 ? diffAmount : 0
  const collection = diffAmount < 0 ? diffAmount : 0

  return (
    <Card className='w-full max-w-md rounded-xl border bg-gray-50 p-5'>
      <h1 className='mb-4 text-xs font-semibold tracking-widest text-gray-500'>
        ASSESSMENT SUMMARY
      </h1>

      <div className='space-y-3 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-500'>SD Demand</span>
          <span className='font-semibold text-gray-800'>
            ₹ {sdRegister.sd_demand?.total_sd_amount}
          </span>
        </div>

        <div className='flex justify-between'>
          <span className='text-gray-500'>SD Available</span>
          <span className='font-semibold text-gray-800'>
            ₹ {balanceSummary.sd_principal_on_file}
          </span>
        </div>

        <div className='flex justify-between'>
          <span className='text-gray-500'>Assessment Date</span>
          <span className='font-semibold text-gray-800'>
            {getDisplayDate(sdRegister.generated_date)}
          </span>
        </div>
        {isRefundCard && (
          <div className='flex justify-between'>
            <span className='font-medium text-gray-500'>Total Refund</span>
            <span className='text-kseb-primary text-base font-bold'>₹ {refund}</span>
          </div>
        )}
        {isCollectionCard && (
          <div className='flex justify-between'>
            <span className='font-medium text-gray-500'>Total Collection</span>
            <span className='text-kseb-primary text-base font-bold'>₹ {collection}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default AssessmentSummaryCard
