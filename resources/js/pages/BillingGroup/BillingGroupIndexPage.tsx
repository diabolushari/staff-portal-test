import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import { BillingGroup } from '@/interfaces/data_interfaces'
import BillingGroupList from '@/components/Billing/BillingGroup/BillingGroupList'

interface PageProps {
  billingGroups: BillingGroup[]
  filters: {
    search: string
  }
}
export default function BillingGroupIndexPage({ billingGroups, filters }: PageProps) {
  const breadcrumb: BreadcrumbItem[] = [{ title: 'Billing', href: '/billing-groups' }]

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      leftBarTitle='Billing Group'
      navItems={billingNavItems}
      addBtnText='Billing Group'
      addBtnUrl='/billing-groups/create'
    >
      <ListSearch
        title='Billing Group'
        placeholder='Search Billing Group'
        url='/billing-groups'
        filters={filters}
      />
      {billingGroups && billingGroups.length > 0 ? (
        <>
          <BillingGroupList billingGroups={billingGroups} />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Billing Groups Found</div>
      )}
    </MainLayout>
  )
}
