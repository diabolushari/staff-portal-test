import OfficeSearchForm from '@/components/Offices/OfficeSearchForm'
import { TableRow } from '@/components/ui/table'
import { Office } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/paramater_types'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
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
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          title='Offices'
          subheading='Add a new office.'
          addUrl={route('offices.create')}
        />
        <div>
          {office_types && (
            <OfficeSearchForm
              office_types={office_types}
              filters={filters}
            />
          )}
          <CustomTable
            columns={columns}
            caption='List of Offices'
          >
            {offices && (
              <>
                {offices.map((item: any, index: number) => (
                  <TableRow key={item.id}>
                    <td className='px-4 py-2'>{index + 1}</td>
                    <td className='px-4 py-2'>{item.office_id}</td>
                    <td className='px-4 py-2'>{item.office_name}</td>
                    <td className='px-4 py-2'>{item.office_code}</td>
                    <td className='px-4 py-2'>{item.office_type?.parameter_value}</td>
                    <td className='px-4 py-2'>
                      <div className='flex space-x-2'>
                        <EditButton onClick={() => handleEditClick(item)} />
                        <DeleteButton onClick={() => handleDeleteClick(item)} />
                        <Button
                          onClick={() => router.get(route('offices.show', item.office_id))}
                          label='View'
                        />
                      </div>
                    </td>
                  </TableRow>
                ))}
              </>
            )}
          </CustomTable>
        </div>
      </div>
      {showDeleteModal && editRow && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete Office'
          url={route('offices.destroy', editRow.office_id)}
        />
      )}
    </AppLayout>
  )
}
