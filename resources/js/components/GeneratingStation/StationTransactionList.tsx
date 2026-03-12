import { Zap, Hash, Layers, Calendar } from 'lucide-react'
import { StationTransaction } from '@/interfaces/data_interfaces'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

interface Props {
  transactions: StationTransaction[]
}

export default function StationTransactionList({ transactions }: Props) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>
        No Transactions Found
      </div>
    )
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {transactions.map((txn) => (
          <div
            key={txn.txn_id}
            className='mb-4 rounded-lg border border-gray-200 px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex flex-col gap-3 p-[10px]'>
              {/* Header */}
              <div className='font-semibold text-black'>
                {txn.txn_group_ref} |{' '}
                {dayjs(txn.bill_year_month?.toString(), 'YYYYMM').format('MMM YYYY')}
              </div>

              {/* Row 1 */}
              <div className='flex flex-wrap gap-5'>
                {/* <div className='flex items-center gap-1'>
                  <Hash className='h-3.5 w-3.5 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    Bill Month:{' '}
                    {dayjs(txn.bill_year_month?.toString(), 'YYYYMM').format('MMM YYYY')}
                  </span>
                </div> */}

                <div className='flex items-center gap-1'>
                  <Hash className='h-3.5 w-3.5 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    Txn Type: {txn.txn_type?.parameter_value ?? '-'}
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className='flex flex-wrap gap-5'>
                <div className='flex items-center gap-1'>
                  <Layers className='h-3.5 w-3.5 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    Zone: {txn.timezone?.parameter_value ?? '-'}
                  </span>
                </div>

                <div className='flex items-center gap-1'>
                  <Zap className='h-3.5 w-3.5 text-gray-500' />
                  <span className='text-sm text-gray-600'>Units: {txn.txn_units ?? '-'}</span>
                </div>

                <div className='flex items-center gap-1'>
                  <Zap className='h-3.5 w-3.5 text-gray-500' />
                  <span className='text-sm text-gray-600'>Balance: {txn.unit_balance ?? '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
