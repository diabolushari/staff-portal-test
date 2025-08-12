import { TableCell, TableRow } from '@/components/ui/table'
import { SystemModule } from '@/interfaces/paramater_types'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Modal from '@/ui/Modal/Modal'
import Table from '@/ui/Table/Table'
import { Head } from '@inertiajs/react'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { route } from 'ziggy-js'
import SystemModuleForm from './components/SystemModuleForm'

interface Props {
  systemModules: SystemModule[]
}

const tableHeads = ['S.No', 'ID', 'System Module Name', 'Actions']

export default function SystemModuleIndex({ systemModules }: Readonly<Props>) {
  const [moduleToEdit, setModuleToEdit] = useState<SystemModule | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState<SystemModule | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'System Modules',
      href: '/system-module',
    },
  ]

  const handleCreateClick = useCallback(() => {
    setModuleToEdit(null)
    setShowModal(true)
  }, [])

  const handleEditClick = useCallback((module: SystemModule) => {
    setModuleToEdit(module)
    setShowModal(true)
  }, [])

  const handleDeleteClick = useCallback((module: SystemModule) => {
    setModuleToDelete(module)
    setShowDeleteModal(true)
  }, [])

  const handleModalClose = () => {
    setShowModal(false)
    setModuleToEdit(null)
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setModuleToDelete(null)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='System Modules' />
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          title='System Module'
          subheading='Here you can create System module names. Only admin can create system module names.'
          onAddClick={handleCreateClick}
        />

        <Table heads={tableHeads}>
          {systemModules.map((module, index) => (
            <TableRow key={module.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{module.id}</TableCell>
              <TableCell>{module.name}</TableCell>
              <TableCell>
                <div className='flex space-x-3'>
                  <EditButton onClick={() => handleEditClick(module)} />
                  <DeleteButton onClick={() => handleDeleteClick(module)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>

        {/* Single Modal for Create/Edit */}
        <AnimatePresence>
          {showModal && (
            <Modal
              setShowModal={setShowModal}
              title={moduleToEdit ? 'Edit System Module' : 'Create System Module'}
            >
              <SystemModuleForm
                selectedSystemModule={moduleToEdit}
                onSuccess={handleModalClose}
                onCancel={handleModalClose}
              />
            </Modal>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && moduleToDelete && (
            <DeleteModal
              setShowModal={setShowDeleteModal}
              title='Confirm Deletion'
              url={route('system-module.destroy', moduleToDelete.id)}
              onSuccess={handleDeleteSuccess}
            >
              <div className='text-gray-700'>
                Are you sure you want to delete <strong>{moduleToDelete.name}</strong>?
              </div>
            </DeleteModal>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  )
}
