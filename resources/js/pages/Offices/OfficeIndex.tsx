import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import CardHeader from '@/ui/Card/CardHeader'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offices',
    href: '/offices',
  },
]

export default function OfficeIndex({ offices }: { offices: any[] }) {
  console.log(offices)
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div>
        <CardHeader
          title='Offices'
          subheading='Add a new office.'
          addUrl={route('offices.create')}
        />
      </div>
    </AppLayout>
  )
}
