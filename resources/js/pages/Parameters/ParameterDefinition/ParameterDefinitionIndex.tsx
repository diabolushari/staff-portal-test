import { metadataNavItems } from '@/components/Navbar/navitems'
import ParameterDefinitionForm from '@/components/Parameter/ParameterDefinition/ParameterDefinitionForm'
import ParameterDefinitionList from '@/components/Parameter/ParameterDefinition/ParameterDefinitionList'
import ParameterDefinitionSearchForm from '@/components/Parameter/ParameterDefinition/ParameterDefinitionSearchForm'
import { ParameterDefinition, ParameterDomain, SystemModule } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { useCallback, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings-page',
  },
  {
    title: 'Parameter Definition',
    href: '/parameter-definition',
  },
]

export default function ParameterDefinitionIndex({
  parameter_definitions,
  domains,
  system_modules,
  filters,
}: {
  parameter_definitions: ParameterDefinition[]
  domains: ParameterDomain[]
  system_modules: SystemModule[]
  filters: {
    search: string
    domain_name: string
    module_name: string
  }
}) {
  const [parameterDefinitionToEdit, setParameterDefinitionToEdit] =
    useState<ParameterDefinition | null>(null)
  const [parameterDefinitionToDelete, setParameterDefinitionToDelete] =
    useState<ParameterDefinition | null>(null)
  const [parameterFormModal, setParameterFormModal] = useState(false)
  const [parameterDeleteModal, setParameterDeleteModal] = useState(false)
  const items = parameter_definitions

  const handleDeleteClick = useCallback((item: ParameterDefinition) => {
    setParameterDefinitionToDelete(item)
    setParameterDeleteModal(true)
  }, [])

  const handleCreateClick = useCallback(() => {
    setParameterDefinitionToEdit(null)
    setParameterFormModal(true)
  }, [])
  console.log(parameter_definitions)
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Definitions'
      title='Parameter Definitions'
    >
      <div className='mb-4 flex items-center justify-between'>
        {/* <h2 className='text-lg font-semibold text-[#252c32]'>Parameter Definitions</h2> */}
        <div></div>
        <button
          onClick={handleCreateClick}
          className='rounded-lg bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
        >
          + Add Parameter Definition
        </button>
      </div>
      <div className='p-4'>
        <ListSearch
          title=''
          url={route('parameter-definition.index')}
          search={filters.search}
          filters={filters}
        />

        <ParameterDefinitionSearchForm
          parameterDomains={domains}
          systemModules={system_modules}
          filters={filters}
        />
        <div>
          {items != null && items.length > 0 ? (
            <ParameterDefinitionList
              parameterDefinitions={items}
              onDelete={handleDeleteClick}
            />
          ) : (
            <p>No Parameter Definitions Found.</p>
          )}
        </div>
      </div>
      {parameterFormModal && (
        <ParameterDefinitionForm
          title={
            parameterDefinitionToEdit ? 'Edit Parameter Definition' : 'Add Parameter Definition'
          }
          setShowModal={setParameterFormModal}
          show={parameterFormModal}
          parameterDefinition={parameterDefinitionToEdit ?? null}
          domains={domains}
        />
      )}
      {parameterDeleteModal && (
        <DeleteModal
          title='Delete Parameter Definition'
          setShowModal={setParameterDeleteModal}
          url={route('parameter-definition.destroy', parameterDefinitionToDelete?.id)}
        />
      )}
    </MainLayout>
  )
}
