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
import ErrorText from '@/typography/ErrorText'

interface Props {
  parameterReadingValues: TimezoneReadingState[]
  onChange: (tzId: number, value: string) => void
  meter: Meter
  profileParameter: MeterProfileParameter
  onToggleRotation: (tzId: number) => void
  errors: Record<string, string | undefined>
  maxReadingValue: number
}

export default function MeterReadingValueForm({
  parameterReadingValues,
  onChange,
  meter,
  profileParameter,
  onToggleRotation,
  maxReadingValue,
  errors,
}: Readonly<Props>) {
  return (
    <div className='rounded border bg-white p-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {parameterReadingValues?.map((tz) => (
              <TableHead key={tz.timezone_id}>{tz.timezone_name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {profileParameter.is_cumulative && (
            <TableRow>
              <TableCell className='font-medium'>Initial</TableCell>
              {parameterReadingValues?.map((tz) => (
                <React.Fragment key={tz.timezone_id}>
                  <TableCell>
                    <Input
                      type='number'
                      value={tz.values.initial}
                      setValue={() => {}}
                      max={maxReadingValue}
                      disabled
                    />
                    {errors?.[`${tz.timezone_id}.initial`] && (
                      <ErrorText>{errors[`${tz.timezone_id}.initial`]}</ErrorText>
                    )}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          )}
          <TableRow>
            <TableCell className='font-medium'>Rotation</TableCell>
            {parameterReadingValues.map((tz) => (
              <TableCell key={tz.timezone_id}>
                <input
                  type='checkbox'
                  checked={tz.isRotation}
                  onChange={() => onToggleRotation(tz.timezone_id)}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className='font-medium'>
              {profileParameter.is_cumulative ? 'Final' : 'Reading'}
            </TableCell>
            {parameterReadingValues?.map((tz) => (
              <React.Fragment key={tz.timezone_id}>
                <TableCell>
                  <Input
                    type='number'
                    value={tz.values.final}
                    setValue={(val) => onChange(tz.timezone_id, val)}
                    max={maxReadingValue}
                  />
                  {errors?.[`${tz.timezone_id}.final`] && (
                    <ErrorText>{errors[`${tz.timezone_id}.final`]}</ErrorText>
                  )}
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
          {profileParameter.is_cumulative && (
            <TableRow>
              <TableCell className='font-medium'>Diff</TableCell>
              {parameterReadingValues?.map((tz) => (
                <React.Fragment key={tz.timezone_id}>
                  <TableCell>
                    <Input
                      type='number'
                      value={tz.values.diff}
                      setValue={() => {}}
                      disabled
                    />
                    {errors?.[`${tz.timezone_id}.diff`] && (
                      <ErrorText>{errors[`${tz.timezone_id}.diff`]}</ErrorText>
                    )}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          )}
          <TableRow>
            <TableCell className='font-medium'>
              {profileParameter.is_export ? 'Export' : 'Import'} (MF: {meter.meter_mf})
            </TableCell>
            {parameterReadingValues?.map((tz) => (
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
