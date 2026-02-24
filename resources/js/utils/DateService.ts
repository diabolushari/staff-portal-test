import { MeterConnectionMapping, MeterReadingValueGroup } from '@/interfaces/data_interfaces'
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
export const getMeterEnergisedDate = (
  meterMappings: MeterConnectionMapping[] = [],
  latestMeterReadingGroupByMeter?: MeterReadingValueGroup[],
  meters?: number[]
): string => {
  if (!meterMappings.length) return ''

  const selectedMeters = meterMappings.filter((m) => meters?.includes(m.meter_id))
  const meterIdsWithReading = latestMeterReadingGroupByMeter?.map((r) => r.meter?.meter_id) ?? []

  const metersWithoutReading = selectedMeters.filter(
    (m) => !meterIdsWithReading.includes(m.meter_id)
  )

  const earliestMeter = metersWithoutReading
    .filter((m) => m.energise_date && m.is_current && m.is_active)
    .sort((a, b) => dayjs(a.energise_date!).valueOf() - dayjs(b.energise_date!).valueOf())[0]

  return earliestMeter?.energise_date ? dayjs(earliestMeter.energise_date).format('YYYY-MM-DD') : ''
}
