import { consumerNavItems } from '@/components/Navbar/navitems'
import SdCollectionForm from '@/components/SecurityDeposit/SdCollections/SdCollectionForm'
import { SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'

interface Props {
  sdDemand: SdDemand
  paymentModes: ParameterValues[]
  collectionStatus: ParameterValues[]
}
//TODO need to show demand details in this page, currently only showing consumer number in heading, can show more details in description or in a separate section
export default function SdCollectionCreate({
  sdDemand,
  paymentModes,
  collectionStatus,
}: Readonly<Props>) {
  const connection = sdDemand.connection

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    {
      title: connection?.consumer_number,
      href: `/connections/${connection?.connection_id}`,
    },
    {
      title: 'Security Deposit Demands',
      href: `/connection/${connection?.connection_id}/sd-demands`,
    },
    {
      title: 'Add SD Collection',
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
        <>
          Create SD Collection for consumer number {'   '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        <SdCollectionForm
          sdDemand={sdDemand}
          paymentModes={paymentModes}
          collectionStatus={collectionStatus}
        />
      </div>
    </ConnectionsLayout>
  )
}
