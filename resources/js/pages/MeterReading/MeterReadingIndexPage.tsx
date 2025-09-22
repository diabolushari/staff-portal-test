import { meterReadingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import MeterReadingConnectionsList from '@/components/Meter/MeterReading/MeterReadingConnectionsList'

interface Props {
  connections: any
  filter: {
    consumerNumber: string
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Meter Reading',
    href: '/meter-reading',
  },
]

export default function MeterReadingIndexPage({ connections, filter }: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterReadingNavItems}
    >
      <ListSearch
        title='Connections Search'
        placeholder='Enter consumer number'
        url={route('connections.index')}
        search={filter.consumerNumber}
      />
      <div>{connections && <MeterReadingConnectionsList connections={connections} />}</div>
    </MainLayout>
  )
}
