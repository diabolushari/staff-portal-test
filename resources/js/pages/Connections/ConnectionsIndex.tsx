import ConnectionIndexSearch from '@/components/Connections/ConnectionIndexSearch'
import ConnectionsList from '@/components/Connections/ConnectionsList'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, Office } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Connections',
    href: '/connections',
  },
]

interface Props {
  connections: Paginator<Connection>
  oldOffice?: Office
  oldConsumerNumber?: string
  filter: {
    consumerNumber: string
  }
}
export default function ConnectionsIndex({
  connections,
  oldOffice,
  oldConsumerNumber,
  filter,
}: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={consumerNavItems}
      selectedItem='Connections'
      addBtnText='Connection'
      addBtnUrl={route('connections.create')}
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
        filter={filter}
      />
      <div>{connections && <ConnectionsList connections={connections.data} />}</div>
      <div>{connections && <Pagination pagination={connections} />}</div>
    </MainLayout>
  )
}
