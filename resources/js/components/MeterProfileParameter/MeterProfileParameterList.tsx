import { MeterProfileGroupByProfile, MeterProfileParameter } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import NormalText from '@/typography/NormalText'
import StrongText from '@/typography/StrongText'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { Gauge } from 'lucide-react'
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
  const exportImportChecking = (parameters: MeterProfileParameter[]) => {
    const isExportable = parameters.filter((profile) => profile?.is_export)
    const isImportable = parameters.filter((profile) => profile?.is_export === false)
    return { isExportable, isImportable }
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col gap-6 px-7 pb-7'>
        {meterProfileParameters.length > 0 &&
          meterProfileParameters.map((group) => (
            <div
              key={group?.profile?.id ?? 0}
              onClick={() => handleShow(group?.profile?.id ?? 0)}
              className='cursor-pointer rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md'
            >
              {/* Header */}
              <div className='flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-slate-50 px-4 py-3'>
                <div className='flex items-center gap-3'>
                  {/* Gauge – unchanged */}
                  <Gauge className='h-10 w-10 text-green-800' />

                  {/* Value & Code – unchanged */}
                  <div>
                    <NormalText className='text-xl font-semibold'>
                      {group?.profile?.parameter_value}
                    </NormalText>
                    <p className='text-sm text-gray-600'>{group?.profile?.parameter_code}</p>
                  </div>
                </div>

                {/* Right side status */}
                <div className='flex items-center gap-4'>
                  {/* Count */}
                  <div className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'>
                    No: {group?.parameters?.length}
                  </div>

                  {/* Export / Import */}
                  <div className='flex gap-2 text-sm font-medium'>
                    {exportImportChecking(group?.parameters ?? []).isExportable.length > 0 && (
                      <span className='flex items-center gap-1 text-green-600'>⬆ Export</span>
                    )}
                    {exportImportChecking(group?.parameters ?? []).isImportable.length > 0 && (
                      <span className='flex items-center gap-1 text-red-600'>⬇ Import</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className='px-4 py-3'>
                <NormalText className='text-gray-700'>{group?.profile?.notes}</NormalText>
              </div>
            </div>
          ))}

        {profilesWithNoParameterValue.length > 0 && (
          <>
            {profilesWithNoParameterValue.map((profile) => (
              <div
                key={profile?.id}
                className='cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm'
                onClick={() => handleShow(profile?.id)}
              >
                <div className='cursor-pointer border-b border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800'>
                  {profile?.parameter_value}
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
