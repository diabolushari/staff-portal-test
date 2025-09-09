import { parties, settingsOffices } from '@/components/Navbar/navitems'
import { Office } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import OfficeList from '@/ui/List/OfficeList'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { router } from '@inertiajs/react'
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
          title='Parties search'
          placeholder='Enter office name or code'
          url={route('offices.index')}
          setItems={setItems}
          search={filters.office_name}
        />

        <div>{items != null && <OfficeList offices={items} />}</div>
        <div>{items == null && <p>No Office Found.</p>}</div>
      </div>
      {showDeleteModal && editRow && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete Office'
          url={route('offices.destroy', editRow.office_id)}
        />
      )}
    </MainLayout>
  )
}
