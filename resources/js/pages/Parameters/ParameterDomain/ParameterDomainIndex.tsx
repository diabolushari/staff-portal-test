import ParameterDomainForm from '@/components/Parameter/ParameterDomain/ParameterDomainForm'
import ParameterDomainSearchForm from '@/components/Parameter/ParameterDomain/ParameterDomainSearchForm'
import { TableCell, TableRow } from '@/components/ui/table'
import { ParameterDomain, SystemModule } from '@/interfaces/paramater_types'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Table from '@/ui/Table/Table'
import { Head } from '@inertiajs/react'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { route } from 'ziggy-js'

const tableHeads = [
  'S.No',
  'ID',
  'Domain Name',
  'Description',
  'Domain Code',
  'System Module',
  'Actions',
]

interface Props {
  domains: ParameterDomain[]
  modules: SystemModule[]
}

export default function ParameterDomainIndex({ domains, modules }: Readonly<Props>) {
  const [parameterDomainToEdit, setParameterDomainToEdit] = useState<ParameterDomain | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [parameterDomainToDelete, setParameterDomainToDelete] = useState<ParameterDomain | null>(
    null
  )
  const [systemModuleId, setSystemModuleId] = useState<number | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
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
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Parameter Domains' />
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          title='Parameter Domains'
          subheading='Add and manage parameter domains.'
          onAddClick={handleCreateClick}
        />
        <ParameterDomainSearchForm
          systemModules={modules}
          setSystemModuleId={setSystemModuleId}
        />

        <Table heads={tableHeads}>
          {domains.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.domain_name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.domain_code}</TableCell>
              <TableCell>{item.system_module?.name}</TableCell>
              <TableCell>
                <div className='flex space-x-3'>
                  <EditButton onClick={() => handleEditClick(item)} />
                  <DeleteButton onClick={() => handleDeleteClick(item)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <ParameterDomainForm
              title={parameterDomainToEdit ? 'Edit Parameter Domain' : 'Add Parameter Domain'}
              setShowModal={setShowModal}
              show={showModal}
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
    </AppLayout>
  )
}
