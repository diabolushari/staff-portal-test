import { Card } from '@/components/ui/card'
import { SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'
import { Wallet, ShieldCheck } from 'lucide-react'

interface Props {
  sdRegister?: SdRegister
}

const BalanceDetailCard = ({ sdRegister }: Props) => {
  const availableBalance =
    sdRegister?.sd_demand?.collections?.reduce(
      (total, collection) => total + Number(collection.collection_amount),
      0
    ) || 0

  const bankGuaranteeCollection =
    sdRegister?.sd_demand?.collections
      ?.filter((collection) => collection.payment_mode?.parameter_value === 'BANK_GUARANTEE')
      ?.reduce((total, collection) => total + Number(collection.collection_amount), 0) || 0
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {/* Available Balance */}
      <Card className='flex items-start gap-4 rounded-xl p-6'>
        <div className='rounded-md bg-gray-100 p-2'>
          <Wallet className='text-kseb-primary-600 h-5 w-5' />
        </div>

        <div>
          <p className='mb-1 text-sm text-gray-500'>Available Balance</p>
          <p className='text-kseb-primary-600 text-2xl font-semibold'>₹{availableBalance}</p>
        </div>
      </Card>

      {/* Bank Guarantee */}
      <Card className='flex items-start gap-4 rounded-xl p-6'>
        <div className='rounded-md bg-gray-100 p-2'>
          <ShieldCheck className='text-kseb-primary-600 h-5 w-5' />
        </div>

        <div>
          <p className='mb-1 text-sm text-gray-500'>Bank Guarantee</p>
          <p className='text-2xl font-semibold text-gray-800'>₹{bankGuaranteeCollection}</p>
          <p className='mt-1 text-xs text-gray-400'>
            Exp: {sdRegister?.bg_expiry_date ? getDisplayDate(sdRegister.bg_expiry_date) : '--'}
          </p>
        </div>
      </Card>
    </div>
  )
}

export default BalanceDetailCard
