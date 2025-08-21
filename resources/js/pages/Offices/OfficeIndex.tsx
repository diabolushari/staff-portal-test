import OfficeSearchForm from '@/components/Offices/OfficeSearchForm'
import { TableCell, TableRow } from '@/components/ui/table'
import { Office } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/parameter_types'
import AppLayout from '@/layouts/app-layout'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import OfficeList from '@/ui/List/OfficeList'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import CustomTable from '@/ui/Table/CustomTable'
import { router } from '@inertiajs/react'
import { useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offices',
    href: '/offices',
  },
]

export default function OfficeIndex({
  offices,
  office_types,
  filters,
}: {
  offices: Office[]
  office_types: ParameterValues[]
  filters: {
    office_type: string
    office_name: string
  }
}) {
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
  console.log('offices', offices)
  return (
    <MainLayout breadcrumb={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title='Office Search'
          placeholder='Enter office name or code'
        />
        <div>
          {office_types && (
            <OfficeSearchForm
              office_types={office_types}
              filters={filters}
              placeholder='Enter office name or code'
            />
          )}
          <OfficeList offices={offices} />
        </div>
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
