import { settingsOffices } from '@/components/Navbar/navitems'

import { OfficeWithHierarchy } from '@/interfaces/data_interfaces'

import OfficeLayout from '@/layouts/OfficeLayout'
import { BreadcrumbItem } from '@/types'

export default function OfficeBillingIndex({ office }: { office: OfficeWithHierarchy }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Offices',
      href: '/offices',
    },
    {
      title: 'Office Billing',
      href: `/offices/${office.office_code}/billings`,
    },
  ]

  return (
    <OfficeLayout
      breadcrumbs={breadcrumbs}
      officeNavItems={settingsOffices}
      office={office.office}
      value='billing'
      heading='Office Billing'
      subHeading='Manage consumers billing'
    >
      <div>billings</div>
    </OfficeLayout>
  )
}
