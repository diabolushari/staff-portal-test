import BillingJobStatusList from '@/components/Billing/BillingCycle/BillJobStatusList'
import BillingCycleList from '@/components/Billing/BillingCycle/BillJobStatusList'
import BillingJobStatusSearchForm from '@/components/Billing/BillingCycle/BillingJobStatusSearchForm'
import { billingNavItems } from '@/components/Navbar/navitems'
import { BillingGroup } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'

interface Props {
  billing_groups: BillingGroup[]
  filters: {
    search: string
  }
}
export default function BillJobStatusIndexPage({ billing_groups, filters }: Props) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Billing',
      href: '/billing-groups',
    },
    {
      title: 'Bill Jobs',
      href: '/bills/job-status',
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={billingNavItems}
      title='Bill Jobs'
      leftBarTitle='Billing'
      selectedItem='Jobs'
    >
      <BillingJobStatusSearchForm />
      {billing_groups && billing_groups.length > 0 ? (
        <>
          <BillingJobStatusList billingGroups={billing_groups} />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Billing Groups Found</div>
      )}
    </MainLayout>
  )
}
