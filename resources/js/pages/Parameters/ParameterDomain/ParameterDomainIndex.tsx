import ParameterDomainActionModal from '@/components/Parameter/ParameterDomain/ParameterDomainActionModal'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { TableRow, TableCell } from '@/components/ui/table'
import { useState } from 'react'
import { route } from 'ziggy-js'
import { router } from '@inertiajs/react'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import { Card } from '@/components/ui/card'

export default function ParameterDomainIndex({ domains }: { domains: any }) {
  const [editRow, setEditRow] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Parameter Domains',
      href: '/parameter-domain',
    },
  ]

  const columns = [
    'S.No',
    'ID',
    'Domain Name',
    'Description',
    'Domain Code',
    'Managed By Module Name',
    'Actions',
  ]

  const handleEditClick = (row: any) => {
    setEditRow(row)
    setShowModal(true)
  }

  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this parameter domain?')) {
      router.delete(route('parameter-domain.destroy', id))
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          breadCrumb={breadcrumbs}
          title='Parameter Domains'
          subheading='Add a new parameter domain.'
          onAddClick={() => {
            setEditRow(null)
            setShowModal(true)
          }}
        />

        <Card className='p-4'>
          <CustomTable
            columns={columns}
            caption='List of parameter domains'
          >
            {domains.map((item: any, index: number) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.domain_name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.domain_code}</TableCell>
                <TableCell>{item.managed_by_module_name}</TableCell>
                <TableCell>
                  <div className='flex space-x-2'>
                    <EditButton onClick={() => handleEditClick(item)} />
                    <DeleteButton onClick={() => handleDeleteClick(item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </CustomTable>
        </Card>
      </div>

      {showModal && (
        <ParameterDomainActionModal
          title={editRow ? 'Edit Parameter Domain' : 'Add Parameter Domain'}
          setShowModal={setShowModal}
          show={showModal}
          initialData={editRow}
        />
      )}
    </AppLayout>
  )
}
