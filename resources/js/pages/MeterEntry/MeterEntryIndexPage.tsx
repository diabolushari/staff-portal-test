import BillingConnectionsList from '@/components/Billing/BillingConnectionsList'
import ConnectionsList from '@/components/Connections/ConnectionsList'
import { meterEntryNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import Card from '@/ui/Card/Card'
import ListSearch from '@/ui/Search/ListSearch'

interface Props {
  connections: any
  filter: {
    consumerNumber: string
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Billing',
    href: '/billing',
  },
]

export default function MeterEntryIndexPage({ connections, filter }: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterEntryNavItems}
    >
      <ListSearch
        title='Connections Search'
        placeholder='Enter consumer number'
        url={route('connections.index')}
        search={filter.consumerNumber}
      />
      <div>{connections && <BillingConnectionsList connections={connections} />}</div>
    </MainLayout>
  )
}
