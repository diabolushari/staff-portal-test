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

export const getMonthEnd = (
  dateStr: string,
  isFirstReading: boolean,
  meterConnectionMappings?: MeterConnectionMapping[]
) => {
  if (!dateStr) return ''

  const inputDate = dayjs(dateStr)

  if (isFirstReading) {
    return inputDate.format('YYYY-MM-DD')
  }

  const monthEnd = inputDate.endOf('month')

  const validEndDates =
    meterConnectionMappings
      ?.map((m) => m.effective_end_ts)
      .filter(Boolean)
      .map((d) => dayjs(d)) ?? false

  if (!validEndDates || validEndDates.length === 0) {
    return monthEnd.format('YYYY-MM-DD')
  }

  const lowestEndDate = validEndDates.reduce((min, current) =>
    current.isBefore(min) ? current : min
  )
  if (lowestEndDate.isAfter(monthEnd)) {
    return monthEnd.format('YYYY-MM-DD')
  }

  return lowestEndDate.format('YYYY-MM-DD')
}
export const getMeterEnergisedDate = (meterMappings: MeterConnectionMapping[] = []): string => {
  if (!meterMappings.length) return ''

  const energyMeter = meterMappings.find(
    (m) =>
      m.meter_use_category?.parameter_value?.toLowerCase() === 'energy consumption' &&
      m.energise_date
  )

  if (energyMeter?.energise_date) {
    return dayjs(energyMeter.energise_date).format('YYYY-MM-DD')
  }

  const latestMeter = meterMappings
    .filter((m) => m.energise_date)
    .sort((a, b) => dayjs(a.energise_date!).valueOf() - dayjs(b.energise_date!).valueOf())[0]

  return latestMeter?.energise_date ? dayjs(latestMeter.energise_date).format('YYYY-MM-DD') : ''
}
