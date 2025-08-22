import { settingsOffices } from '@/components/Navbar/navitems'
import OfficeSearchForm from '@/components/Offices/OfficeSearchForm'
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
  offices: Office[]
  office_types: ParameterValues[]
  filters: {
    office_type: string
    office_name: string
  }
}

export default function OfficeIndex({ offices, office_types, filters }: Props) {
  const [items, setItems] = useState(offices)
  const columns = ['S.No', 'ID', 'Office Name', 'Office Code', 'Office Type', 'Actions']
  const handleEditClick = (item: any) => {
    router.get(route('offices.edit', item.office_id))
  }
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editRow, setEditRow] = useState<Office | null>(null)
  const handleDeleteClick = (item: any) => {
    setEditRow(item)
    setShowDeleteModal(true)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={settingsOffices}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title='Office Search'
          placeholder='Enter office name or code'
          url={route('offices.index')}
          setItems={setItems}
          search={filters.office_name}
        />

        <div>{items.length > 0 ? <OfficeList offices={items} /> : <div>No offices found</div>}</div>
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
