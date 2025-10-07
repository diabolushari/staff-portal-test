import MeterTransformerListItem from '@/components/Meter/MeterTransformer/MeterTransformerListItem'
import { meterNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { useState } from 'react'
import { MeterTransformer } from '@/interfaces/data_interfaces'

interface Props {
  transformers: MeterTransformer[]
}

const breadcrumbs = [{ title: 'Meter CTPT', href: '/meter-ctpt' }]

export default function MeterTransformerIndex({ transformers }: Readonly<Props>) {
  const [items, setItems] = useState(transformers ?? [])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTransformer, setSelectedTransformer] = useState<MeterTransformer | null>(null)

  function handleDeleteClick(item: MeterTransformer) {
    setShowDeleteModal(true)
    setSelectedTransformer(item)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterNavItems}
      addBtnText='Meter CTPT'
      addBtnUrl={route('meter-ctpt.create')}
    >
      <div className='flex h-full flex-1 flex-col gap-6 p-6'>
        <CardHeader title='Meter CTPT' />
        <ListSearch
          title='Meter CTPT Search'
          url={route('meter-ctpt.index')}
        />
        {/* <Button label="Create Meter Transformer" onClick={handleCreate} /> */}
        {items && items.length > 0 ? (
          <div className='relative w-full rounded-lg bg-white'>
            <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
              Meter CTPT List
            </div>
            <div className='flex flex-col gap-4 px-7 pb-7'>
              {items.map((transformer) => (
                <MeterTransformerListItem
                  key={transformer.meter_ctpt_id}
                  transformer={transformer}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className='p-6 text-center text-slate-500'>
            <p>No meter transformers found.</p>
          </div>
        )}
        {showDeleteModal && selectedTransformer && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete CTPT ${selectedTransformer.ctpt_serial}`}
            url={`/meter-ctpt/${selectedTransformer.meter_ctpt_id}`}
          />
        )}
      </div>
    </MainLayout>
  )
}
