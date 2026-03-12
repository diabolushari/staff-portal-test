import { billingNavItems } from '@/components/Navbar/navitems'
import { Button } from '@/components/ui/button'
import IconSingleTab from '@/components/ui/icon-single-tab'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { BillingGroup } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import CheckBox from '@/ui/form/CheckBox'
import SelectList from '@/ui/form/SelectList'
import { error } from 'console'
import { User, Users } from 'lucide-react'
import { useState } from 'react'

export interface BillingGroupConnectionRelForm {
  billing_group_id: number
  connection_id: number
  status: string
}

export interface PageProps {
  group: BillingGroup
}
const Tabs = [
  {
    value: 'individual',
    label: 'Individual',
    icon: <User />,
    href: '/consumer-sd',
  },
  {
    value: 'group',
    label: 'Group',
    icon: <Users />,
    href: '/consumer-sd/group',
  },
]

export default function ConsumerSDGroupShowPage({ group }: Readonly<PageProps>) {
  console.log(group)
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Security Deposit',
      href: '/consumer-sd',
    },
    {
      title: 'Consumer SD Groups',
      href: '/consumer-sd/group',
    },
    {
      title: group.name,
      href: '#',
    },
  ]
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [selectedConnections, setSelectedConnections] = useState<number[]>([])
  const { formData, setFormValue } = useCustomForm({
    connection_ids: [],
    trigger_type_id: 1,
    context_date: '',
  })

  const { post, loading } = useInertiaPost(route('sd-assess'))

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedConnections([])
      setSelectAll(false)
    } else {
      const allIds = group.connections.map((c) => c.connection_id)
      setSelectedConnections(allIds)
      setSelectAll(true)
    }
  }

  const handleSingleSelect = (connectionId: number) => {
    let updatedSelection: number[] = []
    if (selectedConnections.includes(connectionId)) {
      updatedSelection = selectedConnections.filter((id) => id !== connectionId)
    } else {
      updatedSelection = [...selectedConnections, connectionId]
    }
    setSelectedConnections(updatedSelection)
    setSelectAll(updatedSelection.length === group.connections.length)
  }

  const handleAssessSelected = () => {
    setFormValue('connection_ids')(selectedConnections)
    setFormValue('context_date')('2025-04-01')
    const payLoad = { ...formData, billing_group_id: group.billing_group_id }
    post(payLoad)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      selectedTopNav='Billing'
      selectedItem='Consumers'
      navItems={billingNavItems}
      title={group?.name ?? ''}
      description={'Manage & Search Consumers for security deposit assessment'}
    >
      <IconSingleTab
        tabs={Tabs}
        defaultValue='group'
      />
      <div className='ml-auto'>
        <Button
          variant='default'
          onClick={handleAssessSelected}
        >
          Assess Selected
        </Button>
      </div>
      {group.connections.length > 0 && (
        <>
          <div className='mt-6 flex items-center justify-between p-2'>
            <h2 className='text-xl font-semibold'></h2>

            <CheckBox
              label='Select All'
              toggleValue={handleSelectAllToggle}
              value={selectAll}
            />
          </div>
          <div className='flex flex-col gap-3'>
            {group.connections.map((connection) => (
              <div
                key={connection.connection_id}
                className='border-kseb-line mb-4 items-center justify-between rounded-none border-2 bg-white p-4 shadow-sm'
              >
                <div className='flex flex-col gap-2 pb-3'>
                  <span>
                    <b>{connection.connection.consumer_profiles?.[0]?.consumer_name}</b>
                  </span>
                  <span>Consumer Number: {connection.connection.consumer_number}</span>
                  <span>Legacy Code:{connection.connection.consumer_legacy_code}</span>
                </div>
                <div className='bg-kseb-bg-blue grid grid-cols-4 p-4'>
                  <div className='flex flex-col'>
                    <span>SD Assessed</span>
                    <span>
                      <b>
                        {connection?.connection?.sd_balance_summary?.[0]?.sd_principal_required
                          ? `₹ ${connection.connection.sd_balance_summary[0].sd_principal_required}`
                          : '-'}
                      </b>
                    </span>
                  </div>

                  <div className='flex flex-col'>
                    <span>SD Available</span>
                    <span>
                      <b>
                        {connection?.connection?.sd_balance_summary?.[0]?.sd_principal_on_file
                          ? `₹ ${connection.connection.sd_balance_summary[0].sd_principal_on_file}`
                          : '-'}
                      </b>
                    </span>
                  </div>

                  <div className='flex flex-col'>
                    <span>Difference</span>
                    <span>
                      <b>
                        {connection?.connection?.sd_balance_summary?.[0]?.sd_principal_variance
                          ? `₹ ${connection.connection.sd_balance_summary[0].sd_principal_variance}`
                          : '-'}
                      </b>
                    </span>
                  </div>
                  <CheckBox
                    label={''}
                    toggleValue={() => handleSingleSelect(connection.connection_id)}
                    value={selectedConnections.includes(connection.connection_id)}
                  />
                </div>

                <div className='flex gap-5'>
                  <div className='flex flex-col'>
                    <span>Last Assessed</span>
                    <span>{'-'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span>Assessment Date</span>
                    <span>{'-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  )
}
