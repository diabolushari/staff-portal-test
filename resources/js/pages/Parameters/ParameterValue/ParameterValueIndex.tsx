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
import { ParameterDefinition, ParameterDomain, ParameterValues } from '@/interfaces/parameter_types'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ParameterValueSearchForm from '@/components/Parameter/ParameterValue/ParameterValueSearchForm'
import MainLayout from '@/layouts/main-layout'
import { settingsReferenceData } from '@/components/Navbar/navitems'
import ParameterValuesList from '@/components/Parameter/ParameterValue/ParameterValueList'
import ListSearch from '@/ui/Search/ListSearch'

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
    domain_name: string
    parameter_name: string
    search: string
  }
}) {
  const { formData, setFormValue } = useCustomForm({
    domain_name: filters.domain_name ?? '',
    parameter_name: filters.parameter_name ?? '',
    search: filters.search ?? '',
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
  console.log(values)
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={settingsReferenceData}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          title='Parameter Values'
          subheading='Add a new parameter value.'
          addUrl={route('parameter-value.create')}
        />

       <ListSearch
          title='Parameter Value'
          url={route('parameter-value.index')}
          search={filters.search}
        />
        <ParameterValueSearchForm
          parameterDomains={domains}
          parameterDefinitions={definitions}
          filters={filters}
        />

        <ParameterValuesList
          parameterValues={values}
          onView={(item) => router.get(route('parameter-value.show', item.id))}
          onEdit={(item) => router.get(route('parameter-value.edit', item.id))}
          onDelete={handleDeleteClick}
        />


        {/* <CustomTable
          columns={columns}
          caption='List of Parameter Values'
        >
          {values.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.parameter_code}</TableCell>
              <TableCell>{item.parameter_value}</TableCell>
              <TableCell>{item.definition?.parameter_name}</TableCell>
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
        </CustomTable> */}
        {showDeleteModal && editRow && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete ${editRow.parameter_value}`}
            url={route('parameter-value.destroy', editRow.id)}
          />
        )}
      </div>
    </MainLayout>
  )
}
