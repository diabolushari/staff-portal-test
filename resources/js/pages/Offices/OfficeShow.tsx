import AppLayout from '@/layouts/app-layout'
import CardHeader from '@/ui/Card/CardHeader'
import { Office } from '@/interfaces/consumers'
import { router } from '@inertiajs/react'

export default function OfficeShow({ office }: { office: Office }) {
  const {
    officeCode,
    officeDescription,
    officeTypeId,
    contactFolio,
    effectiveStart,
    effectiveEnd,
    createdAt,
    updatedAt,
  } = office

  const formatDate = (dateStr?: string) => (dateStr ? new Date(dateStr).toLocaleDateString() : '-')

  return (
    <AppLayout>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4'>
        <CardHeader
          titleClassName='2xl:text-2xl'
          title='Office Details'
          subheading='Manage office information and details.'
        />

        {/* Office Summary */}
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='mb-4 flex items-center'>
            <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-2xl font-bold text-white'>
              {officeCode}
            </div>
            <div>
              <div className='text-lg font-semibold text-gray-800'>{officeCode}</div>
              <div className='text-sm text-gray-500'>Office Description: {officeDescription}</div>
              <div className='text-sm text-gray-500'>Office Type: {officeTypeId}</div>
            </div>
            <button
              className='ml-auto rounded bg-gray-200 px-4 py-2 text-sm text-gray-700'
              onClick={() => router.visit(route('offices.edit', office.officeId))}
            >
              Edit Office
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='mb-4 text-lg font-semibold text-gray-800'>Contact Information</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <div className='text-sm text-gray-500'>Name</div>
              <div className='font-medium text-gray-800'>{contactFolio?.name ?? '-'}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Email</div>
              <div className='font-medium text-gray-800'>{contactFolio?.email ?? '-'}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Phone</div>
              <div className='font-medium text-gray-800'>{contactFolio?.phone ?? '-'}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Address</div>
              <div className='font-medium text-gray-800'>{contactFolio?.address ?? '-'}</div>
            </div>
          </div>
        </div>

        {/* Validity Dates */}
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='mb-4 text-lg font-semibold text-gray-800'>Validity Period</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <div className='text-sm text-gray-500'>Effective Start</div>
              <div className='font-medium text-gray-800'>{formatDate(effectiveStart)}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Effective End</div>
              <div className='font-medium text-gray-800'>{formatDate(effectiveEnd)}</div>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='mb-4 text-lg font-semibold text-gray-800'>Record Metadata</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <div className='text-sm text-gray-500'>Created At</div>
              <div className='font-medium text-gray-800'>{formatDate(createdAt)}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Updated At</div>
              <div className='font-medium text-gray-800'>{formatDate(updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
