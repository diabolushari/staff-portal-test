import { tariffNavItems } from '@/components/Navbar/navitems'
import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { Paginator } from '@/ui/ui_interfaces'
import { Card, CardHeader } from '@/components/ui/card'
import { router } from '@inertiajs/react'
import Pagination from '@/ui/Pagination/Pagination'
import Field from '@/components/ui/field'
import StrongText from '@/typography/StrongText'
import { PencilIcon } from 'lucide-react'
import TariffConfigTable from '@/components/Tariff/TariffConfig/TariffConfigTable'
import CustomCard from '@/ui/Card/CustomCard'

export default function TariffOrderShowPage({
  tariff_order,
  tariff_configs,
}: {
  tariff_order: TariffOrder
  tariff_configs: Paginator<TariffConfig>
}) {
  const breadcrumb: BreadcrumbItem[] = [
    { title: 'Tariff Order', href: '/tariff-orders' },
    {
      title: tariff_order.order_descriptor,
      href: `/tariff-orders/${tariff_order?.tariff_order_id}`,
    },
  ]

  return (
    <MainLayout
      leftBarTitle='Tariff Management'
      navItems={tariffNavItems}
      breadcrumb={breadcrumb}
    >
      {/* ---- Tariff Order Card ---- */}
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        <CustomCard
          title={tariff_order?.order_descriptor}
          editButton={{
            title: 'Edit',
            url: `/tariff-orders/${tariff_order?.tariff_order_id}/edit`,
          }}
        >
          <div className='mb-6 flex items-center justify-between'>
            <StrongText className='text-base font-semibold text-[#252c32]'>
              Basic Information
            </StrongText>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Field
                label='Published Date'
                value={new Date(tariff_order?.published_date).toLocaleDateString()}
              />
            </div>
            <div>
              <Field
                label='Effective Start'
                value={new Date(tariff_order?.effective_start).toLocaleDateString()}
              />
            </div>
            <div>
              <Field
                label='Effective End'
                value={new Date(tariff_order?.effective_end || '').toLocaleDateString()}
              />
            </div>
            <div>
              <Field
                label='Reference Document'
                value={tariff_order?.reference_document}
              />
              <a
                href={`/api/tariff-order/${tariff_order?.tariff_order_id}/download`}
                target='_blank'
                className='text-blue-600 underline'
              >
                View PDF
              </a>
            </div>
          </div>
        </CustomCard>

        {/* ---- Tariff Config Table ---- */}
        <TariffConfigTable
          tariff_configs={tariff_configs}
          tariffOrderId={tariff_order.tariff_order_id}
        />
      </div>
    </MainLayout>
  )
}
