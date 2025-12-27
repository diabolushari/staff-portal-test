import FormCard from '@/ui/Card/FormCard'
import { GroupedFlags } from './useConnectionFlagForm'
import StrongText from '@/typography/StrongText'
import CheckBox from '@/ui/form/CheckBox'

interface Props {
  updateFlagData: (id: number, value: boolean) => void
  flagData: GroupedFlags[]
}

export default function ConnectionFlagForm({ updateFlagData, flagData }: Props) {
  return (
    <FormCard title='Indicators'>
      <div className='col-span-2 gap-6'>
        {flagData.map((group) => (
          <div
            key={group.id}
            className='mt-2 flex flex-col gap-4'
          >
            {/* Section Title */}
            <StrongText className='mt-3 block text-sm font-semibold text-gray-700'>
              {group.group_name}
            </StrongText>

            {/* Checkboxes */}
            <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
              {group.flags.map((indicator) => (
                <div
                  key={indicator.id}
                  className='space-y-2'
                >
                  <CheckBox
                    label={indicator.label}
                    value={indicator.value}
                    toggleValue={() => updateFlagData(indicator.id, !indicator.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  )
}
