import { TableCell, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import Heading from '@/typography/Heading'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import { route } from 'ziggy-js'

export default function PartiesIndex() {
  const handleEditClick = (row: any) => {
    console.log(row)
  }

  const handleDeleteClick = (row: any) => {
    console.log(row)
  }

  return (
    <AppLayout>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4'>
        <CardHeader
          title='Parties'
          subheading='Manage parties'
          addUrl={route('parties.create')}
        />
        <Card>
          <CustomTable
            columns={['S.No', 'ID', 'Name', 'Actions']}
            caption='List of parties'
          >
            {sampleConsumers.map((item: any, index: number) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <div className='flex space-x-2'>
                    <EditButton onClick={() => handleEditClick(item)} />
                    <DeleteButton onClick={() => handleDeleteClick(item)} />
                    <a href={route('parties.show', item.party_id)}>View</a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </CustomTable>
        </Card>
      </div>
    </AppLayout>
  )
}

const sampleConsumers = [
  {
    version_id: 1,
    party_id: 1001,
    party_code: 50123,
    party_legacy_code: 'LEG001-A',
    name: 'Ravi Kumar',
    party_type_id: 1, // INDIVIDUAL
    status_id: 1, // ACTIVE
    mobile_number: 9876543210,
    telephone_number: 4842233445,
    email_address: 'ravi.kumar@example.com',
    address: '34, MG Road, Ernakulam, Kerala - 682001',
    fax_number: 4842233000,
    effective_start: '2023-01-01T00:00:00',
    effective_end: null,
    is_current: true,
    created_by: 101,
    updated_by: 102,
    created_at: '2023-01-01T12:00:00',
    updated_at: '2023-06-15T08:45:00',
  },
  {
    version_id: 2,
    party_id: 1002,
    party_code: 50124,
    party_legacy_code: 'LEG002-C',
    name: 'KSEB Energy Pvt Ltd',
    party_type_id: 2, // COMPANY
    status_id: 2, // BLACKLISTED
    mobile_number: 9812345678,
    telephone_number: 4712556677,
    email_address: 'contact@ksebenergy.com',
    address: '22A, Technopark, Trivandrum, Kerala - 695581',
    fax_number: 4712556600,
    effective_start: '2022-05-10T00:00:00',
    effective_end: '2023-12-31T00:00:00',
    is_current: false,
    created_by: 101,
    updated_by: 104,
    created_at: '2022-05-10T09:00:00',
    updated_at: '2023-12-31T23:59:59',
  },
  {
    version_id: 3,
    party_id: 1003,
    party_code: 50125,
    party_legacy_code: 'LEG003-B',
    name: 'Meera Nair',
    party_type_id: 1, // INDIVIDUAL
    status_id: 1, // ACTIVE
    mobile_number: 9745612398,
    telephone_number: 4846678899,
    email_address: 'meera.nair@example.com',
    address: '56, Palace Road, Alappuzha, Kerala - 688001',
    fax_number: 4846678800,
    effective_start: '2024-03-20T00:00:00',
    effective_end: null,
    is_current: true,
    created_by: 103,
    updated_by: 103,
    created_at: '2024-03-20T11:30:00',
    updated_at: '2024-03-20T11:30:00',
  },
]
