import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import ParameterDefinitionActionModal from '@/components/Parameter/ParametrDefinition/ParameterDefinitionActionModal'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { TableRow } from '@/components/ui/table'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Parameter Definition',
    href: '/parameter-definition',
  },
]

export default function ParameterDefinitionIndex({
  parameterDefinitions,
}: {
  parameterDefinitions: any
}) {
  const [showModal, setShowModal] = useState(false)
  const [editRow, setEditRow] = useState<any>(null)

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

  const handleEditClick = (item: any) => {
    setEditRow(item)
    setShowModal(true)
  }

  const handleDeleteClick = (item: any) => {
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
          {parameterDefinitions.map((item: any, index: number) => (
            <TableRow key={item.id}>
              <td className='px-4 py-2'>{index + 1}</td>
              <td className='px-4 py-2'>{item.id}</td>
              <td className='px-4 py-2'>{item.parameter_name}</td>
              <td className='px-4 py-2'>{item.domain_name}</td>
              <td className='px-4 py-2'>{item.attribute1_name}</td>
              <td className='px-4 py-2'>{item.attribute2_name}</td>
              <td className='px-4 py-2'>{item.attribute3_name}</td>
              <td className='px-4 py-2'>{item.attribute4_name}</td>
              <td className='px-4 py-2'>{item.attribute5_name}</td>
              <td className='px-4 py-2'>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => handleEditClick(item)}
                    className='rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className='rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700'
                  >
                    Delete
                  </button>
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
