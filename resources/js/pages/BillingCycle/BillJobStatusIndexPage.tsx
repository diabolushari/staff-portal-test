import BillingJobStatusList from '@/components/Billing/BillingCycle/BillJobStatusList'
import BillingCycleList from '@/components/Billing/BillingCycle/BillJobStatusList'
import BillingJobList from '@/components/Billing/BillingCycle/BillingJobList'
import BillingJobStatusSearchForm from '@/components/Billing/BillingCycle/BillingJobStatusSearchForm'
import { billingNavItems } from '@/components/Navbar/navitems'
import { BillingGroup, BillJobStatus } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'

interface Props {
  bill_generation_job_status: BillJobStatus[]
  filters: {
    search: string
  }
}
export default function BillJobStatusIndexPage({ bill_generation_job_status, filters }: Props) {
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
      {bill_generation_job_status && bill_generation_job_status.length > 0 ? (
        <>
          <BillingJobList billGenerationJobStatus={bill_generation_job_status} />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Billing Groups Found</div>
      )}
    </MainLayout>
  )
}
