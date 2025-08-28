import MainLayout from '@/layouts/main-layout'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import ConnectionForm from '@/components/Connections/ConnectionForm'
import { ParameterValues } from '@/interfaces/parameter_types'

import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@/components/ui/tabs'
import ConsumerForm from '@/components/Connections/ConsumerForm'
import ConsumerFormComponent from '@/components/Consumer/ConsumerFormComponent'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Connections',
    href: '/connections',
  },
  {
    title: 'Add Connection',
    href: '/connections/create',
  },
]
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
}: Props) {
  const tabs = [
    {
      value: 'connection',
      label: 'Connection',
    },
    {
      value: 'consumer',
      label: 'Consumer',
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connectionsNavItems}
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
              connectionSubCategory={connectionSubCategory}
              billingProcesses={billingProcesses}
              phaseTypes={phaseTypes}
              primaryPurposes={primaryPurposes}
              openAccessTypes={openAccessTypes}
              meteringTypes={meteringTypes}
              renewableTypes={renewableTypes}
            />
          </TabsContent>
          <TabsContent value='consumer'>
            <ConsumerFormComponent />
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}
