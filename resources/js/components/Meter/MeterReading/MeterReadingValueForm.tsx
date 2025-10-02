import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Input from '@/ui/form/Input'

const rowLabels = ['Initial', 'Final', 'Diff']

interface Props {
  timeZoneNames: { id: number; name: string }[]
  values: { timezone_id: number; timezone_name: string; values: Record<string, any> }[]
  onChange: (rowKey: string, tzId: number, value: any) => void
}

export default function MeterReadingValueForm({
  timeZoneNames,
  values,
  onChange,
}: Readonly<Props>) {
  return (
    <div className='rounded border bg-white p-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {timeZoneNames.map((tz) => (
              <TableHead key={tz.id}>{tz.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowLabels.map((label) => {
            const rowKey = label.toLowerCase()
            return (
              <TableRow key={label}>
                <TableCell className='font-medium'>{label}</TableCell>
                {timeZoneNames.map((tz) => {
                  const tzData = values.find((r) => r.timezone_id === tz.id) || { values: {} }
                  const fieldValue = tzData.values[rowKey] ?? ''

                  return (
                    <TableCell key={tz.id}>
                      <Input
                        type='number'
                        value={fieldValue}
                        setValue={(val) => {
                          if (rowKey !== 'diff') onChange(rowKey, tz.id, val)
                        }}
                        required
                        disabled={rowKey === 'diff'}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
