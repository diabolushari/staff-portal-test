import { BreadcrumbItem, NavItem } from '@/types'
import MainLayout from '../main-layout'
import { navItem } from '@/components/Navbar/navitems'
import { Connection } from '@/interfaces/consumers'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@radix-ui/react-tabs'
import { MeterData, MeterTab } from '@/pages/Connections/MeterTab'
import StrongText from '@/typography/StrongText'

interface ConnectionsLayoutProps {
  children: React.ReactNode
  breadcrumbs: BreadcrumbItem[]
  connectionsNavItems: navItem[]
  connection: Connection
  meters: MeterData[]
  connectionId: number
  value: string
  heading: string
  subHeading: string
  onEdit: () => void
}
const connectionTabs = (connection: Connection) => [
  {
    value: 'details',
    label: 'Connection Details',
    href: connection?.connection_id ? route('connections.show', connection?.connection_id) : '#',
  },
  {
    value: 'consumer',
    label: 'Consumer',
    href: connection?.connection_id ? route('connection.consumer', connection?.connection_id) : '#',
  },
  {
    value: 'meter',
    label: 'Meter',
  },
  {
    value: 'meter-reading',
    label: 'Meter Reading',
  },
]
export default function ConnectionsLayout({
  children,
  breadcrumbs,
  connectionsNavItems,
  connection,
  meters,
  connectionId,
  value,
  heading,
  subHeading,
  onEdit,
}: ConnectionsLayoutProps) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connectionsNavItems}
    >
      {' '}
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <StrongText className='text-2xl font-semibold text-[#252c32]'>{heading}</StrongText>
            <span className='text-sm text-gray-600'>{subHeading}</span>
          </div>
          <button
            onClick={onEdit}
            className='flex items-center gap-2 rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
          >
            Edit
          </button>
        </div>
        <TabGroup
          tabs={connectionTabs(connection)}
          defaultValue={value}
        >
          <TabsContent value={value}>{children}</TabsContent>
          <TabsContent value='meter'>
            <MeterTab
              meters={meters}
              connectionId={connectionId}
            />
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}
export { connectionTabs }
