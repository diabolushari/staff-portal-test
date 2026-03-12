import { billingNavItems } from '@/components/Navbar/navitems'
import ConsumerSDIndexSearch from '@/components/SecurityDeposit/Consumer/ConsumerSDIndexSearch'
import { Button } from '@/components/ui/button'
import IconSingleTab from '@/components/ui/icon-single-tab'
import { Connection } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import CheckBox from '@/ui/form/CheckBox'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { User, Users } from 'lucide-react'
import { useState } from 'react'

interface Props {
  connections: Paginator<Connection>
  oldConnections?: Connection
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
    href: '#',
  },
]
const ConsumerSDIndex = ({ connections, oldConnections }: Props) => {
  const breadCrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Security Deposit',
      href: '/consumer-sd',
    },
    {
      title: 'Consumer SD',
      href: '#',
    },
  ]

  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [selectedConnections, setSelectedConnections] = useState<number[]>([])

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedConnections([])
      setSelectAll(false)
    } else {
      const allIds = connections.data.map((c) => c.connection_id)
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
    setSelectAll(updatedSelection.length === connections.data.length)
  }

  const handleAssessSelected = () => {}
  return (
    <MainLayout
      breadcrumb={breadCrumbs}
      title='Consumers'
      description='Manage & Search Consumers for security deposit assessment'
      navItems={billingNavItems}
      selectedItem='Consumers'
      selectedTopNav='Billing'
    >
      <IconSingleTab
        tabs={Tabs}
        defaultValue='individual'
      />
      <div className='ml-auto'>
        <Button
          variant='default'
          onClick={handleAssessSelected}
        >
          Assess Selected
        </Button>
      </div>
      <ConsumerSDIndexSearch oldConnections={oldConnections} />
      {connections.data.length > 0 && (
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
            {connections.data.map((connection) => (
              <div
                key={connection.connection_id}
                className='border-kseb-line mb-4 items-center justify-between rounded-none border-2 bg-white p-4 shadow-sm'
              >
                <div className='flex flex-col gap-2 pb-3'>
                  <span>
                    <b>{connection?.consumer_profiles?.[0]?.consumer_name}</b>
                  </span>
                  <span>Consumer Number: {connection.consumer_number}</span>
                  <span>Legacy Code:{connection.consumer_legacy_code}</span>
                </div>
                <div className='bg-kseb-bg-blue grid grid-cols-4 p-4'>
                  <div className='flex flex-col'>
                    <span>SD Assessed</span>
                    <span>{connection?.sd_balance_summary?.[0]?.sd_principal_required ?? '-'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span>SD Available</span>
                    <span>{connection?.sd_balance_summary?.[0]?.sd_principal_on_file ?? '-'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span>Difference</span>
                    <span>{connection?.sd_balance_summary?.[0]?.sd_principal_variance ?? '-'}</span>
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
      <Pagination pagination={connections} />
    </MainLayout>
  )
}

export default ConsumerSDIndex
