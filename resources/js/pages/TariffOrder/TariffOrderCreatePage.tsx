import MainLayout from '@/layouts/main-layout'
import { tariffNavItems } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { Props } from 'node_modules/@headlessui/react/dist/types'
import TariffOrderForm from '@/components/Tariff/TariffOrderForm'
import { TariffOrder } from '@/interfaces/data_interfaces'

interface PageProps {
  tariff_order: TariffOrder
}
export default function TariffOrderCreatePage({ tariff_order }: Readonly<PageProps>) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Tariff Order',
      href: '/tariff-orders',
    },
    {
      title: tariff_order ? 'Edit Tariff Order' : 'Add Tariff Order',
      href: tariff_order
        ? `/tariff-orders/${tariff_order.tariff_order_id}/edit`
        : '/tariff-orders/create',
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={tariffNavItems}
      leftBarTitle='Tariff Management'
    >
      {' '}
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <div className='flex items-center gap-2'>
          <StrongText className='text-2xl font-semibold'>
            {tariff_order ? 'Edit Tariff Order' : 'Add Tariff Order'}
          </StrongText>
        </div>

        <TariffOrderForm tariffOrder={tariff_order} />
      </div>
    </MainLayout>
  )
}
