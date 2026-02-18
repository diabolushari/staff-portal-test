import { MeterConnectionMapping } from '@/interfaces/data_interfaces'
import dayjs from 'dayjs'

export const getNextDay = (dateStr: string) => {
  if (!dateStr) {
    return ''
  }
  const date = dayjs(dateStr)
  return date.add(1, 'day').format('YYYY-MM-DD')
}
export const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export const getMonthEnd = (dateStr: string, isFirstReading: boolean) => {
  if (!dateStr) return ''

  // First reading use the same date
  if (isFirstReading) {
    return dayjs(dateStr).format('YYYY-MM-DD')
  }

  // Not first reading end of that month
  return dayjs(dateStr).endOf('month').format('YYYY-MM-DD')
}
export const getMeterEnergisedDate = (meterMappings: MeterConnectionMapping[] = []): string => {
  if (!meterMappings.length) return ''

  // 1️⃣ Try ENERGY_CONSUMPTION meter first
  const energyMeter = meterMappings.find(
    (m) =>
      m.meter_use_category?.parameter_value?.toLowerCase() === 'energy consumption' &&
      m.energise_date
  )

  if (energyMeter?.energise_date) {
    return dayjs(energyMeter.energise_date).format('YYYY-MM-DD')
  }

  // 2️⃣ Otherwise take the first energised_date
  const latestMeter = meterMappings
    .filter((m) => m.energise_date)
    .sort((a, b) => dayjs(a.energise_date!).valueOf() - dayjs(b.energise_date!).valueOf())[0]

  return latestMeter?.energise_date ? dayjs(latestMeter.energise_date).format('YYYY-MM-DD') : ''
}
