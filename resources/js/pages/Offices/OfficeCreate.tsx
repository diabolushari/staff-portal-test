import { settingsOffices } from '@/components/Navbar/navitems'
import OfficeForm from '@/components/Offices/OfficeForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Office } from '@/interfaces/consumers'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { DetailPageTabGroup } from '@/ui/Tabs/DetailPageTabGroup'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offices',
    href: '/offices',
  },
  {
    title: 'Add Office',
    href: '/offices/create',
  },
]
interface Props {
  parameterValues: ParameterValues[]
  office?: Office
}
export default function OfficeCreate({ parameterValues, office }: Props) {
  const tabs = [
    {
      value: 'detail',
      label: 'Office Detail',
      content: (
        <OfficeForm
          parameterValues={parameterValues}
          office={office}
        />
      ),
    },
    {
      value: 'Substations',
      label: 'Substations',
      content: <div>Substations</div>,
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={settingsOffices}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <div className='flex items-center gap-2'>
          <StrongText className='text-2xl font-semibold'>Add Office</StrongText>
        </div>
        <DetailPageTabGroup tabs={tabs} />
      </div>
    </MainLayout>
  )
}
