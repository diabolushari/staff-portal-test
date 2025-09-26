import MeterTransformerList from '@/components/Meter/MeterTransformer/MeterTransformerList'
import { transformerNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import { MeterTransformer } from './MeterTransformerShow'

interface Props {
  transformers: MeterTransformer[]
}
const breadcrumbs = [{ title: 'Meter CTPT', href: '/meter-ctpt' }]

export default function MeterTransformerIndex({ transformers }: Readonly<Props>) {
  const [items, setItems] = useState(transformers ?? [])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTransformer, setSelectedTransformer] = useState<MeterTransformer | null>(null)
  console.log('Meter Transformers:', items)
  function handleShow(id: number) {
    router.get(`/meter-ctpt/${id}`)
  }

  function handleCreate() {
    router.get(route('meter-ctpt.create'))
  }

  function handleDeleteClick(item: MeterTransformer) {
    setShowDeleteModal(true)
    setSelectedTransformer(item)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={transformerNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-6 p-6'>
        <CardHeader title='Meter CTPT' />
        <ListSearch
          title='Meter CTPT Search'
          url={route('meter-ctpt.index')}
          //setItems={setItems}
          //search={query}
        />
        {/* <Button label="Create Meter Transformer" onClick={handleCreate} /> */}
        {items && items.length > 0 ? (
          <MeterTransformerList
            transformers={items}
            onDelete={handleDeleteClick}
          />
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
