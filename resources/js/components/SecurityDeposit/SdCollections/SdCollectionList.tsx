import { SdCollection } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'

interface Props {
  sdCollections: SdCollection[]
}

const SdCollectionList = ({ sdCollections }: Props) => {
  console.log(sdCollections)
  return (
    <div className='space-y-4 p-4'>
      {sdCollections.map((collection) => (
        <div
          key={collection?.sd_collection_id}
          className='rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm'
        >
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div className='flex flex-wrap items-center gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-slate-700'>Date:</span>
                <span className='cursor-pointer text-slate-600'>
                  {getDisplayDate(collection.collection_date)}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-slate-700'>Mode:</span>
                <span className='text-slate-600'>{collection.collection_mode.parameter_value}</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-slate-700'>Amount:</span>
                <span className='text-slate-600'>{collection.collection_amount}</span>
              </div>
              {collection.receipt_number && (
                <div className='flex items-center gap-1'>
                  <span className='font-medium text-slate-700'>Receipt Number:</span>
                  <span className='text-slate-600'>{collection.receipt_number}</span>
                </div>
              )}
              {collection.collected_at && (
                <div className='flex items-center gap-1'>
                  <span className='font-medium text-slate-700'>Collected At:</span>
                  <span className='text-slate-600'>{collection.collected_at}</span>
                </div>
              )}
              {collection.collected_by && (
                <div className='flex items-center gap-1'>
                  <span className='font-medium text-slate-700'>Collected By:</span>
                  <span className='text-slate-600'>{collection.collected_by}</span>
                </div>
              )}
            </div>
          </div>
          {collection.sdAttribute && (
            <div className='flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center'>
              <div className='flex flex-wrap items-center gap-4 text-sm'>
                {collection.sdAttribute.attribute_definition?.parameter_value && (
                  <div className='flex items-center gap-1'>
                    <span className='font-medium text-slate-700'>Attribute Definition:</span>
                    <span className='cursor-pointer text-slate-600'>
                      {collection.sdAttribute.attribute_definition?.parameter_value}
                    </span>
                  </div>
                )}
                <div className='flex items-center gap-1'>
                  <span className='font-medium text-slate-700'>Attribute Value:</span>
                  <span className='text-slate-600'>{collection.sdAttribute.attribute_value}</span>
                </div>

                <div className='flex items-center gap-1'>
                  <span className='font-medium text-slate-700'>Verified:</span>
                  <span className='text-slate-600'>
                    {collection.sdAttribute.is_verified ? 'Yes' : 'No'}
                  </span>
                </div>

                {collection.sdAttribute.verified_by && (
                  <div className='flex items-center gap-1'>
                    <span className='font-medium text-slate-700'>Verified By:</span>
                    <span className='text-slate-600'>{collection.sdAttribute.verified_by}</span>
                  </div>
                )}
                {collection.sdAttribute.verified_date && (
                  <div className='flex items-center gap-1'>
                    <span className='font-medium text-slate-700'>Verified Date:</span>
                    <span className='text-slate-600'>
                      {getDisplayDate(collection.sdAttribute.verified_date)}
                    </span>
                  </div>
                )}
                {collection.sdAttribute.expiry_date && (
                  <div className='flex items-center gap-1'>
                    <span className='font-medium text-slate-700'>Expiry Date:</span>
                    <span className='text-slate-600'>
                      {getDisplayDate(collection.sdAttribute.expiry_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SdCollectionList
