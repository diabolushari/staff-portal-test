import { router } from '@inertiajs/react'
import BillListCard from './BillListCard'
import { BillGenerationJobStatus } from '@/interfaces/data_interfaces'

export default function BillList({ data }: { data: BillGenerationJobStatus[] }) {
  if (!data?.length) {
    return <div className='mt-10 text-center text-gray-500'>No bills found</div>
  }

  return (
    <div className='space-y-4'>
      {data.map((status) => (
        <BillListCard
          key={status.bill?.bill_id}
          status={status}
          onView={() => {
            // navigate to bill detail
            if (!status.bill?.bill_id) return
            router.get(`/bills/${status.bill?.bill_id}`)
          }}
        />
      ))}
    </div>
  )
}
