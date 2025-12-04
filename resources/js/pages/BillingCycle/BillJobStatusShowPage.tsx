import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'

export default function BillJobStatusShowPage() {
  return (
    <MainLayout
      title='Bill Job Status Show Page'
      breadcrumb={[]}
      navItems={billingNavItems}
      leftBarTitle='Billing'
      selectedItem='Jobs'
    >
      <div>hellow world</div>
    </MainLayout>
  )
}
