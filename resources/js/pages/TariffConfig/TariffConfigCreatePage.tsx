import { tariffNavItems } from '@/components/Navbar/navitems'
import TariffConfigForm from '@/components/Tariff/TariffConfigForm'
import { TariffOrder } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Tariff Config',
    href: '/tariff-config',
  },
  {
    title: 'Create Tariff Config',
    href: '/tariff-config/create',
  },
]
interface Props {
  tariff_config?: any
  tariff_order?: TariffOrder[]
  connection_purpose?: ParameterValues[]
  consumption_tariff?: ParameterValues[]
}

export default function TariffConfigCreatePage({
  tariff_config,
  tariff_order,
  connection_purpose,
  consumption_tariff,
}: Props) {
  return (
    <MainLayout
      navItems={tariffNavItems}
      breadcrumb={breadcrumb}
      leftBarTitle='Tariff Management'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <div className='flex items-center gap-2'>
          <StrongText className='text-2xl font-semibold'>
            {tariff_config ? 'Edit Tariff Config' : 'Add Tariff Config'}
          </StrongText>
        </div>

        <TariffConfigForm
          tariffConfig={tariff_config}
          tariffOrder={tariff_order ?? []}
          connectionPurpose={connection_purpose ?? []}
          consumptionTariff={consumption_tariff ?? []}
        />
      </div>
    </MainLayout>
  )
}
