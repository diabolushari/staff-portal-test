import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import ParameterDefinitionActionModal from '@/components/Parameter/ParametrDefinition/ParameterDefinitionActionModal'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { TableRow } from '@/components/ui/table'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import { ParameterDefinition } from '@/interfaces/paramater_service'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Parameter Definition',
    href: '/parameter-definition',
  },
]

export default function ParameterDefinitionIndex({
  parameterDefinitions,
}: {
  parameterDefinitions: ParameterDefinition[]
}) {
  const [showModal, setShowModal] = useState(false)
  const [editRow, setEditRow] = useState<ParameterDefinition | null>(null)

  const columns = [
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

  const handleEditClick = (item: ParameterDefinition) => {
    setEditRow(item)
    setShowModal(true)
  }

  const handleDeleteClick = (item: ParameterDefinition) => {
    if (confirm('Are you sure you want to delete this item?')) {
      router.delete(route('parameter-definition.destroy', item.id))
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='p-4'>
        <CardHeader
          title='Parameter Definition'
          subheading='Parameter Definition'
          onAddClick={() => {
            setEditRow(null)
            setShowModal(true)
          }}
        />
        <CustomTable
          columns={columns}
          caption='List of Parameter Definitions'
        >
          {parameterDefinitions.map((item: ParameterDefinition, index: number) => (
            <TableRow key={item.id}>
              <td className='px-4 py-2'>{index + 1}</td>
              <td className='px-4 py-2'>{item.id}</td>
              <td className='px-4 py-2'>{item.name}</td>
              <td className='px-4 py-2'>{item.domainName}</td>
              <td className='px-4 py-2'>{item.attribute1}</td>
              <td className='px-4 py-2'>{item.attribute2}</td>
              <td className='px-4 py-2'>{item.attribute3}</td>
              <td className='px-4 py-2'>{item.attribute4}</td>
              <td className='px-4 py-2'>{item.attribute5}</td>
              <td className='px-4 py-2'>
                <div className='flex space-x-2'>
                  <EditButton onClick={() => handleEditClick(item)} />
                  <DeleteButton onClick={() => handleDeleteClick(item)} />
                  {/* Optional View button */}
                  {/* <a
                    href={route('parameter-definition.show', item.id)}
                    className="rounded bg-green-600 px-3 py-1 text-white text-sm hover:bg-green-700"
                  >
                    View
                  </a> */}
                </div>
              </td>
            </TableRow>
          ))}
        </CustomTable>
      </div>

      {showModal && (
        <ParameterDefinitionActionModal
          show={showModal}
          onClose={() => setShowModal(false)}
          editRow={editRow}
        />
      )}
    </AppLayout>
  )
}
