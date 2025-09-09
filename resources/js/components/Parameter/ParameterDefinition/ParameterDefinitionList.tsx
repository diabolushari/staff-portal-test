import { ParameterDefinition } from '@/interfaces/parameter_types'
import { Pencil, Trash2 } from 'lucide-react'

interface Props {
  parameterDefinitions: ParameterDefinition[]
  onView?: (item: ParameterDefinition) => void
  onEdit?: (item: ParameterDefinition) => void
  onDelete?: (item: ParameterDefinition) => void
}

export default function ParameterDefinitionList({
  parameterDefinitions,
  onView,
  onEdit,
  onDelete,
}: Readonly<Props>) {
  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
        Parameter Definitions
      </div>
      <div className='flex flex-col px-7 pb-7'>
        {parameterDefinitions.map((def) => (
          <div
            key={def.id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              <div
                className='flex flex-1 flex-col gap-2.5 p-[10px] cursor-pointer'
                onClick={() => onView?.(def)}
              >
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base leading-normal font-semibold text-black'>
                      {def.parameter_name}
                    </div>
                    {def.domain && (
                      <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                        <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                          {def.domain.domain_name}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='text-dark-gray text-sm'>
                    {def.is_effective_date_driven ? 'Date Driven' : 'Static'}
                  </div>

                  {/* Show attributes if available */}
                  <div className='flex flex-wrap gap-2 text-dark-gray text-sm'>
                    {def.attribute1_name && <span>{def.attribute1_name}</span>}
                    {def.attribute2_name && <span>{def.attribute2_name}</span>}
                    {def.attribute3_name && <span>{def.attribute3_name}</span>}
                    {def.attribute4_name && <span>{def.attribute4_name}</span>}
                    {def.attribute5_name && <span>{def.attribute5_name}</span>}
                  </div>
                </div>
              </div>

              {/* Inline Edit/Delete buttons */}
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div className='flex items-center gap-3 mt-2'>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(def)}
                      className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                    >
                      <Pencil className='h-4 w-4' />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(def)}
                      className='flex items-center gap-1 text-sm text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='h-4 w-4' />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
