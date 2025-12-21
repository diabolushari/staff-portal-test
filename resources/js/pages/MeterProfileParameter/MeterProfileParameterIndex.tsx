import MeterProfileParameterList from '@/components/MeterProfileParameter/MeterProfileParameterList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import ParameterValueModal from '@/components/Parameter/ParameterValue/ParameterValueModal'
import { MeterProfileGroupByProfile } from '@/interfaces/data_interfaces'
import { ParameterDefinition, ParameterDomain } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'
import { useState } from 'react'

interface Props {
  oldSearch: string
  meterProfileParameters: Paginator<MeterProfileGroupByProfile>
  domain: ParameterDomain
  definition: ParameterDefinition
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings-page',
  },
  {
    title: 'Metering Profile',
    href: '/meter-profile',
  },
]

const MeterProfileParameterIndex = ({
  oldSearch,
  meterProfileParameters,
  domain,
  definition,
}: Props) => {
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
        {meterProfileParameters && (
          <>
            <MeterProfileParameterList meterProfileParameters={meterProfileParameters?.data} />
            <Pagination
              pagination={meterProfileParameters}
              filters={{ search: oldSearch }}
            />
          </>
        )}
        <ParameterValueModal
          onClose={() => setShowModal(false)}
          definition={definition}
        />
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterIndex
