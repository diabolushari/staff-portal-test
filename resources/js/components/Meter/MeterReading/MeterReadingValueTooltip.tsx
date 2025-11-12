import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Props {
  meterId: number
  readingsByMeter: any[]
  parameterId: number // ✅ pass the specific parameter
}

const rowLabels = ['initial', 'final', 'diff']

export default function MeterReadingValueTooltip({ meterId, readingsByMeter, parameterId }: Props) {
  const meterData = readingsByMeter?.find((m) => m.meter_id === meterId)
  if (!meterData) {
    return <div className='p-2 text-xs text-gray-500'>No data available</div>
  }

  const paramData = meterData?.parameters?.find((p: any) => p.meter_parameter_id === parameterId)
  if (!paramData) {
    return <div className='p-2 text-xs text-gray-500'>No data available</div>
  }

  return (
    <div className='max-h-64 overflow-auto rounded-md bg-blue-100 p-2'>
      <div className='mb-1 text-xs font-semibold text-gray-700'>{paramData.display_name}</div>
      <Table className='text-xs'>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {paramData?.readings?.map((tz: any) => (
              <TableHead
                key={tz?.timezone_id}
                className='text-center'
              >
                {tz?.timezone_name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowLabels.map((rowKey) => (
            <TableRow key={rowKey}>
              <TableCell className='text-center font-medium text-black'>
                {rowKey.charAt(0).toUpperCase() + rowKey.slice(1)}
              </TableCell>
              {paramData?.readings?.map((tz: any) => (
                <TableCell
                  key={tz?.timezone_id}
                  className='text-center text-gray-800'
                >
                  {tz?.values?.[rowKey] ?? ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
