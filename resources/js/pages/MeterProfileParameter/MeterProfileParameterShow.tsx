import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

const breadCrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Settings', href: '/settings-page' },
  { title: 'Meter Profile Parameters', href: '/meter-profile' },
  { title: 'Show', href: '#' },
]

const MeterProfileParameterShow = () => {
  return (
    <MainLayout
      title='Meter Profile Parameter Show'
      breadcrumb={breadCrumbs}
    >
      <div className='p-4'>
        <div>Meter Profile Parameter Show</div>
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterShow
