import { Card } from '@/components/ui/card'

interface Props {
  powerFactorsByMeter: any
  meterId: number
}

export default function PowerFactorBar({ powerFactorsByMeter }: Props) {
  if (!powerFactorsByMeter || powerFactorsByMeter.factors === null) return null
  console.log(powerFactorsByMeter)
  return (
    <div className='mb-4 flex space-x-4 overflow-x-auto pb-2'>
      {powerFactorsByMeter.factors.map((pf: any) => (
        <Card
          key={pf.timezone_name}
          className='min-w-[140px] flex-shrink-0 border border-gray-300 bg-gradient-to-b from-white to-gray-50 p-3 text-center shadow-sm'
        >
          <strong>{pf.timezone_name}</strong>
          <div className='text-lg font-bold text-blue-700'>{pf.pf}</div>
        </Card>
      ))}
    </div>
  )
}
