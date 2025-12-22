import ProfileParameterShowList from '@/components/MeterProfileParameter/ProfileParameterShowList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'

const breadCrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Settings', href: '/settings-page' },
  { title: 'Meter Profile Parameters', href: '/meter-profile' },
  { title: 'Show', href: '#' },
]

interface Props {
  meterProfileParameter: Paginator<MeterProfileParameter>
}

const MeterProfileParameterShow = ({ meterProfileParameter }: Props) => {
  return (
    <MainLayout
      title='Meter Profile Parameter Show'
      breadcrumb={breadCrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Metering Profiles'
    >
      <div className='p-4'>
        {meterProfileParameter.data.length > 0 && (
          <>
            <ProfileParameterShowList meterProfileParameters={meterProfileParameter.data} />
            <Pagination pagination={meterProfileParameter} />
          </>
        )}
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterShow
