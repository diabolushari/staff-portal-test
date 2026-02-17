import { metadataNavItems } from '@/components/Navbar/navitems'
import SdDemandForm from '@/components/SecurityDeposit/SdDemands/SdDemandForm'
import { Connection, SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
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
    <MainLayout
      breadcrumb={breadcrumbs}
      selectedItem='Security Deposit Demand Details'
      navItems={metadataNavItems}
      title='Security Deposit Demand'
      description={sdDemand ? 'Edit Security Deposit Demand' : 'Add Security Deposit Demand'}
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
    </MainLayout>
  )
}
