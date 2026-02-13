import { metadataNavItems } from '@/components/Navbar/navitems'
import SdDemandForm from '@/components/SecurityDeposit/SdDemands/SdDemandForm'
import { sdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

interface Props {
  demandTypes: ParameterValues[]
  calculationBasics: ParameterValues[]
  status: ParameterValues[]
  sdDemand?: sdDemand
}

export default function SdDemandCreate({
  demandTypes,
  calculationBasics,
  status,
  sdDemand,
}: Readonly<Props>) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Security Deposit Demands',
      href: '/sd-demands',
    },
    {
      title: sdDemand ? 'Edit Security Deposit Demand' : 'Add Security Deposit Demand',
      href: sdDemand ? `/sd-demands/${sdDemand.sd_demand_id}` : '/sd-demands/create',
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
          status={status}
          sdDemand={sdDemand}
        />
      </div>
    </MainLayout>
  )
}
