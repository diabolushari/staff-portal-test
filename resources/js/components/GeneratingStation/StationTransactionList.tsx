import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StationTransaction } from '@/interfaces/data_interfaces'
import { tr } from 'date-fns/locale'
import dayjs from 'dayjs'

interface Props {
  transactions: StationTransaction[]
}

export default function StationTransactionTable({ transactions }: Props) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>
        No Transactions Found
      </div>
    )
  }

  // Compute only Generated Units
  //const generatedUnits = transactions.reduce((sum, txn) => sum + (txn.txn_units || 0), 0)
  const generatedUnits = transactions
    .filter((txn) => txn.txn_type?.parameter_code === 'GEN_CREDIT')
    .reduce((sum, txn) => sum + (txn.txn_units || 0), 0)

  const adjustedUnits = transactions
    .filter((txn) => txn.txn_direction?.trim().toUpperCase() === 'D')
    .reduce((sum, txn) => sum + (txn.pre_conversion_units || 0), 0)
  console.log(transactions)

  return (
    <div className='rounded-lg bg-white p-4'>
      {/* Generated Units Card */}
      {/* <div className='mb-4 w-40 rounded-lg border bg-white p-4 text-center shadow-sm'>
        <div className='text-sm font-semibold text-green-600'>+ Generated Units</div>
        <div className='text-xl font-bold text-green-600'>{generatedUnits.toLocaleString()}</div>
      </div> */}
      <div className='mb-4 flex gap-4'>
        {/* Generated Units Card */}
        <div className='w-40 rounded-lg border bg-white p-4 text-center shadow-sm'>
          <div className='text-sm font-semibold text-green-600'>Generated Units</div>
          <div className='text-xl font-bold text-green-700'>{generatedUnits.toLocaleString()}</div>
        </div>

        {/* Adjusted Units Card */}
        <div className='w-40 rounded-lg border bg-white p-4 text-center shadow-sm'>
          <div className='text-sm font-semibold text-blue-800'>Adjusted Units</div>
          <div className='text-xl font-bold'>{adjustedUnits.toLocaleString()}</div>
        </div>
      </div>

      {/* Transaction Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Adjusted To</TableHead>
            <TableHead>Source Zone</TableHead>

            <TableHead>Target Zone</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Adjusted Units</TableHead>
            <TableHead>Conversion Factor</TableHead>
            {/* <TableHead>Txn Units</TableHead>
            <TableHead>Unit Balance</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((txn) => {
            const direction = txn.txn_direction?.trim().toUpperCase()

            const sourceZone =
              direction === 'D'
                ? txn.timezone?.parameter_value
                : txn.source_timezone?.parameter_value

            const targetZone =
              direction === 'D'
                ? txn.source_timezone?.parameter_value
                : txn.timezone?.parameter_value

            return (
              <TableRow key={txn.txn_id}>
                <TableCell>
                  {txn.txn_date ? dayjs(txn.txn_date).format('MMM DD, YYYY') : '-'}
                </TableCell>

                <TableCell>{txn.txn_type?.parameter_value ?? '-'}</TableCell>

                <TableCell>{txn.consumer_connection?.consumer_number ?? '-'}</TableCell>

                <TableCell>{sourceZone ?? '-'}</TableCell>
                <TableCell>{targetZone ?? '-'}</TableCell>

                <TableCell>{direction === 'C' ? 'C' : 'D'}</TableCell>

                <TableCell>
                  {(() => {
                    //const isGen = txn.txn_type?.parameter_code === 'GEN_CREDIT'
                    // const value = isGen ? txn.txn_units : txn.pre_conversion_units
                    const isGen = txn.txn_type?.parameter_code === 'GEN_CREDIT'
                    const isInterZone = txn.txn_type?.parameter_code?.includes('INTER_ZONE')

                    let value = null

                    if (isGen) {
                      value = txn.txn_units
                    } else if (isInterZone) {
                      value = direction === 'D' ? txn.pre_conversion_units : txn.txn_units
                    } else {
                      value = txn.txn_units
                    }

                    if (value == null) return '-'

                    const isPositive = isGen || direction === 'C'

                    return (
                      <span
                        className={
                          isPositive ? 'font-semibold text-green-600' : 'font-semibold text-red-600'
                        }
                      >
                        {isPositive ? '+' : '-'}
                        {value}
                      </span>
                    )
                  })()}
                </TableCell>

                <TableCell>{txn.conversion_factor ?? '-'}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
