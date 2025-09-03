import { router } from '@inertiajs/react'
import MainLayout from '@/layouts/main-layout'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { TabsContent } from '@radix-ui/react-tabs'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import TinyContainer from '@/ui/Card/TinyContainer'
import { Calendar, PencilIcon } from 'lucide-react'

interface ConsumerShowProps {
  consumer: any
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Consumers',
    href: '/consumers',
  },
]

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

export default function ConsumerShow({ consumer }: Readonly<ConsumerShowProps>) {
  const onEdit = () => router.visit(`/consumers/${Number(consumer?.consumer?.connection_id)}/edit`)
  const onBack = () => router.visit('/consumers')
  console.log(consumer)
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connectionsNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header Section */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <StrongText className='text-2xl font-semibold text-[#252c32]'>
                {safe(consumer?.consumer?.organization_name)}
              </StrongText>
              <TinyContainer variant='success'>Consumer</TinyContainer>
            </div>
            <div className='text-sm text-slate-600'>
              Connection ID:{' '}
              <span className='font-medium'>{consumer?.consumer?.connection_id}</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={onBack}
              className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#252c32] transition-colors hover:bg-gray-50'
            >
              Back
            </button>
            <button
              onClick={onEdit}
              className='flex items-center gap-2 rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
            >
              Edit Details
            </button>
          </div>
        </div>

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
              label='Applicant Code'
              value={safe(consumer.consumer.applicant_code)}
            />
            <InfoBlock
              label='Consumer Type'
              value={safe(consumer.consumer_type_id)}
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
            <InfoBlock
              label='Income Tax Withholding'
              value={consumer.consumer.income_tax_withholding_ind ? 'Yes' : 'No'}
            />
            <InfoBlock
              label='GST Withholding'
              value={consumer.consumer.gst_withholding_ind ? 'Yes' : 'No'}
            />
          </div>
        </Card>

        {/* --- Contact --- */}
        <Card className='rounded-lg p-7'>
          <StrongText className='text-base font-semibold text-[#252c32]'>Contact</StrongText>
          <hr className='my-4 border-[#e5e9eb]' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <InfoBlock
              label='Email'
              value={safe(consumer.contact?.primary_email)}
            />
            <InfoBlock
              label='Phone'
              value={safe(consumer.contact?.primary_phone)}
            />
            <InfoBlock
              label='Contact Folio'
              value={safe(consumer.contact?.contact_folio)}
            />
          </div>
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
                    value={safe(addr.address_line_1)}
                  />
                  <InfoBlock
                    label='Address Line 2'
                    value={safe(addr.address_line_2)}
                  />
                  <InfoBlock
                    label='City/Town/Village'
                    value={safe(addr.city_town_village)}
                  />
                  <InfoBlock
                    label='State'
                    value={safe(addr.state)}
                  />
                  <InfoBlock
                    label='District ID'
                    value={safe(addr.district_id)}
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

        {/* --- Activity --- */}
        <Card className='p-6'>
          <div className='py-12 text-center'>
            <Calendar className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <p className='text-gray-600'>Activity history will be displayed here</p>
            <p className='mt-2 text-sm text-gray-500'>Feature coming soon</p>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
