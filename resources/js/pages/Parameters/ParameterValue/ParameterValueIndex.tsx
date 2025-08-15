import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { TableRow, TableCell } from '@/components/ui/table'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import SelectList from '@/ui/form/SelectList'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import { ParameterDefinition, ParameterDomain, ParameterValues } from '@/interfaces/paramater_types'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import DeleteModal from '@/ui/Modal/DeleteModal'

const columns = [
  'S.No',
  'ID',
  'Parameter Code',
  'Parameter Value',
  'Definition Name',
  'Notes',
  'Actions',
]

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Parameter Values',
    href: '/parameter-value',
  },
]

export default function ParameterValueIndex({
  values,
  domains,
  definitions,
  filters,
}: {
  values: ParameterValues[]
  domains: ParameterDomain[]
  definitions: ParameterDefinition[]
  filters: {
    domainName: string
    defenitionName: string
  }
}) {
  const { formData, setFormValue } = useCustomForm({
    domainName: filters.domainName ?? '',
    defenitionName: filters.defenitionName ?? '',
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editRow, setEditRow] = useState<ParameterValues | null>(null)
  const handleDeleteClick = (item: ParameterValues) => {
    setShowDeleteModal(true)
    setEditRow(item)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(route('parameter-value.index'), { ...formData })
  }

  const handleEditClick = (item: any) => {
    router.get(route('parameter-value.edit', item.id))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          title='Parameter Values'
          subheading='Add a new parameter value.'
          addUrl={route('parameter-value.create')}
        />

        <form
          onSubmit={handleSubmit}
          className='w-1/2'
        >
          <div className='grid grid-cols-3 gap-4'>
            <div className='relative flex flex-col'>
              <SelectList
                label='Domain Name'
                setValue={setFormValue('domainName')}
                value={formData.domainName}
                list={domains}
                dataKey='id'
                displayKey='domain_name'
              />
              {formData.domainName && (
                <button
                  type='button'
                  onClick={() => setFormValue('domainName')('')}
                  className='absolute top-9 right-2 text-lg text-gray-500 hover:text-red-600'
                >
                  ×
                </button>
              )}
            </div>

            <div className='relative flex flex-col'>
              <SelectList
                label='Definition Name'
                setValue={setFormValue('defenitionName')}
                value={formData.defenitionName}
                list={definitions}
                dataKey='parameter_name'
                displayKey='parameter_name'
              />
              {formData.defenitionName && (
                <button
                  type='button'
                  onClick={() => setFormValue('defenitionName')('')}
                  className='absolute top-9 right-2 text-lg text-gray-500 hover:text-red-600'
                >
                  ×
                </button>
              )}
            </div>

            <div className='flex items-end'>
              <Button
                label='Search'
                type='submit'
              />
            </div>
          </div>
        </form>

        <CustomTable
          columns={columns}
          caption='List of Parameter Values'
        >
          {values.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.parameter_code}</TableCell>
              <TableCell>{item.parameter_value}</TableCell>
              <TableCell>{item.definition_id}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>
                <div className='flex space-x-2'>
                  <EditButton onClick={() => handleEditClick(item)} />
                  <DeleteButton onClick={() => handleDeleteClick(item)} />

                  <a
                    href={route('parameter-value.show', item.id)}
                    className='rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700'
                  >
                    View
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
        {showDeleteModal && editRow && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete ${editRow.parameter_value}`}
            url={route('parameter-value.destroy', editRow.id)}
          />
        )}
      </div>
    </AppLayout>
  )
}
