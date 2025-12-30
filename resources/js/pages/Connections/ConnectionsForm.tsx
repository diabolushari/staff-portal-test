import ConnectionForm from '@/components/Connections/ConnectionForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection } from '@/interfaces/data_interfaces'

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
  generationTypes: ParameterValues[]
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
  generationTypes,
  connection,
}: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={getBreadcrumb(connection)}
      navItems={consumerNavItems}
      selectedItem='Connections'
      selectedTopNav='Consumers'
    >
      <div>
        <ConnectionForm
          indicators={indicators}
          generationTypes={generationTypes}
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
      </div>
    </MainLayout>
  )
}
