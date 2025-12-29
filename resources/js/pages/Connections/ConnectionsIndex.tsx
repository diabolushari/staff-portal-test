import ConnectionIndexSearch from '@/components/Connections/ConnectionIndexSearch'
import ConnectionsList from '@/components/Connections/ConnectionsList'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, OfficeWithHierarchy } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Connections',
    href: '/connections',
  },
]

interface Props {
  connections: Paginator<Connection>
  oldOffice?: OfficeWithHierarchy
  oldConsumerNumber?: string
  filters: {
    consumerNumber: string
  }
}

export default function ConnectionsIndex({
  connections,
  oldOffice,
  oldConsumerNumber,
}: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={consumerNavItems}
      selectedItem='Connections'
      addBtnText='Connection'
      addBtnUrl={route('connections.create')}
      selectedTopNav='Consumers'
      title='Connections'
    >
      {/* <ListSearch
        title='Connections Search'
        placeholder='Enter connection number'
        url={route('connections.index')}
        search={filter.consumerNumber}
      /> */}
      <ConnectionIndexSearch
        oldOffice={oldOffice}
        oldConsumerNumber={oldConsumerNumber}
      />
      <div>{connections && <ConnectionsList connections={connections.data} />}</div>
      <div>{connections && <Pagination pagination={connections} />}</div>
    </MainLayout>
  )
}
