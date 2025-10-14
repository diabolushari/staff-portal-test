import { tariffNavItems } from '@/components/Navbar/navitems'
import TariffOrderList from '@/components/Tariff/TariffOrderList'
import { TariffOrder } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Tariff Order',
    href: '/tariff-order',
  },
]
interface Props {
  filters: {
    tariff_order_name: string
  }
  tariffOrders: Paginator<TariffOrder>
}

export default function TariffOrderIndexPage({ filters, tariffOrders }: Props) {
  console.log(tariffOrders)
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={tariffNavItems}
      leftBarTitle='Tariff Management'
      addBtnUrl={route('tariff-order.create')}
      addBtnText='Tariff Order'
    >
      <ListSearch
        title='Tariff Order search'
        placeholder='Enter tariff order name'
        url={route('tariff-order.index')}
        search={filters?.tariff_order_name}
      />
      {tariffOrders.data.length > 0 ? (
        <>
          <TariffOrderList tariff_orders={tariffOrders.data} />
          <Pagination pagination={tariffOrders} />
        </>
      ) : (
        <div className='flex h-[calc(100vh-200px)] items-center justify-center'>
          <div className='text-center'>No tariff orders found</div>
        </div>
      )}
    </MainLayout>
  )
}
