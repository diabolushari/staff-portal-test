import { BillJobStatus } from '@/interfaces/data_interfaces'
import BillingJobCard from './BillingJobCard'
import { router } from '@inertiajs/react'

interface Props {
  billGenerationJobStatus: BillJobStatus[]
  isGroupNameVisible?: boolean
}

export default function BillingJobList({ billGenerationJobStatus, isGroupNameVisible }: Props) {
  const handleView = (item: BillJobStatus) => {
    router.get(`/bills/job-status/${item.billing_group.billing_group_id}`, {
      reading_year_month: item.reading_year_month,
    })
  }
  return (
    <div className='flex flex-col gap-4 p-8'>
      {billGenerationJobStatus.map((job, index) => (
        <BillingJobCard
          key={index}
          month={job.reading_year_month}
          groupName={isGroupNameVisible ? job.billing_group.name : undefined}
          completed={job.total_bills}
          total={job.total_bills}
          exceptions={0}
          billYearMonth={job.bill_year_month}
          onView={() => handleView(job)}
        />
      ))}
    </div>
  )
}
