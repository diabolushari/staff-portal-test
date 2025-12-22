import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  meterProfileParameters: MeterProfileParameter[]
}

const ProfileParameterShowList = ({ meterProfileParameters }: Props) => {
  const [selectedItem, setSelectedItem] = useState<MeterProfileParameter | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    if (!showDeleteModal) {
      setSelectedItem(null)
    }
  }, [showDeleteModal])
  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {meterProfileParameters?.map((meterProfileParameter) => (
          <div
            key={meterProfileParameter.id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base leading-normal font-semibold text-black'>
                      {meterProfileParameter.name}
                    </div>
                  </div>
                  <div className='flex w-full items-center gap-5'>
                    <div className='flex items-center gap-[3px]'>
                      Display Name: <b>{meterProfileParameter.display_name}</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div className='flex items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                  <div
                    className={`rounded-[50px] px-2.5 py-px ${
                      meterProfileParameter.is_export ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <div
                      className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                        meterProfileParameter.is_export ? 'text-deep-green' : 'text-red-800'
                      }`}
                    >
                      {meterProfileParameter.is_export ? 'Export : Yes' : 'Export : No'}
                    </div>
                  </div>

                  <div
                    className={`rounded-[50px] px-2.5 py-px ${
                      meterProfileParameter.is_cumulative ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <div
                      className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                        meterProfileParameter.is_cumulative ? 'text-deep-green' : 'text-red-800'
                      }`}
                    >
                      {meterProfileParameter.is_cumulative ? 'Cumulative : Yes' : 'Cumulative : No'}
                    </div>
                  </div>
                </div>
                <div className='flex items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                  <EditButton
                    onClick={() =>
                      router.get(
                        route('meter-profile.edit', meterProfileParameter.meter_parameter_id)
                      )
                    }
                  />
                  <DeleteButton
                    onClick={() => {
                      setSelectedItem(meterProfileParameter)
                      setShowDeleteModal(true)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedItem && showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete Metering Profile'
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

export default ProfileParameterShowList
