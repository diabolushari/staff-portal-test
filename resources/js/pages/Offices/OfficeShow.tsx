import AppLayout from '@/layouts/app-layout'
import CardHeader from '@/ui/Card/CardHeader'
import { Office } from '@/interfaces/consumers'
import { router } from '@inertiajs/react'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import TinyContainer from '@/ui/Card/TinyContainer'
import OfficeDetails from '@/components/Offices/OfficeDetails'
import { DetailPageTabGroup } from '@/ui/Tabs/DetailPageTabGroup'

export default function OfficeShow({ office }: { office: Office }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Offices',
      href: '/offices',
    },
    {
      title: 'Detail',
      href: `/offices/${office.office_id}`,
    },
  ]
  const {
    office_id,
    office_name,
    office_code,
    office_description,
    office_type_id,
    parent_office_id,
    effective_start,
    effective_end,
    contact_folio,
    office_type,
    is_current,
  } = office

  const formatDate = (dateStr?: string) => (dateStr ? new Date(dateStr).toLocaleDateString() : '-')
  console.log(office)
  const tabs = [
    {
      value: 'detail',
      label: 'Office Detail',
      content: <OfficeDetails office={office} />,
    },
    {
      value: 'Substations',
      label: 'Substations',
      content: <div>Substations</div>,
    },
    {
      value: 'Consumers',
      label: 'Consumers',
      content: <div>Consumers</div>,
    },
  ]
  return (
    <MainLayout breadcrumb={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <div className='flex items-center gap-2'>
          <StrongText className='text-2xl font-semibold'>{`${office_code} - ${office_name}`}</StrongText>
          <TinyContainer variant={office.is_current ? 'success' : 'danger'}>
            {office.is_current ? 'Active' : 'Inactive'}
          </TinyContainer>
        </div>
        <DetailPageTabGroup tabs={tabs} />
      </div>
    </MainLayout>
  )
}
