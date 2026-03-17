import { billingNavItems } from '@/components/Navbar/navitems'
import BalanceDetailCard from '@/components/SecurityDeposit/SdRegister/BalanceDetailCard'
import LastAssessmentCard from '@/components/SecurityDeposit/SdRegister/LastAssessmentCard'
import LatestUpdateDetailCard from '@/components/SecurityDeposit/SdRegister/LatestUpdateDetailCard'
import SdRegisterListByConnection from '@/components/SecurityDeposit/SdRegister/SdRegisterListByConnection'
import { Button } from '@/components/ui/button'
import { Connection, SdBalanceSummary, SdRegister } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface Props {
  sdRegister?: SdRegister[]
  connection: Connection
  balanceSummary: SdBalanceSummary
}

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Security Deposit',
    href: '/consumer-sd',
  },
  {
    title: 'SD Register',
    href: '/sd-register',
  },
  {
    title: 'SD Register Details',
    href: '#',
  },
]

const SdRegisterShow = ({ sdRegister, connection, balanceSummary }: Props) => {
  const [showActions, setShowActions] = useState<boolean>(false)
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={billingNavItems}
      title={`Security Deposits`}
      selectedItem='sd-register'
      selectedTopNav='Billing'
      description={
        <span>
          Security Deposit for Consumer number <b>{connection.consumer_number}</b>
        </span>
      }
    >
      <div className='relative ml-auto w-fit'>
        <Button
          variant={'default'}
          onClick={() => setShowActions(!showActions)}
        >
          Actions
        </Button>

        {showActions && (
          <div className='absolute right-0 z-50 mt-2 w-48 rounded-md border bg-white shadow-lg'>
            <ul className='py-1 text-sm'>
              <li className='cursor-pointer px-4 py-2 hover:bg-gray-100'>Ad-hoc Assessment</li>
              <li
                className='cursor-pointer px-4 py-2 hover:bg-gray-100'
                onClick={() =>
                  router.get(
                    route('sd-collections.create', {
                      sdDemandId: sdRegister?.[0].sd_demand_id,
                      connectionId: connection.connection_id,
                      registerId: sdRegister?.[0].sd_register_id,
                    })
                  )
                }
              >
                Register Collection
              </li>
              <li className='cursor-pointer px-4 py-2 hover:bg-gray-100'>Manage Refunds</li>
            </ul>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <span className='text-sm text-gray-900'>
            <b>{connection.consumer_profiles?.[0]?.consumer_name}</b>
          </span>
        </div>
        <div className='flex gap-2'>
          <label className='text-sm font-medium text-gray-700'>Consumer Number : </label>
          <span className='text-sm text-gray-900'>{connection.consumer_number}</span>
        </div>
        <div className='flex gap-2'>
          <label className='text-sm font-medium text-gray-700'>Legacy Code : </label>
          <span className='text-sm text-gray-900'>{connection.consumer_legacy_code}</span>
        </div>
      </div>
      <LastAssessmentCard sdRegister={sdRegister} />
      <BalanceDetailCard
        sdRegister={sdRegister}
        balanceSummary={balanceSummary}
      />
      <LatestUpdateDetailCard sdRegister={sdRegister} />
      <SdRegisterListByConnection connection={connection} />
    </MainLayout>
  )
}

export default SdRegisterShow
