import { MeterProfileGroupByProfile, MeterProfileParameter } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  meterProfileParameters: MeterProfileGroupByProfile[]
  profilesWithNoParameterValue: ParameterValues[]
}

const MeterProfileParameterList = ({
  meterProfileParameters,
  profilesWithNoParameterValue,
}: Props) => {
  const [selectedItem, setSelectedItem] = useState<MeterProfileParameter | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    if (!showDeleteModal) {
      setSelectedItem(null)
    }
  }, [showDeleteModal])

  const handleShow = (profileId: number) => {
    router.get(route('meter-profile.show', profileId))
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col gap-6 px-7 pb-7'>
        {meterProfileParameters.length > 0 &&
          meterProfileParameters.map((group) => (
            <div
              key={group.profile.id}
              className='cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm'
              onClick={() => handleShow(group.profile.id)}
            >
              <div className='flex cursor-pointer items-center justify-between border-b border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800'>
                {group.profile.parameter_value}
              </div>

              <div className='flex flex-wrap gap-4 px-4 py-3 text-sm text-slate-700'>
                {group.parameters.map((param) => (
                  <div
                    key={param.meter_parameter_id}
                    className='min-w-[220px]'
                  >
                    {/* Name + badge on same line */}
                    <div className='flex items-center gap-2'>
                      <div className='font-medium text-slate-900'>{param.name}</div>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal ${
                          param.is_export
                            ? 'text-deep-green bg-green-100'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {param.is_export ? 'Export' : 'Import'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {profilesWithNoParameterValue.length > 0 && (
          <>
            {profilesWithNoParameterValue.map((profile) => (
              <div
                key={profile.id}
                className='cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm'
                onClick={() => handleShow(profile.id)}
              >
                <div className='cursor-pointer border-b border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800'>
                  {profile.parameter_value}
                </div>

                <div className='px-4 py-3 text-sm text-slate-500'>No data added</div>
              </div>
            ))}
          </>
        )}
        {!meterProfileParameters.length && !profilesWithNoParameterValue.length && (
          <div className='p-6 text-center text-slate-500'>No profile parameters found.</div>
        )}
      </div>

      {selectedItem && showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete Meter Profile Parameter'
          url={route('meter-profile.destroy', selectedItem.meter_parameter_id)}
        >
          <span>
            Are you sure you want to delete <b>{selectedItem.name}</b>?
          </span>
        </DeleteModal>
      )}
    </div>
  )
}

export default MeterProfileParameterList
