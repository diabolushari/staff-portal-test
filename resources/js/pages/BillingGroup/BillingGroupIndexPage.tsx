import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

export default function BillingGroupIndexPage({}: any) {
  const breadcrumb: BreadcrumbItem[] = [{ title: 'Billing', href: '/billing-groups' }]

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      leftBarTitle='Billing Group'
      navItems={billingNavItems}
      addBtnText='Billing Group'
      addBtnUrl='/billing-groups/create'
    >
      <div className='flex h-full items-center justify-center'>No Billing Rules Found</div>
    </MainLayout>
  )
}
