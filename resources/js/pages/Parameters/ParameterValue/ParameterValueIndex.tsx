import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { TableRow, TableCell } from '@/components/ui/table'
import { router } from '@inertiajs/react'
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

export default function ParameterValueIndex({ values }: { values: any[] }) {
  const handleDeleteClick = (item: any) => {
    if (confirm('Are you sure you want to delete this item?')) {
      router.delete(route('parameter-value.destroy', item.id))
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          title='Parameter Values'
          subheading='Add a new parameter value.'
          addUrl={route('parameter-value.create')}
        />

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
              <TableCell>{item.definition_name}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>
                <div className='flex space-x-2'>
                  <a
                    href={route('parameter-value.edit', item.id)}
                    className='rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className='rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700'
                  >
                    Delete
                  </button>
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
      </div>
    </AppLayout>
  )
}
