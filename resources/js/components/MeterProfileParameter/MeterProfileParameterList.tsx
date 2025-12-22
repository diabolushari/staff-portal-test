import { MeterProfileGroupByProfile, MeterProfileParameter } from '@/interfaces/data_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  meterProfileParameters: MeterProfileGroupByProfile[]
}

const MeterProfileParameterList = ({ meterProfileParameters }: Props) => {
  const [selectedItem, setSelectedItem] = useState<MeterProfileParameter | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    if (!showDeleteModal) {
      setSelectedItem(null)
    }
  }, [showDeleteModal])

  const handleShow = (profile: MeterProfileGroupByProfile) => {
    console.log('Showing profile:', profile)

    router.get(route('meter-profile.show', profile.profile?.id))
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {meterProfileParameters?.map((group) => (
          <div
            key={group.profile?.id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            onClick={() => handleShow(group)}
          >
            <div className='font-semibold'>{group.profile?.parameter_value}</div>
          </div>
        ))}
      </div>
      {selectedItem && showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete Meter Profile Parameter'
          url={route('meter-profile.destroy', selectedItem.meter_parameter_id)}
        >
          <span>
            Are you sure to delete <b>{selectedItem.name}</b>?
          </span>
        </DeleteModal>
      )}
    </div>
  )
}

export default MeterProfileParameterList
