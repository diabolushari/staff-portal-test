import BillingGroupMembersList from '@/components/Billing/BillingGroup/BillingGroupMembersList'
import BillingGroupForm from '@/components/Billing/BillingGroup/BillingGroupForm'
import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

export default function BillingGroupCreatePage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Billing Groups', href: route('billing-groups.index') },
    {
      title: 'Billing Group Create',
      href: route('billing-groups.create'),
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      leftBarTitle='Billing Group'
      navItems={billingNavItems}
      title='Billing Groups'
      addBtnText='Billing Group'
      addBtnUrl='/billing-groups/create'
    >
      <div className='flex flex-col gap-4'>
        <BillingGroupForm billing_group={null} />
        <BillingGroupMembersList />
      </div>
    </MainLayout>
  )
}
