import { Card } from '@/components/ui/card'
import { MeterReadingValue } from '@/interfaces/data_interfaces'

interface Props {
  meterReadings: MeterReadingValue[]
}

export default function MeterReadingCard({ meterReadings }: Props) {
  return (
    <div>
      <Card>helow</Card>
    </div>
  )
}
