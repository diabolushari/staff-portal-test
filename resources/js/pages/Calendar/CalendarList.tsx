import { Calendar } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import MainLayout from '@/layouts/main-layout'
import CalendarTable from './CalendarTable'

export default function CalendarList({ calendar }: { calendar: Paginator<Calendar> }) {
  return (
    <MainLayout title='Calendar Management'>
      <CalendarTable calendar={calendar} />
    </MainLayout>
  )
}
