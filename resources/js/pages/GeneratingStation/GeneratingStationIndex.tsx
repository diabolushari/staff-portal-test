import { consumerNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import GeneratingStationList from '@/components/GeneratingStation/GeneratingStationList'
import GeneratingStationIndexSearch from '@/components/GeneratingStation/GeneratingStationIndexSearch'
import { ParameterValues } from '@/interfaces/parameter_types'

interface GeneratingStation {
  station_id: number
  station_name: string
  installed_capacity: number
}

interface Filters {
  station_name?: string
  consumer_number?: string
  generation_type_id?: string
  voltage_category_id?: string
  plant_type_id?: string
  generation_status_id?: string
  date_from?: string
  date_to?: string
}

interface PageProps {
  generatingStations: Paginator<GeneratingStation>
  filters: Filters
  generationTypes: ParameterValues[]
  voltageCategories: ParameterValues[]
  plantTypes: ParameterValues[]
  generationStatuses: ParameterValues[]
}

export default function GeneratingStationIndexPage({
  generatingStations,
  filters,
  generationTypes,
  voltageCategories,
  plantTypes,
  generationStatuses,
}: PageProps) {
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
      <GeneratingStationIndexSearch
        generationTypes={generationTypes}
        voltageCategories={voltageCategories}
        plantTypes={plantTypes}
        generationStatuses={generationStatuses}
        filters={filters}
      />

      {generatingStations?.data?.length > 0 ? (
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
