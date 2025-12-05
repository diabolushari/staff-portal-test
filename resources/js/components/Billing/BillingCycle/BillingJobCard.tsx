import { Card } from '@/components/ui/card'
import Button from '@/ui/button/Button'
import dayjs from 'dayjs'
import { CalendarDaysIcon } from 'lucide-react'

interface BillingJobCardProps {
  month: string // e.g., "Nov 2025"
  groupName?: string // e.g., "Group 1"
  completed: number
  total: number
  exceptions: number
  initializedDate?: string
  onView: () => void
  billYearMonth?: string
}

export default function BillingJobCard({
  month,
  groupName,
  completed,
  total,
  exceptions,
  initializedDate,
  onView,
  billYearMonth,
}: BillingJobCardProps) {
  return (
    <Card>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <div className='text-lg font-semibold text-gray-900'>
            {dayjs(month).format('MMM YYYY')} | {groupName ? groupName : ''}
          </div>

          {/* Status Info */}
          <div className='mt-3 space-y-1 text-sm text-gray-600'>
            <div className='flex gap-2'>
              <span className='font-medium'>Completed:</span>
              <span className='text-blue-600'>
                {completed}/{total}
              </span>
            </div>

            <div className='flex gap-2'>
              <span className='font-medium'>Exceptions:</span>
              <span className='text-red-600'>{exceptions}</span>
            </div>
            {billYearMonth && (
              <div className='mt-2 flex items-center gap-2 text-gray-500'>
                <CalendarDaysIcon size={16} />
                <span className='text-sm'>Bill Year Month: {billYearMonth}</span>
              </div>
            )}

            {initializedDate && (
              <div className='mt-2 flex items-center gap-2 text-gray-500'>
                <CalendarDaysIcon size={16} />
                <span className='text-sm'>Initialized: {initializedDate}</span>
              </div>
            )}
          </div>
        </div>
        {/* View Button */}
        <div>
          <div className='flex justify-end'>
            <Button
              label='View'
              variant='primary'
              onClick={onView}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
