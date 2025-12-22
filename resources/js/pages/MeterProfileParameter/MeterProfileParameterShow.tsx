import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

const breadCrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Settings', href: '/settings-page' },
  { title: 'Meter Profile Parameters', href: '/meter-profile' },
  { title: 'Show', href: '#' },
]

interface Props {
  meterProfileParameter: MeterProfileParameter[]
}

const MeterProfileParameterShow = ({ meterProfileParameter }: Props) => {
  console.log('meterProfileParameter:', meterProfileParameter)
  return (
    <MainLayout
      title='Meter Profile Parameter Show'
      breadcrumb={breadCrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Metering Profiles'
    >
      <div className='p-4'>
        <div>Meter Profile Parameter Show</div>
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterShow
