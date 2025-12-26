import ConnectionForm from '@/components/Connections/ConnectionForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

import { consumerNavItems } from '@/components/Navbar/navitems'
import { TabsContent } from '@/components/ui/tabs'
import { Connection } from '@/interfaces/data_interfaces'
import { TabGroup } from '@/ui/Tabs/TabGroup'

const getBreadcrumb = (connection?: Connection | null): BreadcrumbItem[] => {
  if (!connection) {
    return [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Connections',
        href: '/connections',
      },
      {
        title: 'Add Connection',
        href: '/connections/create',
      },
    ]
  }
  return [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Connections',
      href: '/connections',
    },
    {
      title: connection.consumer_number,
      href: `/connections/${connection.connection_id}`,
    },
    {
      title: 'Edit Connection',
      href: `/connections/${connection.connection_id}/edit`,
    },
  ]
}
interface Props {
  connectionTypes: ParameterValues[]
  connectionStatus: ParameterValues[]
  voltageTypes: ParameterValues[]
  tariffTypes: ParameterValues[]
  connectionCategory: ParameterValues[]
  billingProcesses: ParameterValues[]
  phaseTypes: ParameterValues[]
  primaryPurposes: ParameterValues[]
  openAccessTypes: ParameterValues[]
  meteringTypes: ParameterValues[]
  renewableTypes: ParameterValues[]
  indicators: ParameterValues[]
  connection?: Connection
}

export default function ConnectionsForm({
  connectionTypes,
  connectionStatus,
  voltageTypes,
  tariffTypes,
  connectionCategory,
  billingProcesses,
  phaseTypes,
  primaryPurposes,
  openAccessTypes,
  meteringTypes,
  renewableTypes,
  indicators,
  connection,
}: Readonly<Props>) {
  const tabs = [
    {
      value: 'connection',
      label: 'Connection',
    },
  ]

  return (
    <MainLayout
      breadcrumb={getBreadcrumb(connection)}
      navItems={consumerNavItems}
      selectedItem='Connections'
      selectedTopNav='Consumers'
    >
      <div>
        <TabGroup tabs={tabs}>
          <TabsContent value='connection'>
            <ConnectionForm
              indicators={indicators}
              connectionTypes={connectionTypes}
              connectionStatus={connectionStatus}
              voltageTypes={voltageTypes}
              tariffTypes={tariffTypes}
              connectionCategory={connectionCategory}
              billingProcesses={billingProcesses}
              phaseTypes={phaseTypes}
              primaryPurposes={primaryPurposes}
              openAccessTypes={openAccessTypes}
              meteringTypes={meteringTypes}
              renewableTypes={renewableTypes}
              connection={connection}
            />
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}
