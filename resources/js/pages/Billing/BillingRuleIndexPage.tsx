import BillingRuleList from '@/components/Billing/BillingRuleList'
import { billingNavItems } from '@/components/Navbar/navitems'
import { BillingRule } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'

interface PageProps {
  billingRules: Paginator<BillingRule>
  filters: {
    search: string
  }
}

export default function BillingRuleIndexPage({ billingRules, filters }: PageProps) {
  const breadcrumb: BreadcrumbItem[] = [{ title: 'Billing', href: '/billing-rule' }]

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      leftBarTitle='Billing Rule'
      navItems={billingNavItems}
      addBtnText='Add Billing Rule'
      addBtnUrl='/billing-rule/create'
    >
      <ListSearch
        title='Billing Rule'
        placeholder='Search Billing Rule'
        url='/billing-rule'
        filters={filters}
      />
      {billingRules && billingRules.data.length > 0 ? (
        <>
          <BillingRuleList billingRules={billingRules.data} />
          <Pagination pagination={billingRules} />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Billing Rules Found</div>
      )}
    </MainLayout>
  )
}
