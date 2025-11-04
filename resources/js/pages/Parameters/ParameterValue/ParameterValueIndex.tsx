import { settingsReferenceData } from '@/components/Navbar/navitems'
import ParameterValuesList from '@/components/Parameter/ParameterValue/ParameterValueList'
import ParameterValueSearchForm from '@/components/Parameter/ParameterValue/ParameterValueSearchForm'
import useCustomForm from '@/hooks/useCustomForm'
import { ParameterDefinition, ParameterDomain, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'

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

interface Props {
  values: ParameterValues[]
  domains: ParameterDomain[]
  definitions: ParameterDefinition[]
  filters: {
    domain_name: string
    parameter_name: string
    search: string
  }
}

export default function ParameterValueIndex({ values, domains, definitions, filters }: Props) {
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

  const handleCreateClick = () => {
    router.get(route('parameter-value.create'))
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={settingsReferenceData}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-[#252c32]'>Parameter Values</h2>
          <Button
            label='Add Value'
            onClick={handleCreateClick}
            variant='primary'
          />
        </div>
        <ListSearch
          title='Parameter Value'
          url={route('parameter-value.index')}
          search={filters.search}
          filters={filters}
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
