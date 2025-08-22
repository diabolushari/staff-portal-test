import React, { useCallback, useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import { TableCell, TableRow } from '@/components/ui/table'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import { ParameterDefinition, ParameterDomain } from '@/interfaces/parameter_types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Table from '@/ui/Table/Table'
import ParameterDefinitionForm from '@/components/Parameter/ParameterDefinition/ParameterDefinitionForm'
import ParameterDefinitionSearchForm from '@/components/Parameter/ParameterDefinition/ParameterDefinitionSearchForm'
import MainLayout from '@/layouts/main-layout'
import { settingsReferenceData } from '@/components/Navbar/navitems'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Parameter Definition',
    href: '/parameter-definition',
  },
]
const tableHeads = [
  'S.No',
  'ID',
  'Parameter Name',
  'Domain Name',
  'Attribute 1',
  'Attribute 2',
  'Attribute 3',
  'Attribute 4',
  'Attribute 5',
  'Actions',
]

export default function ParameterDefinitionIndex({
  parameter_definitions,
  domains,
  filters,
}: {
  parameter_definitions: ParameterDefinition[]
  domains: ParameterDomain[]
  filters: {
    search: string
    domain_name: string
  }
}) {
  const [parameterDefinitionToEdit, setParameterDefinitionToEdit] =
    useState<ParameterDefinition | null>(null)
  const [parameterDefinitionToDelete, setParameterDefinitionToDelete] =
    useState<ParameterDefinition | null>(null)
  const [parameterFormModal, setParameterFormModal] = useState(false)
  const [parameterDeleteModal, setParameterDeleteModal] = useState(false)

  const handleEditClick = useCallback((item: ParameterDefinition) => {
    setParameterDefinitionToEdit(item)
    setParameterFormModal(true)
  }, [])

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
      navItems={settingsReferenceData}
    >
      <div className='p-4'>
        <CardHeader
          breadCrumb={breadcrumbs}
          title='Parameter Definition'
          subheading='Add and manage parameter definition.'
          onAddClick={handleCreateClick}
        />
        <ParameterDefinitionSearchForm
          parameterDomains={domains}
          filters={filters}
        />
        <Table heads={tableHeads}>
          {parameter_definitions && (
            <>
              {parameter_definitions.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.parameter_name}</TableCell>
                  <TableCell>{item.domain?.domain_name}</TableCell>
                  <TableCell>{item.attribute1_name}</TableCell>
                  <TableCell>{item.attribute2_name}</TableCell>
                  <TableCell>{item.attribute3_name}</TableCell>
                  <TableCell>{item.attribute4_name}</TableCell>
                  <TableCell>{item.attribute5_name}</TableCell>
                  <TableCell>
                    <div className='flex space-x-3'>
                      <EditButton onClick={() => handleEditClick(item)} />
                      <DeleteButton onClick={() => handleDeleteClick(item)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </Table>
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
