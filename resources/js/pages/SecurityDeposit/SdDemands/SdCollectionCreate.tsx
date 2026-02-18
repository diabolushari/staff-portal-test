import { metadataNavItems } from '@/components/Navbar/navitems'
import SdCollectionForm from '@/components/SecurityDeposit/SdDemands/SdCollectionForm'
import { SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

interface Props {
  sdDemand: SdDemand
  collectionModes: ParameterValues[]
  attributeDefinitions: ParameterValues[]
}

export default function SdCollectionCreate({
  sdDemand,
  collectionModes,
  attributeDefinitions,
}: Readonly<Props>) {
  const connection = sdDemand.connection

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    {
      title: connection.consumer_number,
      href: `/connections/${connection.connection_id}`,
    },
    {
      title: 'Security Deposit Demands',
      href: `/connection/${connection.connection_id}/sd-demands`,
    },
    {
      title: 'Add SD Collection',
      href: '#',
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      selectedItem='Security Deposit Demand Details'
      navItems={metadataNavItems}
      title='Security Deposit Collection'
      description='Add Security Deposit Collection'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        <SdCollectionForm
          sdDemand={sdDemand}
          collectionModes={collectionModes}
          attributeDefinitions={attributeDefinitions}
        />
      </div>
    </MainLayout>
  )
}
