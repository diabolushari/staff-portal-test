import { billingNavItems } from '@/components/Navbar/navitems'
import { Connection } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { Paginator } from '@/ui/ui_interfaces'

interface Props {
  connections: Paginator<Connection>
}

const ConsumerSDIndex = ({ connections }: Props) => {
  const breadCrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Security Deposit',
      href: '/consumer-sd',
    },
    {
      title: 'Consumer SD',
      href: '#',
    },
  ]

  console.log(connections)
  return (
    <MainLayout
      breadcrumb={breadCrumbs}
      title='Consumers'
      description='Manage & Search Consumers for security deposit assessment'
      navItems={billingNavItems}
      selectedItem='Consumers'
    >
      <h1></h1>
    </MainLayout>
  )
}

export default ConsumerSDIndex
