import { billingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import { Bill, BillingGroup, BillWithException } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import { router } from '@inertiajs/react'

interface Props {
  bills: BillWithException
  billing_group: BillingGroup
}

export default function BillJobStatusShowPage({ bills, billing_group }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
  })

  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  const handleViewBillClick = (bill: Bill) => {
    router.get(route('bills.show', bill?.bill_id))
  }
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Billing Jobs',
      href: '/bills/job-status',
    },
    {
      title: `Bill Group ${billing_group?.name} Bills`,
      href: `/bills/job-status/${billing_group?.billing_group_id}`,
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={billingNavItems}
      title={`Bill Cycle List for ${billing_group?.name}, December 2025`}
    >
      <div className='flex flex-col gap-4 p-4'>
        <div className='grid grid-cols-2 gap-4'>
          <form
            onSubmit={handleSearchClick}
            className='flex gap-4'
          >
            <div>
              <Input
                label='Consumer Number/Name/Type/Purpose'
                value={formData.search}
                setValue={setFormValue('search')}
              />
            </div>

            <div className='mt-6'>
              <Button
                label='Search'
                type='submit'
              />
            </div>
          </form>
          <div className='mt-6 flex justify-end gap-2'>
            <div>
              <Button
                onClick={() => {}}
                label='Go'
              />
            </div>
          </div>
        </div>
        {bills?.bills?.length > 0 &&
          bills?.bills?.map((bill: Bill) => (
            <Card className='mb-6 overflow-hidden rounded-lg border p-0 shadow-sm'>
              {/* Top Gray Header */}
              <div className='grid grid-cols-2 gap-4 bg-gray-200 px-6 py-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='font-medium text-gray-700'>{bill?.consumer?.organization_name}</p>
                    <p className='text-xs text-gray-500'>Name</p>
                  </div>

                  <div>
                    <p className='font-medium text-gray-700'>{bill?.bill_amount}</p>
                    <p className='text-xs text-gray-500'>Bill Amount</p>
                  </div>

                  <div>
                    <p className='font-medium text-gray-700'>{bill?.connection?.consumer_number}</p>
                    <p className='text-xs text-gray-500'>Consumer Number</p>
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>
                      {bill?.connection?.connection_type?.parameter_value}
                    </p>
                    <p className='text-xs text-gray-500'>Type</p>
                  </div>
                </div>
              </div>

              {/* Body Section */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid grid-cols-2 gap-y-4 px-6 py-5'>
                  <div>
                    <p className='font-medium text-gray-700'>{bill?.bill_year_month}</p>
                    <p className='text-xs text-gray-500'>Bill Month & Year</p>
                  </div>

                  <div>
                    <p className='col-span-2 font-medium text-gray-700'>
                      {bill?.reading_year_month}
                    </p>
                    <p className='text-xs text-gray-500'>Reading Month & Year</p>
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>{bill?.bill_date}</p>
                    <p className='text-xs text-gray-500'>Bill Date</p>
                  </div>

                  <div>
                    <p className='font-medium text-gray-700'>{bill.due_date}</p>
                    <p className='text-xs text-gray-500'>Due Date</p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-y-4 py-5'>
                  <div className='flex flex-col gap-4'>
                    <div>
                      <p className='font-medium text-gray-700'>{bill?.dc_date}</p>
                      <p className='text-xs text-gray-500'>DC Date</p>
                    </div>
                    <div>
                      {bill?.remarks && (
                        <>
                          <p className='font-medium text-gray-700'>{bill?.remarks}</p>
                          <p className='text-xs text-gray-500'>Remarks</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className='flex justify-end border-t px-6 py-4'>
                <Button
                  label='View Bill'
                  onClick={() => handleViewBillClick(bill)}
                />
              </div>
            </Card>
          ))}
        {/* ================= EXCEPTIONS SECTION ================= */}
        {bills?.exceptions?.length > 0 && (
          <div className='mt-8'>
            <h2 className='mb-4 text-lg font-semibold'>
              Billing Exceptions ({bills.exceptions.length})
            </h2>

            <div className='flex flex-col gap-4'>
              {bills.exceptions.map((ex) => (
                <Card
                  key={ex.bill_job_generation_status_id}
                  className='border border-red-200'
                >
                  {/* Header */}
                  <div className='grid grid-cols-3 gap-4 px-6 py-3'>
                    <div>
                      <p className='font-medium text-gray-800'>{ex.connection?.consumer_number}</p>
                      <p className='text-xs text-gray-500'>Consumer Number</p>
                    </div>

                    <div>
                      <p className='font-medium text-gray-800'>
                        {ex.connection?.consumer?.organization_name}
                      </p>
                      <p className='text-xs text-gray-500'>Consumer Name</p>
                    </div>

                    <div>
                      <p className='font-medium text-red-700'>Exception</p>
                      <p className='text-xs text-gray-500'>{ex?.exception}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className='grid grid-cols-3 gap-4 px-6 py-4'>
                    <div>
                      <p className='font-medium text-gray-700'>{ex.reading_year_month}</p>
                      <p className='text-xs text-gray-500'>Reading Month</p>
                    </div>

                    <div>
                      <p className='font-medium text-gray-700'>{ex.bill_year_month}</p>
                      <p className='text-xs text-gray-500'>Bill Month</p>
                    </div>

                    <div>
                      <p className='font-medium text-gray-700'>{ex.initialized_date}</p>
                      <p className='text-xs text-gray-500'>Initialized Date</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className='border-t px-6 py-3'>
                    <p className='text-sm text-red-700'>
                      ⚠ Bill not generated for this connection
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
