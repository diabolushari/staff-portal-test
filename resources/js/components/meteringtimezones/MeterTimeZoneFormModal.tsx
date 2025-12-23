import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import { MeteringTimezone } from '@/pages/MeteringTimezones/MeteringTimezoneIndexPage'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'
import dayjs from 'dayjs'
import { useState } from 'react'
import MeterTimeZoneForm from './MeterTimeZoneForm'
import MeterTimezoneParameterForm from '@/pages/MeteringTimezones/MeterTimezoneParameterForm'

interface Props {
  onClose: () => void
  timezoneType: ParameterValues
  timezoneNames: ParameterValues[]
  pricingTypes: ParameterValues[]
  timezoneNameParameter: ParameterDefinition
  timezone?: MeteringTimezone | undefined | null
}

export default function MeterTimeZoneFormModal({
  onClose,
  timezoneNameParameter,
  timezoneType,
  timezoneNames,
  pricingTypes,
  timezone,
}: Props) {
  const [isMetertimezoneForm, setIsMetertimezoneForm] = useState<boolean>(true)

  return (
    <Modal
      title={isMetertimezoneForm ? 'Add Meter Timezone' : 'Create Meter Timezone'}
      setShowModal={onClose}
    >
      {isMetertimezoneForm ? (
        <MeterTimeZoneForm
          timezoneGroup={timezoneType}
          pricingTypes={pricingTypes}
          timezoneNames={timezoneNames}
          switchForm={setIsMetertimezoneForm}
          timezone={timezone}
          onComplete={onClose}
        />
      ) : (
        <MeterTimezoneParameterForm
          timezoneNameParameter={timezoneNameParameter}
          pricingTypes={pricingTypes}
          timezoneNames={timezoneNames}
          switchForm={setIsMetertimezoneForm}
          parameterCodeLabel='Code'
          parameterValueLabel='Timezone Name'
        />
      )}
    </Modal>
  )
}
