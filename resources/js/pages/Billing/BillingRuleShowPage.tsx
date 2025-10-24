import ChargeHeadTable from '@/components/Billing/ChargeHeadTable'
import ComputedPropertyTable from '@/components/Billing/ComputedPropertyTable'
import { billingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import { BillingRule, ChargeHead, ComputedProperty } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { Paginator } from '@/ui/ui_interfaces'
import { route } from 'ziggy-js'

interface Props {
  billingRule: BillingRule
  paginatedComputedProperties: Paginator<ComputedProperty>
  paginatedChargeHeads: Paginator<ChargeHead>
}

export default function BillingRuleShowPage({
  billingRule,
  paginatedComputedProperties,
  paginatedChargeHeads,
}: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Billing Rules', href: route('billing-rule.index') },
    { title: 'Billing Rule Show', href: route('billing-rule.show', billingRule.id) },
  ]
  console.log(billingRule, paginatedComputedProperties, paginatedChargeHeads)
  return (
    <MainLayout
      navItems={billingNavItems}
      breadcrumb={breadcrumbs}
    >
      <Card>Basic Info</Card>

      <Card>
        <h2>Charge Heads</h2>
        <ChargeHeadTable
          chargeHeads={paginatedChargeHeads.data}
          pagination={paginatedChargeHeads}
        />
      </Card>

      <Card>
        <h2>Computed Properties</h2>
        <ComputedPropertyTable
          computedProperties={paginatedComputedProperties.data}
          pagination={paginatedComputedProperties}
        />
      </Card>
    </MainLayout>
  )
}
