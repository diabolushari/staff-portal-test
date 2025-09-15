import ConnectionsList from '@/components/Connections/ConnectionsList'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Connections',
    href: '/connections',
  },
]

interface Props {
  connections: any
  filter: {
    consumerNumber: string
  }
}
export default function ConnectionsIndex({ connections, filter }: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connectionsNavItems}
    >
      <ListSearch
        title='Connections Search'
        placeholder='Enter connection number'
        url={route('connections.index')}
        search={filter.consumerNumber}
      />
      <div>{connections && <ConnectionsList connections={connections} />}</div>
    </MainLayout>
  )
}
