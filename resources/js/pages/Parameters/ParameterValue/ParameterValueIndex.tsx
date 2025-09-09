import { settingsReferenceData } from '@/components/Navbar/navitems'
import ParameterValuesList from '@/components/Parameter/ParameterValue/ParameterValueList'
import ParameterValueSearchForm from '@/components/Parameter/ParameterValue/ParameterValueSearchForm'
import useCustomForm from '@/hooks/useCustomForm'
import { ParameterDefinition, ParameterDomain, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { router } from '@inertiajs/react'
import React, { useState } from 'react'
import { route } from 'ziggy-js'

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
//TODO missing props interface
//TODO what happens when you delete attribute from definition

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
