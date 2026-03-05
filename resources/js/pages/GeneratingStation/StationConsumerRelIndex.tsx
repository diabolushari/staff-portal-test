import { consumerNavItems } from '@/components/Navbar/navitems'
import { StationConsumerRel } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Station Consumers',
    href: '/station-consumers',
  },
]

interface Props {
  stations: StationConsumerRel[]
}

export default function StationConsumerRelIndex({}: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={consumerNavItems}
      addBtnText='Station Consumer'
      addBtnUrl={route('station-consumers.create')}
      selectedTopNav='Consumers'
      title='Station Consumers'
    >
      <div></div>
    </MainLayout>
  )
}
