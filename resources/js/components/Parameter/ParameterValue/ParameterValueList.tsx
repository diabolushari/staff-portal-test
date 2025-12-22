import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import { Layers, Package } from 'lucide-react'

interface Props {
  parameterValues: ParameterValues[]
  onView?: (item: ParameterValues) => void
  onEdit?: (item: ParameterValues) => void
  onDelete?: (item: ParameterValues) => void
}

export default function ParameterValuesList({
  parameterValues,
  onView,
  onEdit,
  onDelete,
}: Readonly<Props>) {
  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
        Parameter Values
      </div>
      <div className='flex flex-col px-7 pb-7'>
        {parameterValues.map((param) => (
          <div
            key={param.id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              <div
                className='flex flex-1 cursor-pointer flex-col gap-2.5 p-[10px]'
                onClick={() => onView?.(param)}
              >
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base leading-normal font-semibold text-black'>
                      {param?.parameter_value}
                    </div>
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                        {param?.parameter_code}
                      </div>
                    </div>
                  </div>
                  {param.definition?.parameter_name && (
                    <div className='flex items-center gap-[3px]'>
                      <Layers className='text-dark-gray h-3.5 w-3.5' />
                      <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                        <StrongText>Parameter Name:</StrongText> {param.definition?.parameter_name}
                      </div>
                    </div>
                  )}
                  <div className='flex w-full items-center gap-5'>
                    <div className='flex items-center gap-[3px]'>
                      <Layers className='text-dark-gray h-3.5 w-3.5' />
                      <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                        <StrongText>Domain:</StrongText> {param.definition?.domain?.domain_name}
                      </div>
                    </div>

                    {param.definition?.domain?.system_module?.name && (
                      <div className='flex items-center gap-[3px]'>
                        <Package className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          <StrongText>Module:</StrongText>{' '}
                          {param.definition?.domain?.system_module?.name}
                        </div>
                      </div>
                    )}
                  </div>

                  {param.notes && (
                    <div className='text-dark-gray text-sm'>Notes: {param.notes}</div>
                  )}
                </div>
              </div>

              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    param.is_active ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div
                    className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                      param.is_active ? 'text-deep-green' : 'text-red-800'
                    }`}
                  >
                    {param.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Inline Edit/Delete buttons */}
                <div className='mt-2 flex items-center gap-3'>
                  {onEdit && <EditButton onClick={() => onEdit(param)} />}
                  {onDelete && <DeleteButton onClick={() => onDelete(param)} />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
