import SystemModuleFormModal from '@/components/SystemModule/SystemModuleFormModal'
import { Card } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { route } from 'ziggy-js'

export default function SystemModuleIndex({ systemModules }: { systemModules: any }) {
  const [editRow, setEditRow] = useState<any>(null)
  const [systemModuleFormModal, setSystemModuleFormModal] = useState(false)
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'System Modules',
      href: '/system-module',
    },
  ]

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'System Module Name', accessor: 'name' },
    { header: 'Actions', accessor: 'actions' },
  ]

  const handleEditClick = (row: any) => {
    setEditRow(row)
    setSystemModuleFormModal(true)
  }
  const data = systemModules
  const dataWithActions = data.map((item: any) => ({
    ...item,
    actions: {
      editOnclick: () => handleEditClick(item),
      deleteUrl: route('system-module.destroy', item.id),
    },
  }))

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='System Modules' />
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className=''>
          <CardHeader
            title='System Module'
            onAddClick={() => setSystemModuleFormModal(true)}
          />
        </div>
        <Card className='p-4'>
          <CustomTable
            columns={columns}
            data={dataWithActions}
            serialNumber={true}
          />
        </Card>
      </div>
      {systemModuleFormModal && (
        <SystemModuleFormModal
          setShowModal={setSystemModuleFormModal}
          show={systemModuleFormModal}
          initialData={editRow}
        />
      )}
    </AppLayout>
  )
}
