import BillingGroupMembersList from '@/components/Billing/BillingGroup/BillingGroupMembersList'
import BillingGroupForm from '@/components/Billing/BillingGroup/BillingGroupForm'
import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'

export default function BillingGroupCreatePage() {
  return (
    <MainLayout
      breadcrumb={[]}
      leftBarTitle='Billing Group'
      navItems={billingNavItems}
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
