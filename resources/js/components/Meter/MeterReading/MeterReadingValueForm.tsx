import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Meter } from '@/interfaces/data_interfaces'
import Input from '@/ui/form/Input'
import React from 'react'
import { TimezoneReadingState } from './ReadingForm/useMeterReadingForm'

interface Props {
  values: TimezoneReadingState[]
  onChange: (tzId: number, value: string) => void
  meter: Meter
}

export default function MeterReadingValueForm({ values, onChange, meter }: Readonly<Props>) {
  return (
    <div className='rounded border bg-white p-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {values?.map((tz) => <TableHead key={tz.timezone_id}>{tz.timezone_name}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='font-medium'>Initial</TableCell>
            {values?.map((tz) => (
              <React.Fragment key={tz.timezone_id}>
                <TableCell>
                  <Input
                    type='number'
                    value={tz.values.initial}
                    setValue={() => {}}
                    disabled
                  />
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Final</TableCell>
            {values?.map((tz) => (
              <React.Fragment key={tz.timezone_id}>
                <TableCell>
                  <Input
                    type='number'
                    value={tz.values.final}
                    setValue={(val) => onChange(tz.timezone_id, val)}
                  />
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Diff</TableCell>
            {values?.map((tz) => (
              <React.Fragment key={tz.timezone_id}>
                <TableCell>
                  <Input
                    type='number'
                    value={tz.values.diff}
                    setValue={() => {}}
                    disabled
                  />
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className='font-medium'>Reading (MF: {meter.meter_mf})</TableCell>
            {values?.map((tz) => (
              <React.Fragment key={tz.timezone_id}>
                <TableCell>
                  <Input
                    type='number'
                    value={tz.values.value}
                    setValue={() => {}}
                    disabled
                  />
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
