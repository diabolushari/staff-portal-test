import ProfileParameterShowList from '@/components/MeterProfileParameter/ProfileParameterShowList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import AddButton from '@/ui/button/AddButton'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

interface Props {
  meterProfileParameter?: Paginator<MeterProfileParameter>
  profileId: number
  profile: ParameterValues
}

const MeterProfileParameterShow = ({ meterProfileParameter, profileId, profile }: Props) => {
  const breadCrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Settings', href: '/settings-page' },
    { title: 'Meter Profile Parameters', href: '/meter-profile' },
    {
      title: `${profile?.parameter_value}`,
      href: '#',
    },
  ]

  const handleAdd = () => {
    router.get(route('meter-profile.create', { profileId }))
  }
  return (
    <MainLayout
      title={profile?.parameter_value}
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

        {meterProfileParameter ? (
          <>
            <ProfileParameterShowList meterProfileParameters={meterProfileParameter.data} />
            <Pagination pagination={meterProfileParameter} />
          </>
        ) : (
          <div className='flex items-center justify-center'>
            No profile parameters are available. Please add a profile parameter to view the details.
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterShow
