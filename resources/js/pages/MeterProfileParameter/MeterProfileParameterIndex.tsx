import MeterProfileParameterList from '@/components/MeterProfileParameter/MeterProfileParameterList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { MeterProfileGroupByProfile } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'

interface Props {
  oldSearch: string
  meterProfileParameters: Paginator<MeterProfileGroupByProfile>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings-page',
  },
  {
    title: 'Metering Profile',
    href: '/meter-profile',
  },
]

const MeterProfileParameterIndex = ({ oldSearch, meterProfileParameters }: Props) => {
  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      selectedItem='Metering Profiles'
      addBtnText='Meter Profile'
      addBtnUrl={route('meter-profile.create')}
      title='Metering Profiles'
      breadcrumb={breadcrumbs}
    >
      <div>
        <ListSearch
          title=''
          placeholder='Search'
          url={route('meter-profile.index')}
          search={oldSearch}
        />
        {meterProfileParameters && (
          <>
            <MeterProfileParameterList meterProfileParameters={meterProfileParameters.data} />
            <Pagination
              pagination={meterProfileParameters}
              filters={{ search: oldSearch }}
            />
          </>
        )}
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterIndex
