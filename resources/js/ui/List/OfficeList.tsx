import { Office } from '@/interfaces/consumers'
import NormalText from '@/typography/NormalText'
import SubHeading from '@/typography/SubHeading'
import Card from '@/ui/Card/Card'
import TinyContainer from '../Card/TinyContainer'
import { router } from '@inertiajs/react'

interface OfficeListProps {
  offices: Office[]
}

export default function OfficeList({ offices }: OfficeListProps) {
  const handleOfficeClick = (office: Office) => {
    router.get(route('offices.show', office.office_id))
  }
  return (
    <Card className='p-4'>
      <SubHeading className='font-inter text-base font-semibold'>Office Info</SubHeading>
      <div className='flex flex-col gap-3'>
        {offices.map((office) => (
          <div
            onClick={() => {
              handleOfficeClick(office)
            }}
            className='flex w-full items-center justify-between rounded-lg border-[.5px] p-2'
          >
            <div className='flex flex-col gap-1 p-4'>
              <div className='flex gap-2'>
                <SubHeading className='font-inter text-base font-semibold'>
                  {office.office_name}
                </SubHeading>
                <TinyContainer variant='info'>
                  <NormalText>{office.office_code}</NormalText>
                </TinyContainer>
              </div>
              <div className='flex items-center justify-center'>
                <NormalText className='font-inter text-base'>
                  {office.office_type.parameter_value}
                </NormalText>
              </div>
            </div>
            <div>
              <TinyContainer variant={office.is_current ? 'success' : 'danger'}>
                <NormalText>{office.is_current ? 'Active' : 'Inactive'}</NormalText>
              </TinyContainer>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
