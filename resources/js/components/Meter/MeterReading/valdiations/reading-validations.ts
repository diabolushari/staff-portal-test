import { MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { MeterReadingFormState } from '@/components/Meter/MeterReading/ReadingForm/useMeterReadingForm'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'

export const verifyFinalReadingDigits = (value: string, intDigits: number, decDigits: number) => {
  if (value === '') return true

  const regex =
    decDigits > 0
      ? new RegExp(`^\\d{0,${intDigits}}(\\.\\d{0,${decDigits}})?$`)
      : new RegExp(`^\\d{0,${intDigits}}$`)

  return regex.test(value)
}

export function verifyApparentEnergy(
  timeZoneId: number,
  parameterName: string,
  value: number,
  meterInfo: MeterWithTimezoneAndProfile,
  meterReadingValues: MeterReadingFormState[]
) {
  const otherParameterName =
    parameterName.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase()
      ? DEMAND_PARAMETER_NAME.toLowerCase()
      : CONSUMPTION_PARAMETER_NAME.toLowerCase()

  const otherParameter = meterInfo.reading_parameters.find(
    (p) => p.name?.toLowerCase() === otherParameterName
  )

  if (otherParameter == null) {
    return true
  }

  const meterReading = meterReadingValues.find(
    (meterReading) => meterReading.meter_id === meterInfo.meter_id
  )

  if (meterReading == null) {
    return true
  }

  const otherParameterReading = meterReading.parameters.find(
    (p) => p.meter_parameter_id === otherParameter.meter_parameter_id
  )

  if (otherParameterReading == null) {
    return true
  }

  const timezoneReading = otherParameterReading.readings.find(
    (reading) => reading.timezone_id === timeZoneId
  )

  if (timezoneReading == null) {
    return true
  }

  if (timezoneReading.values.diff == '') {
    return true
  }

  if (parameterName.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase()) {
    return value <= Number(timezoneReading.values.diff)
  }
  return value >= Number(timezoneReading.values.diff)
}
