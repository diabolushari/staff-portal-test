import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Bill, Connection } from '@/interfaces/data_interfaces'
import NormalText from '@/typography/NormalText'
import { getDisplayDate } from '@/utils'

export default function BillSummary({ bill, connection }: { bill: Bill; connection: Connection }) {
  return (
    <Table className=''>
      <TableBody>
        <TableRow>
          <TableCell className='border border-black font-mono'>Cons#</TableCell>
          <TableCell className='border border-black font-bold'>
            {connection?.consumer_number ?? '-'}
          </TableCell>
          <TableCell className='border border-black font-mono'>Bill Date</TableCell>
          <TableCell className='border border-black font-bold'>
            {getDisplayDate(bill?.bill_date) ?? '-'}
          </TableCell>
          <TableCell className='border border-black font-mono'>Due Date</TableCell>
          <TableCell className='border border-black font-bold'>
            {getDisplayDate(bill?.due_date) ?? '-'}
          </TableCell>
          <TableCell className='border border-black font-mono'>DC Date</TableCell>
          <TableCell className='border border-black font-bold'>
            {getDisplayDate(bill?.dc_date) ?? '-'}
          </TableCell>
          <TableCell className='border border-black font-mono'>Bill.No</TableCell>
          <TableCell
            colSpan={2}
            className='border border-black font-bold'
          >
            {bill?.bill_id ?? '-'}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className='border border-black'>LCN</TableCell>
          <TableCell className='border border-black'>
            {connection?.consumer_legacy_code ?? '-'}
          </TableCell>
          <TableCell className='border border-black'>Tariff</TableCell>
          <TableCell
            colSpan={4}
            className='border border-black'
          >
            {connection?.tariff?.parameter_value ?? '-'}
          </TableCell>
          <TableCell className='border border-black'>CD</TableCell>
          <TableCell className='border border-black'>
            {' '}
            {connection?.contract_demand_kva_val ?? '-'}
          </TableCell>
          <TableCell className='border border-black'>BG</TableCell>
          <TableCell className='border border-black'>--</TableCell>
        </TableRow>
        {/* Address + Virtual Account + GSTIN */}
        <TableRow>
          {/* LEFT: Address (3 rows high) */}
          <TableCell
            rowSpan={3}
            colSpan={5}
            className='border border-black align-top text-sm'
          >
            {connection?.consumer_profiles?.[0]?.organization_name ?? '-'} <br />
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
              ?.address_line1 ?? '-'}
            {', '}
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
              ?.address_line2 ?? '-'}
            <br />
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
              ?.city_town_village ?? '-'}
            {', '}
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address?.district
              ?.name ?? '-'}
            <br />
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address?.state
              ?.name ?? '-'}
            {' - '}
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address?.pincode ??
              '-'}
            <br />
            {connection?.consumer_profiles?.[0]?.contact_person ?? '-'}
            {' , '}
            Phone: {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.primary_phone ?? '-'}
          </TableCell>

          {/* RIGHT: Virtual Account */}
          <TableCell
            colSpan={6}
            className='border border-black text-sm'
          >
            <NormalText>Virtual Account No:</NormalText>{' '}
            {connection?.consumer_profiles?.[0]?.virtual_account_number ?? '-'}
          </TableCell>
        </TableRow>

        <TableRow>
          {/* RIGHT: Consumer GSTIN */}
          <TableCell
            colSpan={6}
            className='border border-black text-sm'
          >
            <NormalText>Consumer GSTIN:</NormalText>{' '}
            {connection?.consumer_profiles?.[0]?.consumer_gstin ?? '-'}
          </TableCell>
        </TableRow>

        <TableRow></TableRow>
      </TableBody>
    </Table>
  )
}
