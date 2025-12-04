import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'

export default function BillingCycleShowPage() {
  return (
    <MainLayout
      title='Billing Cycle Show Page'
      breadcrumb={[]}
      navItems={billingNavItems}
      leftBarTitle='Billing'
      selectedItem='Billing Cycles'
    >
      <div>hellow world</div>
    </MainLayout>
  )
}
