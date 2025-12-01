import { metadataNavItems } from '@/components/Navbar/navitems'
import { Office } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import OfficeList from '@/ui/List/OfficeList'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offices',
    href: '/offices',
  },
]

interface Props {
  offices: Paginator<Office>
  office_types: ParameterValues[]
  filters: {
    office_type: string
    office_name: string
  }
}

export default function OfficeIndex({ offices, office_types, filters }: Readonly<Props>) {
  console.log(offices)
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      addBtnUrl={route('offices.create')}
      selectedItem='Office Details'
      addBtnText='Office'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title='Offices search'
          placeholder='Enter office name'
          url={route('offices.index')}
          search={filters.office_name}
        />

        {offices && (
          <>
            <OfficeList offices={offices.data} />
            <Pagination
              pagination={offices}
              filters={{ search: filters.office_name }}
            />
          </>
        )}
      </div>
    </MainLayout>
  )
}
