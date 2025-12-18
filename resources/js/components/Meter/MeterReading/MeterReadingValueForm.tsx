import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Meter, MeterProfileParameter } from '@/interfaces/data_interfaces'
import Input from '@/ui/form/Input'
import React from 'react'
import { TimezoneReadingState } from './ReadingForm/useMeterReadingForm'

interface Props {
  values: TimezoneReadingState[]
  onChange: (tzId: number, value: string) => void
  meter: Meter
  profileParameter: MeterProfileParameter
}

export default function MeterReadingValueForm({
  values,
  onChange,
  meter,
  profileParameter,
}: Readonly<Props>) {
  const integerDigits = meter.digit_count ?? 0
  const decimalDigits = meter.decimal_digit_count ?? 0

  const maxValue =
    Number('9'.repeat(integerDigits)) +
    (decimalDigits > 0 ? Number(`0.${'9'.repeat(decimalDigits)}`) : 0)

  const stepValue = decimalDigits > 0 ? Number(`0.${'0'.repeat(decimalDigits - 1)}1`) : 1

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
          {profileParameter.is_cumulative && (
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
          )}
          <TableRow>
            <TableCell className='font-medium'>
              {profileParameter.is_cumulative ? 'Final' : 'Reading'}
            </TableCell>
            {values?.map((tz) => (
              <React.Fragment key={tz.timezone_id}>
                <TableCell>
                  <Input
                    type='number'
                    value={tz.values.final}
                    setValue={(val) => onChange(tz.timezone_id, val)}
                    max={maxValue}
                  />
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
          {profileParameter.is_cumulative && (
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
          )}
          <TableRow>
            <TableCell className='font-medium'>
              {profileParameter.is_export ? 'Export' : 'Import'} (MF: {meter.meter_mf})
            </TableCell>
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
