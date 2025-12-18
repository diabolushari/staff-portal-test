import MeterProfileParameterList from '@/components/MeterProfileParameter/MeterProfileParameterList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'

interface Props {
  oldSearch: string
  meterProfileParameters: Paginator<MeterProfileParameter>
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
