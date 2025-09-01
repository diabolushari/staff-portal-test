import MainLayout from '@/layouts/main-layout'
import { connections } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import ConnectionForm from '@/components/Connections/ConnectionForm'
import { ParameterValues } from '@/interfaces/parameter_types'

import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@/components/ui/tabs'
import ConsumerForm from '@/components/Connections/ConsumerForm'

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
      navItems={connections}
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
            />
          </TabsContent>
          <TabsContent value='consumer'>
            <ConsumerForm />
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}
