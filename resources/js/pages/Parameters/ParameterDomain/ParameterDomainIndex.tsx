import { metadataNavItems } from '@/components/Navbar/navitems'
import ParameterDomainForm from '@/components/Parameter/ParameterDomain/ParameterDomainForm'
import ParameterDomainList from '@/components/Parameter/ParameterDomain/ParameterDomainList'
import ParameterDomainSearchForm from '@/components/Parameter/ParameterDomain/ParameterDomainSearchForm'
import { ParameterDomain, SystemModule } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { type BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { router } from '@inertiajs/react'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { route } from 'ziggy-js'

interface Props {
  domains: ParameterDomain[]
  modules: SystemModule[]
  filters: {
    search: string
    module_id: string
  }
}

export default function ParameterDomainIndex({ domains, modules, filters }: Readonly<Props>) {
  const [parameterDomainToEdit, setParameterDomainToEdit] = useState<ParameterDomain | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [parameterDomainToDelete, setParameterDomainToDelete] = useState<ParameterDomain | null>(
    null
  )

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Parameter Domains',
      href: '/parameter-domain',
    },
  ]

  const handleCreateClick = useCallback(() => {
    setParameterDomainToEdit(null)
    setShowModal(true)
  }, [])

  const handleEditClick = useCallback((item: ParameterDomain) => {
    setParameterDomainToEdit(item)
    setShowModal(true)
  }, [])

  const handleDeleteClick = useCallback((item: ParameterDomain) => {
    setParameterDomainToDelete(item)
    setShowDeleteModal(true)
  }, [])

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setParameterDomainToDelete(null)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Domains'
      title='Parameter Domains'
    >
      {/* <Head title='Parameter Domains' /> */}

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='mb-4 flex items-center justify-between'>
          {/* <h2 className='text-lg font-semibold text-[#252c32]'>Parameter Domains</h2> */}
          <div></div>
          <button
            onClick={handleCreateClick}
            className='rounded-lg bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
          >
            + Add Domain
          </button>
        </div>

        <ListSearch
          title=''
          url={route('parameter-domain.index')}
          filters={filters}
        />
        <div className='flex items-center justify-between'>
          <ParameterDomainSearchForm
            systemModules={modules}
            filters={filters}
          />
          <Button
            variant='secondary'
            onClick={() =>
              router.get(route('parameter-domain.index'), { search: '', module_id: '' })
            }
            label='Clear Filters'
          />
        </div>

        <div>
          {domains != null && domains.length > 0 ? (
            <ParameterDomainList
              domains={domains}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onView={(domain) => router.get(route('parameter-domains.show', domain.id))}
            />
          ) : (
            <p>No Parameter Domains Found.</p>
          )}
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <ParameterDomainForm
              title={parameterDomainToEdit ? 'Edit Parameter Domain' : 'Add Parameter Domain'}
              setShowModal={setShowModal}
              parameterDomain={parameterDomainToEdit ?? undefined}
              modules={modules}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && parameterDomainToDelete && (
            <DeleteModal
              setShowModal={setShowDeleteModal}
              title='Confirm Deletion'
              url={route('parameter-domain.destroy', parameterDomainToDelete.id)}
              onSuccess={handleDeleteSuccess}
            >
              <div className='text-gray-700'>
                Are you sure you want to delete{' '}
                <strong>{parameterDomainToDelete.domain_name}</strong>?
              </div>
            </DeleteModal>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}
