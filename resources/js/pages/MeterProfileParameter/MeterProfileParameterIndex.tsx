import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import { router } from '@inertiajs/react'

interface Props {
  oldSearch: string
  meterProfileParameters: MeterProfileParameter[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings-page',
  },
  {
    title: 'Meter Profile Parameter',
    href: '/meter-profile-parameter',
  },
]

const MeterProfileParameterIndex = ({ oldSearch, meterProfileParameters }: Props) => {
  console.log(meterProfileParameters)
  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      selectedItem='Meter Profile Parameters'
      addBtnText='Meter Profile Parameter'
      addBtnUrl={route('meter-profile-parameter.create')}
      title='Meter Profile Parameter'
      breadcrumb={breadcrumbs}
    >
      <div>
        <ListSearch
          title=''
          placeholder='Search'
          url={route('meter-profile-parameter.index')}
          search={oldSearch}
        />
        {meterProfileParameters.map((meterProfileParameter) => (
          <Card
            className='gap-3 p-4'
            key={meterProfileParameter.id}
            onClick={() => {
              router.get(
                route('meter-profile-parameter.edit', meterProfileParameter.meter_parameter_id)
              )
            }}
          >
            <p className='font-semibold'>{meterProfileParameter.name}</p>
          </Card>
        ))}
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterIndex
