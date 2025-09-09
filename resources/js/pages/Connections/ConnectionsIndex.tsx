import ConnectionsList from '@/components/Connections/ConnectionsList'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Connections',
    href: '/connections',
  },
]
export default function ConnectionsIndex({ connections }: Readonly<{ connections: any }>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connectionsNavItems}
    >
      <div>{connections && <ConnectionsList connections={connections} />}</div>
    </MainLayout>
  )
}
