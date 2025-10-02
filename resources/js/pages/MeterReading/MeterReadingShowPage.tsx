import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

export default function MeterReadingShowPage({ meterReading }: { meterReading: any }) {
  const breadcrumb: BreadcrumbItem[] = [
    { title: 'Meter Reading', href: '/meter-reading' },
    { title: 'Show', href: '/meter-reading/show' },
  ]

  console.log('MeterReading Data:', meterReading)

  // Group readings by parameter_id
  const grouped = meterReading?.values?.reduce((acc: any, reading: any) => {
    const paramId = reading.parameter_id
    const paramName = reading.meter_profile_parameter?.display_name || `Parameter ${paramId}`

    if (!acc[paramId]) {
      acc[paramId] = { name: paramName, readings: [] }
    }

    acc[paramId].readings.push(reading)
    return acc
  }, {})

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <div className='flex flex-col gap-6'>
        <h1 className='text-2xl font-bold'>Meter Reading</h1>
        <p className='text-sm text-gray-500'>
          Date: {meterReading.metering_date} (From {meterReading.reading_start_date} to{' '}
          {meterReading.reading_end_date})
        </p>

        {grouped &&
          Object.entries(grouped).map(([paramId, param]: any) => (
            <div
              key={paramId}
              className='rounded-lg border p-4 shadow'
            >
              <h3 className='mb-2 text-lg font-bold'>{param.name}</h3>

              <table className='w-full table-auto border-collapse border border-gray-300'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='border px-4 py-2 text-left'>Timezone</th>
                    <th className='border px-4 py-2 text-left'>Initial</th>
                    <th className='border px-4 py-2 text-left'>Final</th>
                    <th className='border px-4 py-2 text-left'>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {param.readings.map((reading: any, i: number) => (
                    <tr key={i}>
                      <td className='border px-4 py-2'>{reading.time_zone?.parameter_value}</td>
                      <td className='border px-4 py-2'>{reading.initial_reading}</td>
                      <td className='border px-4 py-2'>{reading.final_reading}</td>
                      <td className='border px-4 py-2'>{reading.difference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </MainLayout>
  )
}
