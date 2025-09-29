import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

export default function MeterReadingShowPage() {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Meter Reading',
      href: '/meter-reading',
    },
    {
      title: 'Show',
      href: '/meter-reading/show',
    },
  ]
  return (
    <MainLayout breadcrumb={breadcrumb}>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-bold'>Meter Reading</h1>
        </div>
      </div>
    </MainLayout>
  )
}
