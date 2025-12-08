import { metadataNavItems } from '@/components/Navbar/navitems'
import OfficeForm from '@/components/Offices/OfficeForm'
import { Office, OfficeHierarchy } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@/components/ui/tabs'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings-page',
  },
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
  officeHierarchies: OfficeHierarchy[]
}

export default function OfficeCreate({
  parameterValues,
  office,
  officeHierarchies,
}: Readonly<Props>) {
  const tabs = [
    {
      value: 'detail',
      label: 'Office Detail',
    },
    {
      value: 'substations',
      label: 'Substations',
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      selectedItem='Office Details'
      navItems={metadataNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <div className='flex items-center gap-2'>
          <StrongText className='text-2xl font-semibold'>
            {office ? 'Edit Office' : 'Add Office'}
          </StrongText>
        </div>
        <TabGroup tabs={tabs}>
          <TabsContent value='detail'>
            <OfficeForm
              parameterValues={parameterValues}
              office={office}
              officeHierarchies={officeHierarchies}
            />
          </TabsContent>
          <TabsContent value='substations'>
            <div>Substations</div>
          </TabsContent>
        </TabGroup>
      </div>
    </MainLayout>
  )
}
