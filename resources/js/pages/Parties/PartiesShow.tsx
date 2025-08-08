import AppLayout from '@/layouts/app-layout'
import Heading from '@/typography/Heading'
import { router } from '@inertiajs/react'

export default function PartiesShow() {
  const party = {
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
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  return (
    <AppLayout>
      <div className='p-6'>
        <Heading>Party Details</Heading>

        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-2xl font-semibold text-white'>
              {getInitials(party.name)}
            </div>
            <div>
              <div className='text-xl font-semibold'>{party.name}</div>
              <div className='text-gray-600'>Party Number: {party.party_id}</div>
              <div className='text-gray-600'>Connected: {party.effective_start.split('T')[0]}</div>
            </div>
          </div>
          <button
            onClick={() => router.visit(route('parties.edit', party.party_id))}
            className='rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300'
          >
            Edit Profile
          </button>
        </div>

        {/* Quick Actions */}
        <div className='mb-6'>
          <div className='mb-2 font-semibold text-gray-700'>Quick Actions</div>
          <div className='flex items-center gap-2'>
            <select className='rounded border px-3 py-2 text-sm'>
              <option>Add a Related Party</option>
            </select>
            <button className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
              Go
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className='mb-6'>
          <div className='mb-2 font-semibold text-gray-700'>Contact Information</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <div className='text-sm text-gray-500'>Premises Address</div>
              <div>{party.address}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Email</div>
              <div>{party.email_address}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Phone</div>
              <div>{party.mobile_number}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Telephone</div>
              <div>{party.telephone_number}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Fax</div>
              <div>{party.fax_number}</div>
            </div>
          </div>
        </div>

        {/* Connection Summary */}
        <div className='mb-6'>
          <div className='mb-2 font-semibold text-gray-700'>Connection Summary</div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div className='rounded border p-4 text-center'>
              <div className='text-sm text-gray-500'>Connected Load / Demand</div>
              <div className='text-xl font-bold'>{party.party_code}w / -</div>
            </div>
            <div className='rounded border p-4 text-center'>
              <div className='text-sm text-gray-500'>Tariff / Purpose</div>
              <div className='text-lg font-medium'>
                {party.party_type_id === 1 ? 'LT-1 / Domestic' : 'LT-2 / Commercial'}
              </div>
            </div>
            <div className='rounded border p-4 text-center'>
              <div className='text-sm text-gray-500'>Connection Status</div>
              <div className='font-medium text-green-600'>
                {party.is_current ? 'CN Connected & Using' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>

        {/* More Details */}
        <div className='mb-6'>
          <div className='mb-2 font-semibold text-gray-700'>More Details</div>
          <table className='w-full rounded border text-sm'>
            <tbody>
              <tr className='border-b'>
                <td className='p-3 font-medium text-gray-600'>Party Code</td>
                <td className='p-3'>{party.party_code}</td>
              </tr>
              <tr className='border-b'>
                <td className='p-3 font-medium text-gray-600'>Status</td>
                <td className='p-3'>{party.status_id === 1 ? 'Active' : 'Inactive'}</td>
              </tr>
              <tr className='border-b'>
                <td className='p-3 font-medium text-gray-600'>Date of Connection</td>
                <td className='p-3'>{party.effective_start.split('T')[0]}</td>
              </tr>
              <tr>
                <td className='p-3 font-medium text-gray-600'>Last Updated</td>
                <td className='p-3'>{party.updated_at.split('T')[0]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
