import ActionButton from '@/components/action-button'
import { SdDemand } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { getDisplayDate } from '@/utils'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  sdDemands: SdDemand[]
}

const SdDemandList = ({ sdDemands }: Props) => {
  const [deleteItem, setDeleteItem] = useState<SdDemand | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    if (!showDeleteModal) {
      setDeleteItem(null)
    }
  }, [showDeleteModal])
  return (
    <div>
      <div className='relative w-full rounded-lg bg-white'>
        <div className='flex flex-col px-7 pb-7'>
          {sdDemands.map((sdDemand) => (
            <div
              key={sdDemand.sd_demand_id}
              className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            >
              <div className='flex items-start justify-between'>
                <div className='flex flex-1 cursor-pointer flex-col gap-2.5 p-[10px]'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <div className='font-inter text-base leading-normal font-semibold text-black'>
                        Consumer Number :
                        <StrongText>{sdDemand.connection.consumer_number}</StrongText>
                      </div>
                    </div>

                    <div className='flex w-full items-center gap-5'>
                      <div className='flex items-center gap-[3px]'>
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Demand Type:{' '}
                          <StrongText> {sdDemand.demand_type.parameter_value}</StrongText>
                        </div>
                      </div>
                      {sdDemand.calculation_basic && (
                        <div className='flex items-center gap-[3px]'>
                          <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                            Calculation Basic:{' '}
                            <StrongText> {sdDemand.calculation_basic?.parameter_value}</StrongText>
                          </div>
                        </div>
                      )}
                      <div className='flex items-center gap-[3px]'>
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Calculation Period Start:{' '}
                          <StrongText>
                            {' '}
                            {getDisplayDate(sdDemand.calculation_period_from)}
                          </StrongText>
                        </div>
                      </div>
                      <div className='flex items-center gap-[3px]'>
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Calculation Period End:{' '}
                          <StrongText> {getDisplayDate(sdDemand.calculation_period_to)}</StrongText>
                        </div>
                      </div>
                      <div className='flex items-center gap-[3px]'>
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Total SD Amount: <StrongText> {sdDemand.total_sd_amount}</StrongText>
                        </div>
                      </div>
                    </div>
                    <div className='flex w-full items-center gap-5'>
                      <div className='flex items-center gap-[3px]'>
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Applicable From:{' '}
                          <StrongText> {getDisplayDate(sdDemand.applicable_from)}</StrongText>
                        </div>
                      </div>
                      {sdDemand.applicable_to && (
                        <div className='flex items-center gap-[3px]'>
                          <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                            Applicable To:{' '}
                            <StrongText> {getDisplayDate(sdDemand.applicable_to)}</StrongText>
                          </div>
                        </div>
                      )}
                      <div className='flex items-center gap-[3px]'>
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Status: <StrongText> {sdDemand.status.parameter_value}</StrongText>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                  <div
                    className={`rounded-[50px] px-2.5 py-px ${
                      sdDemand.is_active ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <div
                      className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                        sdDemand.is_active ? 'text-deep-green' : 'text-red-800'
                      }`}
                    >
                      {sdDemand.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {/* Inline Edit/Delete buttons */}
                  <div className='mt-2 flex items-center gap-3'>
                    <ActionButton
                      onDelete={() => {
                        setDeleteItem(sdDemand)
                        setShowDeleteModal(true)
                      }}
                      onEdit={() => router.get(route('sd-demands.edit', sdDemand.sd_demand_id))}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showDeleteModal && deleteItem && (
          <DeleteModal
            title='Delete Security Deposit Demand'
            url={route('sd-demands.destroy', deleteItem?.sd_demand_id)}
            setShowModal={(showModal) => setShowDeleteModal(showModal)}
          >
            <span>
              Are you sure to delete the security deposit demand with consumer number{' '}
              <b>{deleteItem?.connection.consumer_number}</b>?
            </span>
          </DeleteModal>
        )}
      </div>
    </div>
  )
}

export default SdDemandList
