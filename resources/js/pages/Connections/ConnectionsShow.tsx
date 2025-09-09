import { connectionsNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { PencilIcon, Zap, Users, Calendar } from 'lucide-react'
import { router } from '@inertiajs/react'
import { Connection } from '@/interfaces/consumers'

export default function ConnectionsShow({ connection }: Readonly<{ connection: Connection }>) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Connections', href: '/connections' },
    { title: 'Show', href: route('connection.consumer', connection.connection_id) },
  ]

  const formatDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-'

  const tabs = [
    {
      value: 'details',
      label: 'Connection Details',
      href: route('connections.show', connection.connection_id),
    },
    {
      value: 'consumer',
      label: 'Consumer',
      href: route('connection.consumer', connection.connection_id),
    },
  ]

  console.log(connection)

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connectionsNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <StrongText className='text-2xl font-semibold text-[#252c32]'>
              Connection #{connection.connection_id}
            </StrongText>
            <span className='text-sm text-gray-600'>Consumer No: {connection.consumer_number}</span>
          </div>
          <button
            onClick={() => router.visit(route('connections.edit', connection.connection_id))}
            className='flex items-center gap-2 rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
          >
            Edit
          </button>
        </div>

        {/* Tabs */}
        <TabGroup tabs={tabs}>
          <TabsContent value='details'>
            <div className='space-y-6'>
              {/* Basic Info */}
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Basic Information
                  </StrongText>
                  <button
                    onClick={() =>
                      router.visit(route('connections.edit', connection.connection_id))
                    }
                    className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] hover:bg-gray-50'
                  >
                    <PencilIcon className='h-4 w-4' />
                    Edit
                  </button>
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {/* <Field
                    label='Connection ID'
                    value={connection.connection_id}
                  /> */}
                  <Field
                    label='Consumer Number'
                    value={connection.consumer_number}
                  />
                  <Field
                    label='Connection Type'
                    value={connection.connection_type?.parameter_value}
                  />
                  <Field
                    label='Status'
                    value={connection.connection_status?.parameter_value}
                  />
                  <Field
                    label='Voltage'
                    value={connection.voltage?.parameter_value}
                  />
                  <Field
                    label='Phase Type'
                    value={connection.phase_type?.parameter_value}
                  />
                  <Field
                    label='Contract Demand (KVA)'
                    value={connection.contract_demand_kw_val}
                  />
                </div>
              </Card>

              {/* Dates */}
              <Card className='rounded-lg p-7'>
                <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
                  Dates
                </StrongText>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <Field
                    label='Connected Date'
                    value={formatDate(connection.connected_date)}
                  />
                  <Field
                    label='Effective Start'
                    value={formatDate(connection.effective_start)}
                  />
                  <Field
                    label='Effective End'
                    value={formatDate(connection.effective_end)}
                  />
                  <Field
                    label='Updated At'
                    value={formatDate(connection.updated_at)}
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='activity'>
            <Card className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <StrongText className='text-lg font-semibold text-gray-900'>
                  Activity History
                </StrongText>
              </div>
              <div className='py-12 text-center'>
                <Calendar className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <p className='text-gray-600'>Activity history will be displayed here</p>
                <p className='mt-2 text-sm text-gray-500'>Feature coming soon</p>
              </div>
            </Card>
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}

/* Small reusable field component */
function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className='space-y-1'>
      <label className='text-sm font-normal text-[#252c32]'>{label}</label>
      <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
        {value ?? '-'}
      </div>
    </div>
  )
}
