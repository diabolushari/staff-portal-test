import { BreadcrumbItem } from '@/types'
import MainLayout from '../main-layout'
import { navItem } from '@/components/Navbar/navitems'
import { Connection } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import React from 'react'
import { NestedTabGroup } from '@/components/ui/nestedTab'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import CustomBreadcrumb from '@/ui/BreadCrumb'

interface ConnectionsLayoutProps {
  children: React.ReactNode
  breadcrumbs: BreadcrumbItem[]
  connectionsNavItems: navItem[]
  connection?: Connection
  connectionId: number
  value: string
  subTabValue?: string
  heading: string
  subHeading: string
  onEdit?: () => void
  consumerExist?: boolean
  meterExist?: boolean
}

const connectionTabs = (connection?: Connection) => [
  {
    value: 'connection',
    label: 'Connection Details',
    href: connection?.connection_id ? route('connections.show', connection?.connection_id) : '#',
    item: [
      {
        subValue: 'connection',
        subLabel: 'Connection',
        subLink: connection?.connection_id
          ? route('connections.show', connection?.connection_id)
          : '#',
      },
      {
        subValue: 'consumer',
        subLabel: 'Consumer',
        subLink: connection?.connection_id
          ? route('connection.consumer', connection?.connection_id)
          : '#',
      },
      {
        subValue: 'parties',
        subLabel: 'Parties',
        subLink: '#',
      },
    ],
  },
  {
    value: 'meter-reading',
    label: 'Meter & Readings',
    href: connection?.connection_id
      ? route('connection.meter-reading', connection.connection_id)
      : '#',
    item: [
      {
        subValue: 'meter',
        subLabel: 'Meter',
        subLink: connection?.connection_id
          ? route('connection.meters', connection?.connection_id)
          : '#',
      },
      {
        subValue: 'reading',
        subLabel: 'Readings',
        subLink: connection?.connection_id
          ? route('connection.meter-reading', connection?.connection_id)
          : '#',
      },
    ],
  },
  // {
  //   value: 'consumer',
  //   label: 'Consumer',
  //   href: connection?.connection_id ? route('connection.consumer', connection?.connection_id) : '#',
  // },
  // consumerExist && {
  //   value: 'meter',
  //   label: 'Meter',
  //   href: connection?.connection_id ? route('connection.meters', connection?.connection_id) : '#',
  // },
  // meterExist && {
  //   value: 'meter-reading',
  //   label: 'Meter Reading',
  //   href: connection?.connection_id
  //     ? route('connection.meter-reading', connection?.connection_id)
  //     : '#',
  // },
]
export default function ConnectionsLayout({
  children,
  breadcrumbs,
  connectionsNavItems,
  connection,
  value,
  subTabValue,
  heading,
  subHeading,
  onEdit,
}: Readonly<ConnectionsLayoutProps>) {
  return (
    <MainLayout
      navItems={connectionsNavItems}
      selectedItem='Connections'
      selectedTopNav='Consumers'
    >
      <NestedTabGroup
        tabs={connectionTabs(connection)}
        defaultValue={value}
        defaultSubValue={subTabValue}
      >
        {' '}
        <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-col gap-2'>
              <StrongText className='text-2xl font-semibold text-[#252c32]'>{heading}</StrongText>
              <CustomBreadcrumb list={breadcrumbs} />
              {/* <span className='text-sm text-gray-600'>{subHeading}</span> */}
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className='flex items-center gap-2 rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
              >
                Edit
              </button>
            )}
          </div>

          <div>{children}</div>
        </div>
      </NestedTabGroup>
    </MainLayout>
  )
}
export { connectionTabs }
