import { metadataNavItems } from '@/components/Navbar/navitems'
import ParameterDefinitionForm from '@/components/Parameter/ParameterDefinition/ParameterDefinitionForm'
import ParameterDefinitionList from '@/components/Parameter/ParameterDefinition/ParameterDefinitionList'
import ParameterDefinitionSearchForm from '@/components/Parameter/ParameterDefinition/ParameterDefinitionSearchForm'
import { ParameterDefinition, ParameterDomain, SystemModule } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import AddButton from '@/ui/button/AddButton'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { useCallback, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
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

  console.log('parameter_definitions', parameter_definitions)
  console.log('domains', domains)
  console.log('system_modules', system_modules)
  console.log('filters', filters)

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Definitions'
      title='Parameter Definitions'
      description='Set up and manage system variables under a domain.'
      addBtnClick={handleCreateClick}
      addBtnText='Parameter Definition'
    >
      <div className='py-4'>
        <ListSearch
          title=''
          url={route('parameter-definition.index')}
          search={filters.search}
          filters={filters}
          placeholder='Search By Parameter Definition'
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
