import { settingsOffices } from '@/components/Navbar/navitems'
import { Office } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import OfficeList from '@/ui/List/OfficeList'
import ListSearch from '@/ui/Search/ListSearch'
import { useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offices',
    href: '/offices',
  },
]
interface Props {
  offices?: Office[]
  office_types: ParameterValues[]
  filters: {
    office_type: string
    office_name: string
  }
}

export default function OfficeIndex({ offices, office_types, filters }: Readonly<Props>) {
  const [items, setItems] = useState(offices)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editRow, setEditRow] = useState<Office | null>(null)

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={settingsOffices}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title='Offices search'
          placeholder='Enter office name'
          url={route('offices.index')}
          search={filters.office_name}
        />

        <div>{items != null && <OfficeList offices={items} />}</div>
        <div>{items == null && <p>No Office Found.</p>}</div>
      </div>
    </MainLayout>
  )
}
