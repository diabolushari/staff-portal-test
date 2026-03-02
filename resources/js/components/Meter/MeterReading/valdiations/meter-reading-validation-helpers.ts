import { MeterConnectionMapping } from '@/interfaces/data_interfaces'
import dayjs from 'dayjs'

export function getMeterMappingForPeriod(
  mappings: MeterConnectionMapping[],
  start: string,
  end: string
): MeterConnectionMapping[] {
  const startDate = dayjs(start)
  const endDate = dayjs(end)

  if (!startDate.isValid() || !endDate.isValid()) {
    return []
  }

  return mappings
    .filter((mapping) => mapping.effective_start_ts != mapping.effective_end_ts)
    .filter((mapping) => {
      const mappingStart =
        mapping.effective_start_ts == null ? null : dayjs(mapping.effective_start_ts)
      const mappingEnd = mapping.effective_end_ts == null ? null : dayjs(mapping.effective_end_ts)

      if (mappingStart == null) {
        return false
      }

      return mappingStart.isBefore(endDate) && (mappingEnd == null || mappingEnd.isAfter(startDate))
    })
}
