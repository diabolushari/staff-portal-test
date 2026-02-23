import { consumerNavItems } from '@/components/Navbar/navitems'
import SdDemandForm from '@/components/SecurityDeposit/SdDemands/SdDemandForm'
import { Connection, SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'

interface Props {
  demandTypes: ParameterValues[]
  calculationBasics: ParameterValues[]
  statuses: ParameterValues[]
  connection?: Connection
  sdDemand?: SdDemand
}

export default function SdDemandCreate({
  demandTypes,
  calculationBasics,
  statuses,
  connection,
  sdDemand,
}: Readonly<Props>) {
  const connectionData = connection ? connection : sdDemand?.connection

  if (!connectionData) {
    throw new Error('Connection data not found')
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: connectionData?.consumer_number,
      href: `/connections/${connectionData?.connection_id}`,
    },
    {
      title: 'Security Deposit Demands',
      href: `/connection/${connectionData?.connection_id}/sd-demands`,
    },
    {
      title: sdDemand ? 'Edit SD Demand' : 'Add SD Demand',
      href: '#',
    },
  ]
  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id ?? 0}
      value={'connection'}
      subTabValue='sd-demands'
      heading='SD Demands'
      description={
        sdDemand ? (
          <>
            Edit SD Demand for consumer number {'   '}
            <span className='font-bold'>{connection?.consumer_number}</span>
          </>
        ) : (
          <>
            Create SD Demands for consumer number {'   '}
            <span className='font-bold'>{connection?.consumer_number}</span>
          </>
        )
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        <SdDemandForm
          demandTypes={demandTypes}
          calculationBasics={calculationBasics}
          statuses={statuses}
          connection={connectionData}
          sdDemand={sdDemand}
        />
      </div>
    </ConnectionsLayout>
  )
}
