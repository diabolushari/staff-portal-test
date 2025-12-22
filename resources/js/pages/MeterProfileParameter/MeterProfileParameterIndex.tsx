import MeterProfileParameterList from '@/components/MeterProfileParameter/MeterProfileParameterList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import ParameterValueModal from '@/components/Parameter/ParameterValue/ParameterValueModal'
import { MeterProfileGroupByProfile } from '@/interfaces/data_interfaces'
import { ParameterDefinition } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'
import { useState } from 'react'

interface Props {
  oldSearch: string
  meterProfileParameters: Paginator<MeterProfileGroupByProfile>
  definition: ParameterDefinition
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Settings',
    href: '/settings-page',
  },
  {
    title: 'Metering Profile',
    href: '/meter-profile',
  },
]

const MeterProfileParameterIndex = ({ oldSearch, meterProfileParameters, definition }: Props) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      selectedItem='Metering Profiles'
      addBtnText='Meter Profile'
      addBtnUrl={route('meter-profile.create')}
      title='Metering Profiles'
      breadcrumb={breadcrumbs}
    >
      <div>
        <ListSearch
          title=''
          placeholder='Search'
          url={route('meter-profile.index')}
          search={oldSearch}
        />
        <div className='flex justify-end p-2'>
          <Button
            label='Add Meter Profile Parameter'
            onClick={() => setShowModal(true)}
            variant='primary'
          />
        </div>
        {meterProfileParameters && (
          <>
            <MeterProfileParameterList meterProfileParameters={meterProfileParameters?.data} />
            <Pagination
              pagination={meterProfileParameters}
              filters={{ search: oldSearch }}
            />
          </>
        )}
        {showModal && (
          <ParameterValueModal
            onClose={() => setShowModal(false)}
            definition={definition}
          />
        )}
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterIndex
