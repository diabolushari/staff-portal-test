import { TableRow } from '@/components/ui/table'
import { Office } from '@/interfaces/consumers'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { router } from '@inertiajs/react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offices',
    href: '/offices',
  },
]

export default function OfficeIndex({ offices }: { offices: Office[] }) {
  const columns = ['S.No', 'ID', 'Office Code', 'Office Description', 'Actions']
  const handleEditClick = (item: any) => {
    router.get(route('offices.edit', item.officeId))
  }
  const handleDeleteClick = (item: any) => {
    router.delete(route('offices.destroy', item.officeId))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CardHeader
          title='Offices'
          subheading='Add a new office.'
          addUrl={route('offices.create')}
        />
        <div>
          <CustomTable
            columns={columns}
            caption='List of Parameter Definitions'
          >
            {offices.map((item: any, index: number) => (
              <TableRow key={item.id}>
                <td className='px-4 py-2'>{index + 1}</td>
                <td className='px-4 py-2'>{item.id}</td>
                <td className='px-4 py-2'>{item.officeCode}</td>
                <td className='px-4 py-2'>{item.officeDescription}</td>
                <td className='px-4 py-2'>{item.officeTypeId}</td>

                <td className='px-4 py-2'>
                  <div className='flex space-x-2'>
                    <EditButton onClick={() => handleEditClick(item)} />
                    <DeleteButton onClick={() => handleDeleteClick(item)} />
                    <Button
                      onClick={() => router.get(route('offices.show', item.officeId))}
                      label='View'
                    />
                  </div>
                </td>
              </TableRow>
            ))}
          </CustomTable>
        </div>
      </div>
    </AppLayout>
  )
}
