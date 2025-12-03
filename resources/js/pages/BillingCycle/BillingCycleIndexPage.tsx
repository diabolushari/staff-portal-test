import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'

export default function BillingCycleIndexPage() {
  return (
    <MainLayout
      breadcrumb={[]}
      navItems={billingNavItems}
    >
      <div>
        <h1>Billing Cycle Index Page</h1>
      </div>
    </MainLayout>
  )
}
