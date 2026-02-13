import { Calendar } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Pagination from '@/ui/Pagination/Pagination'
import CustomCard from '@/ui/Card/CustomCard'
import { useState } from 'react'
import ActionButton from '@/components/action-button'
import CalendarEditModal from './CalendarEditModal'
import { getDisplayDate } from '@/utils'

export default function CalendarTable({ calendar }: { calendar: Paginator<Calendar> }) {
  const [editItem, setEditItem] = useState<Calendar | null>(null)

  return (
    <CustomCard>
      <div className='overflow-visible'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Day of Week</TableHead>
              <TableHead>Day of Year</TableHead>
              <TableHead>Holiday</TableHead>
              <TableHead>Weekend</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {calendar?.data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{getDisplayDate(item.calendar_date)}</TableCell>
                <TableCell>{item.day_of_week}</TableCell>
                <TableCell>{item.day_of_year}</TableCell>
                <TableCell>{item.is_holiday ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.is_weekend ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.remarks || '-'}</TableCell>

                <TableCell>
                  <ActionButton onEdit={() => setEditItem(item)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='mt-4'>
        <Pagination pagination={calendar} />
      </div>

      {editItem && (
        <CalendarEditModal
          calendar={editItem}
          setModalOpen={() => setEditItem(null)}
        />
      )}
    </CustomCard>
  )
}
