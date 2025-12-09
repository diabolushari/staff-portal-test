import { SystemModule } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { type BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Modal from '@/ui/Modal/Modal'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { route } from 'ziggy-js'
import SystemModuleForm from './components/SystemModuleForm'
import { metadataNavItems } from '@/components/Navbar/navitems'
import { Pencil, Trash2 } from 'lucide-react'

interface Props {
  systemModules: SystemModule[]
}

export default function SystemModuleIndex({ systemModules }: Readonly<Props>) {
  const [moduleToEdit, setModuleToEdit] = useState<SystemModule | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState<SystemModule | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
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
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='System Module'
      title='System Modules'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div></div>

          <button
            onClick={handleCreateClick}
            className='rounded-lg bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
          >
            + Add Module
          </button>
        </div>

        <div className='flex flex-col'>
          {systemModules.map((module) => (
            <div
              key={module.id}
              className='mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-shadow hover:shadow-md'
            >
              <div className='flex items-start justify-between'>
                {/* Left Section */}
                <div className='flex flex-1 flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base font-semibold text-black'>
                      {module.name}
                    </div>
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs text-blue-800'>ID: {module.id}</div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Actions */}
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => handleEditClick(module)}
                    className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                  >
                    <Pencil className='h-4 w-4' />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(module)}
                    className='flex items-center gap-1 text-sm text-red-600 hover:text-red-800'
                  >
                    <Trash2 className='h-4 w-4' />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
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
    </MainLayout>
  )
}
