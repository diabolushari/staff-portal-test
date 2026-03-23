import { billingNavItems } from '@/components/Navbar/navitems'
import SdRegisterList from '@/components/SecurityDeposit/SdRegister/SdRegisterList'
import { Connection } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'

interface Props {
  connections: Paginator<Connection>
}
const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'SD Register',
    href: '/sd-register',
  },
  { title: 'Consumer', href: '#' },
]
const SdRegisterIndex = ({ connections }: Props) => {
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={billingNavItems}
      title={`SD Register`}
      selectedItem='sd-register'
      selectedTopNav='Billing'
    >
      {connections.data && connections.data.length > 0 ? (
        <>
          <SdRegisterList connections={connections.data} />
          <Pagination pagination={connections} />
        </>
      ) : (
        <div className='flex justify-center gap-1'>
          <span className='context-menu-item'>No SD Registers Added</span>
        </div>
      )}
    </MainLayout>
  )
}

export default SdRegisterIndex
