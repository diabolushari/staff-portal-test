import { connections, settingsOffices } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Connections',
    href: '/connections',
  },
]
export default function ConnectionsIndex() {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connections}
    >
      <div></div>
    </MainLayout>
  )
}
