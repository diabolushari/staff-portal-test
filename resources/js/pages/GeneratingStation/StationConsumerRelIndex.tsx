import { consumerNavItems } from '@/components/Navbar/navitems'
import StationConsumerRelList from '@/components/GeneratingStation/StationConsumerRel/StationConsumerRelList'
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

export default function StationConsumerRelIndex({ stations }: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={consumerNavItems}
      addBtnText='Station Consumer'
      addBtnUrl={route('station-consumers.create')}
      selectedTopNav='Consumers'
      title='Station Consumers'
    >
      <div>
        {stations && stations.length > 0 ? (
          <StationConsumerRelList stations={stations} />
        ) : (
          <div className='flex h-full items-center justify-center'>No Station Consumers Found</div>
        )}
      </div>
    </MainLayout>
  )
}
