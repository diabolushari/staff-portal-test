import BillingCycleList from '@/components/Billing/BillingCycle/BillingCycleList'
import BillingGroupList from '@/components/Billing/BillingGroup/BillingGroupList'
import { billingNavItems } from '@/components/Navbar/navitems'
import { BillingGroup } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import ListSearch from '@/ui/Search/ListSearch'

interface Props {
  billing_groups: BillingGroup[]
  filters: {
    search: string
  }
}
export default function BillingCycleIndexPage({ billing_groups, filters }: Props) {
  return (
    <MainLayout
      breadcrumb={[]}
      navItems={billingNavItems}
      title='Billing Cycle'
      leftBarTitle='Billing'
      selectedItem='Billing Cycles'
    >
      <ListSearch
        title='Billing Group'
        placeholder='Search Billing Group'
        url='/billing-cycles'
        filters={filters}
      />
      {billing_groups && billing_groups.length > 0 ? (
        <>
          <BillingCycleList billingGroups={billing_groups} />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Billing Groups Found</div>
      )}
    </MainLayout>
  )
}
