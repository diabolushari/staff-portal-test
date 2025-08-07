import SystemModuleFormModal from '@/components/SystemModule/SystemModuleFormModal'
import { Card } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { route } from 'ziggy-js'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import { SystemModule } from '@/interfaces/paramater_service'
import DeleteModal from '@/ui/Modal/DeleteModal'

export default function SystemModuleIndex({ systemModules }: { systemModules: SystemModule[] }) {
  const [editRow, setEditRow] = useState<SystemModule | null>(null)
  const [systemModuleFormModal, setSystemModuleFormModal] = useState(false)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'System Modules',
      href: '/system-module',
    },
  ]

  const columns = ['S.No', 'ID', 'System Module Name', 'Actions']

  const handleEditClick = (row: SystemModule) => {
    setEditRow(row)
    setSystemModuleFormModal(true)
  }

  const handleDeleteClick = (row: SystemModule) => {
    setEditRow(row)
    setShowDeleteModal(true)
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='System Modules' />
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          breadCrumb={breadcrumbs}
          title='System Module'
          onAddClick={() => {
            setEditRow(null)
            setSystemModuleFormModal(true)
          }}
        />

        <Card className='p-4'>
          <CustomTable
            columns={columns}
            caption='List of system modules'
          >
            {systemModules.map((item: SystemModule, index: number) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <div className='flex space-x-2'>
                    <EditButton onClick={() => handleEditClick(item)} />
                    <DeleteButton onClick={() => handleDeleteClick(item)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </CustomTable>
        </Card>
      </div>

      {systemModuleFormModal && (
        <SystemModuleFormModal
          setShowModal={setSystemModuleFormModal}
          initialData={editRow}
        />
      )}
      {showDeleteModal && editRow && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete System Module'
          url={route('system-module.destroy', editRow.id)}
        />
      )}
    </AppLayout>
  )
}
