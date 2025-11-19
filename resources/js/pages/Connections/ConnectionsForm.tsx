import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ConnectionForm from '@/components/Connections/ConnectionForm'
import { ParameterValues } from '@/interfaces/parameter_types'

import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@/components/ui/tabs'
import ConsumerForm from '@/components/Connections/ConsumerForm'
import ConsumerFormComponent from '@/components/Consumer/ConsumerFormComponent'
import { consumerNavItems } from '@/components/Navbar/navitems'

const getBreadcrumb = (connection: any) => {
  if (!connection) {
    return [
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
  connectionSubCategory: ParameterValues[]
  billingProcesses: ParameterValues[]
  phaseTypes: ParameterValues[]
  primaryPurposes: ParameterValues[]
  openAccessTypes: ParameterValues[]
  meteringTypes: ParameterValues[]
  renewableTypes: ParameterValues[]
  connection?: any
}

export default function ConnectionsForm({
  connectionTypes,
  connectionStatus,
  voltageTypes,
  tariffTypes,
  connectionCategory,
  connectionSubCategory,
  billingProcesses,
  phaseTypes,
  primaryPurposes,
  openAccessTypes,
  meteringTypes,
  renewableTypes,
  connection,
}: Props) {
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
    >
      <div>
        <TabGroup tabs={tabs}>
          <TabsContent value='connection'>
            <ConnectionForm
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
