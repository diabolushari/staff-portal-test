import { router } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { route } from 'ziggy-js'
import { TableCell, TableRow } from '@/components/ui/table'
import { Party } from '@/interfaces/parties'
import AppLayout from '@/layouts/app-layout'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import CustomTable from '@/ui/Table/CustomTable'
import MainLayout from '@/layouts/main-layout'
import { partiesNavItems } from '@/components/Navbar/navitems'
import ListSearch from '@/ui/Search/ListSearch'

function StatusBadge({
  text,
  tone = 'default',
}: {
  text: string
  tone?: 'success' | 'warning' | 'danger' | 'default'
}) {
  const color =
    tone === 'success'
      ? 'bg-green-50 text-green-700 ring-green-200'
      : tone === 'warning'
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : tone === 'danger'
          ? 'bg-red-50 text-red-700 ring-red-200'
          : 'bg-slate-50 text-slate-700 ring-slate-200'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${color}`}
    >
      {text}
    </span>
  )
}

interface Props {
  parties: {
    success: boolean
    data: Party[]
    error: unknown
  }
}
const breadcrumbs = [
  {
    title: 'Parties',
    href: '/parties',
  },
]
interface AugmentedParty extends Party {
  status_text: string
  email: string
  phone: string
  effStart: Date | null
  effEnd: Date | null
}

type SortKey = 'party_id' | 'party_code' | 'name' | 'status_text' | 'is_current' | 'effective_start'

export default function PartiesIndex({ parties }: Props) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentFilter, setCurrentFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('effective_start')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleEditClick = (row: Party) => {
    router.get(`/parties/${row.version_id}/edit`)
  }

  const handleDeleteClick = async (row: Party) => {
    if (!confirm(`Delete party "${row.name ?? row.party_code}"? This action cannot be undone.`))
      return

    router.delete(`/parties/${row.party_id}`, {
      preserveScroll: true,
    })
  }

  interface StatusObject {
    parameter_value: string
  }

  const normalizeStatus = (item: Party & { status?: StatusObject }): string => {
    const byPayload = item?.status?.parameter_value
    if (byPayload) return byPayload

    const map: Record<number, string> = {
      1: 'Active',
      2: 'Blacklisted',
    }
    return map[item.status_id] ?? 'Unknown'
  }

  const getStatusTone = (statusText: string): 'success' | 'warning' | 'danger' | 'default' => {
    const s = statusText.toLowerCase()
    if (s.includes('active')) return 'success'
    if (s.includes('blacklist') || s.includes('inactive')) return 'danger'
    return 'default'
  }

  const rows = useMemo((): AugmentedParty[] => {
    const list: Party[] = Array.isArray(parties?.data) ? parties.data : []

    const augmented: AugmentedParty[] = list.map((item) => {
      const status_text = normalizeStatus(item)
      const email = item?.email_address ?? ''
      const phone = String(item?.mobile_number ?? item?.telephone_number ?? '')
      const effStart = item?.effective_start ? new Date(item.effective_start) : null
      const effEnd = item?.effective_end ? new Date(item.effective_end) : null
      return { ...item, status_text, email, phone, effStart, effEnd }
    })

    const q = query.trim().toLowerCase()
    let filtered = augmented.filter((i) => {
      if (!q) return true

      return (
        String(i.party_id).toLowerCase().includes(q) ||
        String(i.party_code).toLowerCase().includes(q) ||
        String(i.party_legacy_code).toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.phone.toLowerCase().includes(q)
      )
    })

    if (statusFilter !== 'all') {
      filtered = filtered.filter((i) => i.status_text.toLowerCase() === statusFilter.toLowerCase())
    }

    if (currentFilter !== 'all') {
      const want = currentFilter === 'current'
      filtered = filtered.filter((i) => i.is_current === want)
    }

    filtered.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortKey) {
        case 'party_id':
          return (a.party_id - b.party_id) * dir
        case 'party_code':
          return String(a.party_code).localeCompare(String(b.party_code)) * dir
        case 'name':
          return a.name.localeCompare(b.name) * dir
        case 'status_text':
          return a.status_text.localeCompare(b.status_text) * dir
        case 'is_current':
          return (a.is_current === b.is_current ? 0 : a.is_current ? -1 : 1) * dir
        case 'effective_start': {
          const av = a.effStart ? a.effStart.getTime() : 0
          const bv = b.effStart ? b.effStart.getTime() : 0
          return (av - bv) * dir
        }
        default:
          return 0
      }
    })

    return filtered
  }, [parties?.data, query, statusFilter, currentFilter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const headerButton = (label: string, key: SortKey) => (
    <button
      type='button'
      className='group inline-flex items-center gap-1 hover:underline'
      onClick={() => toggleSort(key)}
      title={`Sort by ${label}`}
    >
      {label}
      <svg
        className={`h-3.5 w-3.5 transition-transform ${sortKey === key ? 'opacity-100' : 'opacity-40'} ${
          sortKey === key && sortDir === 'desc' ? 'rotate-180' : ''
        }`}
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z' />
      </svg>
    </button>
  )

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={partiesNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4'>
        {/* Controls */}
        <ListSearch
          title='Parties search'
          placeholder='Search by ID, Code, Name, Email, Phone...'
          url={route('parties.index')}
        />
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search by ID, Code, Name, Email, Phone...'
              className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-0 outline-none focus:border-slate-400'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2'>
            <select
              className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value='all'>All statuses</option>
              <option value='Active'>Active</option>
              <option value='Blacklisted'>Blacklisted</option>
              <option value='Unknown'>Unknown</option>
            </select>
            <select
              className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
            >
              <option value='all'>All records</option>
              <option value='current'>Current only</option>
              <option value='archived'>Archived only</option>
            </select>
          </div>
        </div>

        <Card>
          <CustomTable
            columns={[
              'S.No',
              headerButton('Party Code', 'party_code'),
              'Legacy Code',
              headerButton('Name', 'name'),
              headerButton('Status', 'status_text'),
              headerButton('Effective Start', 'effective_start'),
              'Email',
              'Phone',
              'Actions',
            ]}
            caption='List of parties'
            emptyState={
              !parties?.success
                ? 'Failed to load parties. Please try refreshing.'
                : 'No parties found.'
            }
          >
            {rows.map((item, index) => {
              const statusText = item.status_text
              const tone = getStatusTone(statusText)

              return (
                <TableRow
                  key={item.version_id}
                  className='hover:bg-slate-50'
                >
                  <TableCell className='text-slate-500'>{index + 1}</TableCell>
                  <TableCell className='tabular-nums'>{item.party_code}</TableCell>
                  <TableCell>{item.party_legacy_code ?? '-'}</TableCell>
                  <TableCell className='max-w-[220px] truncate'>{item.name ?? '-'}</TableCell>
                  <TableCell>
                    <StatusBadge
                      text={statusText}
                      tone={tone}
                    />
                  </TableCell>

                  <TableCell title={item.effective_start ?? ''}>
                    {item.effective_start ? new Date(item.effective_start).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell
                    className='max-w-[220px] truncate'
                    title={item.email_address ?? ''}
                  >
                    {item.email_address ?? '-'}
                  </TableCell>
                  <TableCell
                    className='max-w-[160px] truncate'
                    title={item.phone}
                  >
                    {item.phone || '-'}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <EditButton onClick={() => handleEditClick(item)} />
                      <DeleteButton onClick={() => handleDeleteClick(item)} />
                      <a
                        href={route('parties.show', item.version_id)}
                        className='rounded-md px-2 py-1 text-sm text-blue-600 hover:bg-blue-50'
                      >
                        View
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </CustomTable>
        </Card>
      </div>
    </MainLayout>
  )
}
