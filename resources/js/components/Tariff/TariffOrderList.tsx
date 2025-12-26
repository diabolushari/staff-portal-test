import { Download, Edit, MoreVertical, Trash2 } from 'lucide-react'
import { router } from '@inertiajs/react'
import { TariffOrder } from '@/interfaces/data_interfaces'
import { useEffect, useRef, useState } from 'react'
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

  const [openActionId, setOpenActionId] = useState<number | null>(null)
  const actionRef = useRef<HTMLDivElement>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setOpenActionId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  useEffect(() => {
    if (openActionId === null) return

    const handler = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setOpenActionId(null)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openActionId])

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {tariff_orders?.map((order) => (
          <div
            key={order.tariff_order_id}
            className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            onClick={() => router.get(route('tariff-orders.show', order.tariff_order_id))}
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
                    Published Date: {new Date(order.published_date).toLocaleDateString()}
                  </div>
                  <div className='font-inter text-dark-gray text-sm'>
                    Effective Period: {new Date(order.effective_start).toLocaleDateString()}
                    {order.effective_end &&
                      ` → ${new Date(order.effective_end).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
              <div className='flex cursor-pointer flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div
                  className='relative'
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      setOpenActionId(
                        openActionId === order.tariff_order_id ? null : order.tariff_order_id
                      )
                    }
                    className='hover:bg-kseb-bg-blue rounded-md p-2 text-gray-600'
                  >
                    <MoreVertical className='h-5 w-5' />
                  </button>

                  {openActionId === order.tariff_order_id && (
                    <div
                      ref={actionMenuRef}
                      className='absolute right-0 z-20 mt-2 w-40 cursor-pointer rounded-md border border-gray-200 bg-white shadow-lg'
                    >
                      <button
                        onClick={() =>
                          router.visit(route('tariff-orders.edit', order.tariff_order_id))
                        }
                        className='flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100'
                      >
                        <Edit className='h-4 w-4' />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDownload(order)}
                        className='flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100'
                      >
                        <Download className='h-4 w-4' />
                        Download
                      </button>

                      <button
                        onClick={() => handleDelete(order)}
                        className='flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                      >
                        <Trash2 className='h-4 w-4' />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className='flex items-center gap-2'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Tariff Order'
          url={route('tariff-orders.destroy', deleteModalOrder?.tariff_order_id)}
        />
      )}
    </div>
  )
}
