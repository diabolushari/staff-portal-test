import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { Paginator } from '@/ui/ui_interfaces'
import Field from '@/components/ui/field'
import StrongText from '@/typography/StrongText'
import TariffConfigTable from '@/components/Tariff/TariffConfig/TariffConfigTable'
import CustomCard from '@/ui/Card/CustomCard'
import { ParameterValues } from '@/interfaces/parameter_types'
import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'

export default function TariffOrderShowPage({
  tariff_order,
  tariff_configs,
  consumption_tariff,
}: {
  tariff_order: TariffOrder
  tariff_configs: Paginator<TariffConfig>
  consumption_tariff: ParameterValues[]
}) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Tariff Order',
      href: '/tariff-orders',
    },
    {
      title: tariff_order.order_descriptor,
      href: `/tariff-orders/${tariff_order?.tariff_order_id}`,
    },
  ]

  return (
    <MainLayout
      leftBarTitle='Tariff Management'
      navItems={meteringBillingNavItems}
      selectedItem='Tariffs'
      breadcrumb={breadcrumb}
      title={tariff_order?.order_descriptor}
      description={
        <>
          Tariff Order details for{'  '}
          <span className='font-bold'>{tariff_order?.order_descriptor}</span>
        </>
      }
    >
      {/* ---- Tariff Order Card ---- */}
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* <div className='ml-auto'>
          <Button
            variant='link'
            onClick={() => router.visit(`/tariff-orders/${tariff_order?.tariff_order_id}/edit`)}
          >
            EDIT
          </Button>
        </div> */}
        <CustomCard>
          <div className='flex items-center justify-between'>
            <StrongText className='text-base font-semibold text-[#252c32]'>
              Basic Information
            </StrongText>
          </div>
          <div className='bg-kseb-line h-px w-full' />
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
          tariffOrder={tariff_order}
          consumption_tariff={consumption_tariff}
        />
      </div>
    </MainLayout>
  )
}
