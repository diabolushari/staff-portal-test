import MainLayout from '@/layouts/main-layout'
import { type BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { route } from 'ziggy-js'
import { metadataNavItems } from '@/components/Navbar/navitems'
import AddButton from '@/ui/button/AddButton'
import { PurposeInfo } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import PurposeInfoList from '@/components/PurposeInfo/PurposeInfoList'
import Pagination from '@/ui/Pagination/Pagination'

interface Props {
  purposeInfo: Paginator<PurposeInfo>
}

export default function PurposeInfoIndexPage({ purposeInfo }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [purposeInfoToDelete, setPurposeInfoToDelete] = useState<PurposeInfo | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Purpose Informations',
      href: '/purpose-info',
    },
  ]

  const handleDeleteClick = useCallback((purposeInfo: PurposeInfo) => {
    setPurposeInfoToDelete(purposeInfo)
    setShowDeleteModal(true)
  }, [])

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setPurposeInfoToDelete(null)
  }

  const handleAddClick = () => {
    router.get(route('purpose-info.create'))
  }

  const handleEditClick = (purposeInfo: PurposeInfo) => {
    router.get(route('purpose-info.edit', purposeInfo.id))
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Purpose Informations'
      title='Purpose Informations'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl py-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div></div>

          <AddButton
            onClick={handleAddClick}
            buttonText='Add Purpose Information'
          />
        </div>

        <div className='flex flex-col'>
          {purposeInfo?.data && (
            <PurposeInfoList
              purposeInfos={purposeInfo.data}
              handleEdit={handleEditClick}
            />
          )}
        </div>

        {purposeInfo?.data && <Pagination pagination={purposeInfo} />}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && purposeInfoToDelete && (
            <DeleteModal
              setShowModal={setShowDeleteModal}
              title='Confirm Deletion'
              url={route('purpose-info.destroy', purposeInfoToDelete.id)}
              onSuccess={handleDeleteSuccess}
            >
              <div className='text-gray-700'>Are you sure you want to delete ?</div>
            </DeleteModal>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}
