import React, { useCallback, useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import ParameterDefinitionActionModal from '@/components/Parameter/ParametrDefinition/ParameterDefinitionActionModal'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import { TableCell, TableRow } from '@/components/ui/table'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import { ParameterDefinition, ParameterDomain } from '@/interfaces/paramater_types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Table from '@/ui/Table/Table'
import ParameterDefinitionForm from '@/components/Parameter/ParametrDefinition/ParameterDefinitionForm'
import ParameterDefinitionSearchForm from '@/components/Parameter/ParametrDefinition/ParameterDefinitionSearchForm'

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
  const [ParametrDefinitionTODelete, setParametrDefinitionTODelete] =
    useState<ParameterDefinition | null>(null)
  const [paramterFormModal, setParamterFormModal] = useState(false)
  const [paramterDeleteModal, setParamterDeleteModal] = useState(false)

  const handleEditClick = useCallback((item: ParameterDefinition) => {
    setParameterDefinitionToEdit(item)
    setParamterFormModal(true)
  }, [])

  const handleDeleteClick = useCallback((item: ParameterDefinition) => {
    setParametrDefinitionTODelete(item)
    setParamterDeleteModal(true)
  }, [])

  const handleCreateClick = useCallback(() => {
    setParameterDefinitionToEdit(null)
    setParamterFormModal(true)
  }, [])
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
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
        </Table>
      </div>

      {paramterFormModal && (
        <ParameterDefinitionForm
          title={
            parameterDefinitionToEdit ? 'Edit Parameter Definition' : 'Add Parameter Definition'
          }
          setShowModal={setParamterFormModal}
          show={paramterFormModal}
          parameterDefinition={parameterDefinitionToEdit ?? null}
          domains={domains}
        />
      )}
      {paramterDeleteModal && (
        <DeleteModal
          title='Delete Parameter Definition'
          setShowModal={setParamterDeleteModal}
          url={route('parameter-definition.destroy', ParametrDefinitionTODelete?.id)}
        />
      )}
    </AppLayout>
  )
}
