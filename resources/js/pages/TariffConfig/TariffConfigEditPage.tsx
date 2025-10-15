import { tariffNavItems } from '@/components/Navbar/navitems'
import TariffConfigEditForm from '@/components/Tariff/TariffConfig/TariffConfigEditForm'
import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

interface Props {
  tariff_config: TariffConfig
  tariff_orders: TariffOrder[]
  consumption_tariffs: ParameterValues[]
  connection_purposes: ParameterValues[]
}

export default function TariffConfigEditPage({
  tariff_config,
  tariff_orders,
  consumption_tariffs,
  connection_purposes,
}: Props) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Tariff Config',
      href: route('tariff-config.index'),
    },
    {
      title: 'Edit',
      href: route('tariff-config.edit', tariff_config.tariff_config_id),
    },
  ]
  return (
    <MainLayout
      navItems={tariffNavItems}
      breadcrumb={breadcrumb}
    >
      <TariffConfigEditForm
        tariff_config={tariff_config}
        tariffOrders={tariff_orders}
        consumptionTariffs={consumption_tariffs}
        connectionPurposes={connection_purposes}
      />
    </MainLayout>
  )
}
