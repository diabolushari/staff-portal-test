import ProfileParameterShowList from '@/components/MeterProfileParameter/ProfileParameterShowList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import AddButton from '@/ui/button/AddButton'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

const breadCrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Settings', href: '/settings-page' },
  { title: 'Meter Profile Parameters', href: '/meter-profile' },
  { title: 'Show', href: '#' },
]

interface Props {
  meterProfileParameter: Paginator<MeterProfileParameter>
  profileId: number
}

const MeterProfileParameterShow = ({ meterProfileParameter, profileId }: Props) => {
  const handleAdd = () => {
    router.get(route('meter-profile.create', { profileId }))
  }
  return (
    <MainLayout
      title='Meter Profile Parameter Show'
      breadcrumb={breadCrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Metering Profiles'
    >
      <div className='p-4'>
        <div className='flex items-center justify-between p-4'>
          <div />
          <AddButton
            onClick={handleAdd}
            buttonText='Add Profile Parameter'
          />
        </div>

        {meterProfileParameter.data.length > 0 && (
          <>
            <ProfileParameterShowList meterProfileParameters={meterProfileParameter.data} />
            <Pagination pagination={meterProfileParameter} />
          </>
        )}
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterShow
