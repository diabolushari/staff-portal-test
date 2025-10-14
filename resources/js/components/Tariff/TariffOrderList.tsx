import { Download } from 'lucide-react'
import { router } from '@inertiajs/react'
import { TariffOrder } from '@/interfaces/data_interfaces'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'

interface Props {
  tariff_orders: TariffOrder[]
}

export default function TariffOrderList({ tariff_orders }: Readonly<Props>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [deleteModalOrder, setDeleteModalOrder] = useState<TariffOrder | null>(null)
  const handleDownload = (order: TariffOrder) => {
    // Navigate to backend gRPC gateway endpoint that serves the file
    window.open(route('tariff-order.download', order.tariff_order_id), '_blank')
  }

  const handleDelete = (order: TariffOrder) => {
    setDeleteModalOpen(true)
    setDeleteModalOrder(order)
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
        Tariff Order Info
      </div>
      <div className='flex flex-col px-7 pb-7'>
        {tariff_orders?.map((order) => (
          <div
            key={order.tariff_order_id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base font-semibold text-black'>
                      {order.order_descriptor}
                    </div>
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs text-blue-800'>
                        #{order.tariff_order_id}
                      </div>
                    </div>
                  </div>
                  <div className='font-inter text-dark-gray text-sm'>
                    Published: {new Date(order.published_date).toLocaleDateString()}
                  </div>
                  <div className='font-inter text-dark-gray text-sm'>
                    Effective: {new Date(order.effective_start).toLocaleDateString()}
                    {order.effective_end &&
                      ` → ${new Date(order.effective_end).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <button
                  onClick={() => handleDownload(order)}
                  className='flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-200'
                >
                  <Download className='h-4 w-4' />
                  Download
                </button>
                <EditButton
                  onClick={() => router.visit(route('tariff-order.edit', order.tariff_order_id))}
                />
                <DeleteButton onClick={() => handleDelete(order)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Tariff Order'
          url={route('tariff-order.destroy', deleteModalOrder?.tariff_order_id)}
        />
      )}
    </div>
  )
}
