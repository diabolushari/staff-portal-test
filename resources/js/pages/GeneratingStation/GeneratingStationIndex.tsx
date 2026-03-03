import { consumerNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import GeneratingStationList from '@/components/GeneratingStation/GeneratingStationList'

interface GeneratingStation {
  station_id: number
  station_name: string
  installed_capacity: number
}

interface PageProps {
  generatingStations: Paginator<GeneratingStation>
  filters: {
    search: string
  }
}

export default function GeneratingStationIndexPage({ generatingStations, filters }: PageProps) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Generating Stations',
      href: '/generating-stations',
    },
  ]
  console.log('Generating Stations:', generatingStations)
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      leftBarTitle='Consumers'
      selectedItem='Generating Stations'
      navItems={consumerNavItems}
      addBtnText='Generating Station'
      addBtnUrl='/generating-stations/create'
      title='Generating Stations'
      selectedTopNav='Consumers'
    >
      <ListSearch
        title=''
        placeholder='Find Generating Station'
        url='/generating-stations'
        filters={filters}
      />

      {generatingStations && generatingStations?.data?.length > 0 ? (
        <>
          <GeneratingStationList stations={generatingStations.data} />

          <Pagination
            pagination={generatingStations}
            filters={filters}
          />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Generating Stations Found</div>
      )}
    </MainLayout>
  )
}
