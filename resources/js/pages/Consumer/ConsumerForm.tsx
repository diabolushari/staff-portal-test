import MainLayout from '@/layouts/main-layout'
import { connectionsNavItems } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import ConsumerFormComponent from '@/components/Consumer/ConsumerFormComponent'
import { ParameterValues } from '@/interfaces/parameter_types'

interface Props {
  consumer_types: ParameterValues[]
  connection_id: number
  consumer?: any
  districts: any[]
  states: any[]
}
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Consumers',
    href: '/consumers',
  },
  {
    title: 'Add Consumer',
    href: '/consumers/create',
  },
]

export default function ConsumerForm({
  consumer_types,
  districts,
  states,
  connection_id,
  consumer,
}: Props) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={connectionsNavItems}
    >
      <ConsumerFormComponent
        consumer_types={consumer_types}
        districts={districts}
        states={states}
        connection_id={connection_id}
        data={consumer}
      />
    </MainLayout>
  )
}
