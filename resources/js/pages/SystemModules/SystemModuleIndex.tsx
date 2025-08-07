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

  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this system module?')) {
      router.delete(route('system-module.destroy', id))
    }
  }

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
                    <DeleteButton onClick={() => handleDeleteClick(item.id)} />
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
    </AppLayout>
  )
}
