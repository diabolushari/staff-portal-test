import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StationTransaction } from '@/interfaces/data_interfaces'
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
  const generatedUnits = transactions.reduce((sum, txn) => sum + (txn.txn_units || 0), 0)

  return (
    <div className='rounded-lg bg-white p-4'>
      {/* Generated Units Card */}
      <div className='mb-4 w-40 rounded-lg bg-gray-100 p-4 text-center'>
        <div className='text-sm text-gray-500'>Generated Units</div>
        <div className='text-xl font-bold'>{generatedUnits.toLocaleString()}</div>
      </div>

      {/* Transaction Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Source Zone</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Txn Units</TableHead>
            <TableHead>Unit Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((txn) => (
            <TableRow key={txn.txn_id}>
              <TableCell>
                {txn.txn_date ? dayjs(txn.txn_date).format('MMM DD, YYYY') : '-'}
              </TableCell>
              <TableCell>{txn.timezone?.parameter_value ?? '-'}</TableCell>
              <TableCell>{txn.txn_type?.parameter_value ?? '-'}</TableCell>
              <TableCell>{txn.txn_units ?? '-'}</TableCell>
              <TableCell>{txn.unit_balance ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
