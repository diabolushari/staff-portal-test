import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import TinyContainer from '@/ui/Card/TinyContainer'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { router } from '@inertiajs/react'
import { TabsContent } from '@radix-ui/react-tabs'
import { Calendar, PencilIcon } from 'lucide-react'

//TODO should have a seperate types file
interface Party {
  version_id: number
  party_id: number
  party_code: number | string
  party_legacy_code?: string | null
  name: string
  party_type_id: number
  party_type?: { id: number; parameter_value: string } | null
  status_id: number
  status?: { id: number; parameter_value: string } | null
  effective_start: string
  effective_end?: string | null
  is_current: boolean
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string | null
  mobile_number?: number | string | null
  telephone_number?: number | string | null
  email_address?: string | null
  address?: string | null
  fax_number?: number | string | null
}

interface Props {
  party: Party
}

// Hash-based color for avatar bg for consistency
const hashColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 85% 45%)`
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)

const fmtLocal = (iso?: string | null) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString() // local time/date
}

const fmtDate = (iso?: string | null) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString()
}

const safe = (v: unknown, fallback = '-') =>
  v === null || v === undefined || v === '' ? fallback : String(v)

//TODO seperate component file
const StatusBadge = ({ text }: { text: string }) => {
  const s = text.toLowerCase()
  const tone = s.includes('active')
    ? 'green'
    : s.includes('blacklist') || s.includes('inactive')
      ? 'red'
      : 'slate'
  const map: Record<string, string> = {
    green: 'bg-green-50 text-green-700 ring-green-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${map[tone]}`}
    >
      {text}
    </span>
  )
}
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Parties',
    href: route('parties.index'),
  },
]
const Pill = ({
  ok,
  trueText = 'Current',
  falseText = 'Archived',
}: {
  ok: boolean
  trueText?: string
  falseText?: string
}) => {
  return ok ? (
    <span className='inline-flex items-center gap-1 text-green-700'>
      <span className='h-2 w-2 rounded-full bg-green-500' />
      {trueText}
    </span>
  ) : (
    <span className='inline-flex items-center gap-1 text-slate-600'>
      <span className='h-2 w-2 rounded-full bg-slate-400' />
      {falseText}
    </span>
  )
}

export default function PartiesShow({ party }: Props) {
  const statusText =
    party?.status?.parameter_value ?? (party.status_id === 1 ? 'Active' : 'Inactive')
  const typeText =
    party?.party_type?.parameter_value ?? (party.party_type_id === 1 ? 'Individual' : 'Company')
  const avatarBg = hashColor(party?.name ?? 'P')

  const onEdit = () => router.visit(route('parties.edit', party.version_id))
  const onBack = () => router.visit(route('parties.index'))

  //TODO should be separate component
  const InfoBlock = ({ label, value }: { label: string; value?: string | number }) => (
    <div className='space-y-1'>
      <label className='text-sm font-normal text-[#252c32]'>{label}</label>
      <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
        {value || '-'}
      </div>
    </div>
  )
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={consumerNavItems}
      selectedItem='/parties'
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header Section */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <StrongText className='text-2xl font-semibold text-[#252c32]'>
                {party.party_code} - {safe(party.name)}
              </StrongText>
              <TinyContainer variant={party.is_current ? 'success' : 'danger'}>
                {party.is_current ? 'Active' : 'Inactive'}
              </TinyContainer>
              <StatusBadge text={statusText} />
            </div>
            <div className='text-sm text-slate-600'>
              Party ID: <span className='font-medium'>{party.party_id}</span>
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

        {/* Main Content Tabs */}
        <TabGroup
          tabs={[
            {
              value: 'details',
              label: 'Details',
            },
            {
              value: 'activity',
              label: 'Activity',
            },
          ]}
        >
          {/* Basic Info */}
          <TabsContent value='details'>
            <div className='space-y-4'>
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
                    label='Party Code'
                    value={safe(party.party_code)}
                  />
                  <InfoBlock
                    label='Type'
                    value={typeText}
                  />
                  <InfoBlock
                    label='Legacy Code'
                    value={safe(party.party_legacy_code)}
                  />
                  <InfoBlock
                    label='Effective Start'
                    value={fmtLocal(party.effective_start)}
                  />
                  <InfoBlock
                    label='Effective End'
                    value={party.effective_end ? fmtLocal(party.effective_end) : 'Ongoing'}
                  />
                </div>
              </Card>

              {/* Contact */}
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Contact
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
                    label='Email'
                    value={safe(party.email_address)}
                  />
                  <InfoBlock
                    label='Mobile'
                    value={safe(party.mobile_number)}
                  />
                  <InfoBlock
                    label='Telephone'
                    value={safe(party.telephone_number)}
                  />
                  <InfoBlock
                    label='Fax'
                    value={safe(party.fax_number)}
                  />
                </div>
              </Card>

              {/* Address */}
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Address
                  </StrongText>
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-normal text-[#252c32]'>
                  {safe(party.address)}
                </div>
              </Card>

              {/* Metadata */}
              <Card className='rounded-lg p-7'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Metadata
                  </StrongText>
                </div>
                <hr className='mb-6 border-[#e5e9eb]' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  <InfoBlock
                    label='Version'
                    value={party.version_id}
                  />
                  <InfoBlock
                    label='Created By'
                    value={safe(party.created_by)}
                  />
                  <InfoBlock
                    label='Updated By'
                    value={safe(party.updated_by)}
                  />
                  <InfoBlock
                    label='Created At'
                    value={fmtLocal(party.created_at)}
                  />
                  <InfoBlock
                    label='Updated At'
                    value={party.updated_at ? fmtLocal(party.updated_at) : '-'}
                  />
                  <InfoBlock
                    label='Status'
                    value={statusText}
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Future Tabs (like Substations, Consumers, Activity) */}
          <TabsContent value='activity'>
            <Card className='p-6'>
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
