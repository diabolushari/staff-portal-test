import MeterTransformerListItem from '@/components/Meter/MeterTransformer/MeterTransformerListItem'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { useState } from 'react'
import { MeterTransformer } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'

interface Props {
  filters: {
    search: string
    sort_by: string
    sort_direction: string
  }
  transformers: Paginator<MeterTransformer>
}

const breadcrumbs = [
  { title: 'Settings', href: '/settings-page' },
  { title: 'CTPTs', href: '/meter-ctpt' },
]

export default function MeterTransformerIndex({ filters, transformers }: Readonly<Props>) {
  const items = transformers?.data ?? []
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTransformer, setSelectedTransformer] = useState<MeterTransformer | null>(null)

  function handleDeleteClick(item: MeterTransformer) {
    setShowDeleteModal(true)
    setSelectedTransformer(item)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='CTPTs'
      addBtnText='CTPT'
      addBtnUrl={route('meter-ctpt.create')}
      title='CTPTS'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title=''
          placeholder='Enter CTPT Serial'
          url={route('meter-ctpt.index')}
          search={filters?.search}
        />
        {/* <Button label="Create Meter Transformer" onClick={handleCreate} /> */}
        {items && items.length > 0 ? (
          <div className='relative w-full rounded-lg bg-white'>
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
        <Pagination pagination={transformers} />
      </div>
    </MainLayout>
  )
}
