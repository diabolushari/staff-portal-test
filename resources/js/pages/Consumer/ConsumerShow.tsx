import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import { Connection, ConsumerData, MeterAssignment } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { router } from '@inertiajs/react'
import { PencilIcon } from 'lucide-react'

interface ConsumerShowProps {
  consumer: ConsumerData
  connection: Connection
  meters: MeterAssignment[]
}

const safe = (v: unknown, fallback = '-') =>
  v === null || v === undefined || v === '' ? fallback : String(v)

const fmtLocal = (iso?: string | null) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString()
}

const InfoBlock = ({ label, value }: { label: string; value?: string | number }) => (
  <div className='space-y-1'>
    <label className='text-sm font-normal text-[#252c32]'>{label}</label>
    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
      {value || '-'}
    </div>
  </div>
)

export default function ConsumerShow({ consumer, connection }: Readonly<ConsumerShowProps>) {
  const onEdit = () => router.visit(`/consumers/${Number(consumer?.consumer?.connection_id)}/edit`)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Connections',
      href: '/connections',
    },
    {
      title: connection?.consumer_number.toString() ?? '',
      href: route('connections.show', connection?.connection_id),
    },
    {
      title: 'Consumer',
      href: route('connection.consumer', connection?.connection_id),
    },
  ]
  console.log(consumer)

  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id}
      value='connection'
      subTabValue='consumer'
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      heading={`Connection #${connection?.consumer_number}`}
      onEdit={() => router.visit(route('connection.consumer', connection?.connection_id))}
      subHeading='Consumer'
      consumerExist={true}
      meterExist={connection?.meter_mappings?.length > 0}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto'>
        {/* --- Basic Information --- */}
        <Card className='rounded-lg p-7'>
          <div className='mb-6 flex items-center justify-between'>
            <StrongText className='text-base font-semibold text-[#252c32]'>
              Basic Information
            </StrongText>
            <button
              onClick={onEdit}
              className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
            >
              <PencilIcon className='h-4 w-4' />
              Edit
            </button>
          </div>
          <hr className='mb-6 border-[#e5e9eb]' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <InfoBlock
              label='Organization Name'
              value={safe(consumer.consumer.organization_name)}
            />
            <InfoBlock
              label='Applicant Code'
              value={safe(consumer.consumer.applicant_code)}
            />
            <InfoBlock
              label='Consumer Type'
              value={consumer.consumer.consumer_type?.parameter_value}
            />
            <InfoBlock
              label='Consumer CIN'
              value={safe(consumer.consumer.consumer_cin)}
            />
            <InfoBlock
              label='PAN'
              value={safe(consumer.consumer.consumer_pan)}
            />
            <InfoBlock
              label='TAN'
              value={safe(consumer.consumer.consumer_tan)}
            />
            <InfoBlock
              label='GSTIN'
              value={safe(consumer.consumer.consumer_gstin)}
            />
          </div>
        </Card>
        <Card className='rounded-lg p-7'>
          <StrongText className='text-base font-semibold text-[#252c32]'>Indicators</StrongText>
        </Card>

        {/* --- Contact --- */}
        {/* --- Contact --- */}
        <Card className='rounded-lg p-7'>
          <StrongText className='text-base font-semibold text-[#252c32]'>Contact</StrongText>
          <hr className='my-4 border-[#e5e9eb]' />

          {/* Primary Contact */}
          <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
            <InfoBlock
              label='Primary Email'
              value={safe(consumer.contact?.primary_email)}
            />
            <InfoBlock
              label='Primary Phone'
              value={safe(consumer.contact?.primary_phone)}
            />
          </div>

          {/* Pending Contacts */}
          {consumer.contact?.contact_folio?.length ? (
            <div>
              <StrongText className='text-sm font-semibold text-[#252c32]'>
                Pending Contacts
              </StrongText>
              <hr className='my-3 border-[#e5e9eb]' />
              <div className='flex flex-col gap-4'>
                {consumer.contact.contact_folio.map((folio, index) => (
                  <Card
                    key={index}
                    className='rounded-lg border border-gray-200 bg-gray-50 p-4'
                  >
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <InfoBlock
                        label='Email'
                        value={safe(folio.email)}
                      />
                      <InfoBlock
                        label='Phone'
                        value={safe(folio.phone)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className='text-sm text-gray-500'>No pending contacts found</div>
          )}
        </Card>

        {/* --- Addresses --- */}
        {['primary_address', 'billing_address', 'premises_address'].map((key) => {
          const addr = consumer.contact?.[key]
          return (
            <Card
              key={key}
              className='rounded-lg p-7'
            >
              <StrongText className='text-base font-semibold text-[#252c32] capitalize'>
                {key.replace('_', ' ')}
              </StrongText>
              <hr className='my-4 border-[#e5e9eb]' />
              {addr ? (
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <InfoBlock
                    label='Address Line 1'
                    value={safe(addr.address_line1)}
                  />
                  <InfoBlock
                    label='Address Line 2'
                    value={safe(addr.address_line2)}
                  />
                  <InfoBlock
                    label='City/Town/Village'
                    value={safe(addr.city_town_village)}
                  />
                  <InfoBlock
                    label='State'
                    value={safe(addr.state.name)}
                  />
                  <InfoBlock
                    label='District'
                    value={safe(addr.district.name)}
                  />
                  <InfoBlock
                    label='Pincode'
                    value={safe(addr.pincode)}
                  />
                </div>
              ) : (
                <div className='text-slate-600'>No {key} found</div>
              )}
            </Card>
          )
        })}
      </div>
    </ConnectionsLayout>
  )
}
