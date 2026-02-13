import { Calendar } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import MainLayout from '@/layouts/main-layout'
import CalendarTable from './CalendarTable'
import { metadataNavItems } from '@/components/Navbar/navitems'

export default function CalendarList({ calendar }: { calendar: Paginator<Calendar> }) {
  return (
    <MainLayout
      title='Calendar'
      navItems={metadataNavItems}
      selectedItem='Calendar'
      description='Manage calendar entries, holidays and weekends'
    >
      <CalendarTable calendar={calendar} />
    </MainLayout>
  )
}
