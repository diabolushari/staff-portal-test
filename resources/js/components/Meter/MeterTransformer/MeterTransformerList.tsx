import { MeterTransformer } from '@/pages/MeterTransformers/MeterTransformerIndex'
import { router } from '@inertiajs/react'
import { Cpu, Trash2, Zap } from 'lucide-react'

interface Props {
  transformers: MeterTransformer[]
   onDelete?: (item: MeterTransformer) => void
}



export default function MeterTransformerList({ transformers,onDelete,}: Readonly<Props>) {
  const handleTransformerClick = (transformer: MeterTransformer) => {
    router.get(`/meter-ctpt/${transformer.meter_ctpt_id}`)
  }

  return (
    <div className="relative w-full rounded-lg bg-white">
      <div className="font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]">
        Meter Transformer Info
      </div>
      <div className="flex flex-col px-7 pb-7">
        {transformers.map((mt) => (
          <div
            key={mt.meter_ctpt_id}
            onClick={() => handleTransformerClick(mt)}
            className="mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-1 flex-col gap-2.5 p-[10px]">
                <div className="flex flex-col gap-1">
                  {/* Serial + Type */}
                  <div className="flex items-center gap-2">
                    <div className="font-inter text-base leading-normal font-semibold text-black">
                      {mt.ctpt_serial}
                    </div>
                    <div className="rounded-[50px] bg-blue-100 px-2.5 py-px">
                      <div className="font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800">
                        {mt.type.parameter_value}
                      </div>
                    </div>
                  </div>

                  {/* Ratios */}
                  <div className="flex w-full flex-wrap gap-5">
                    <div className="flex items-center gap-[3px]">
                      <Cpu className="text-dark-gray h-3.5 w-3.5" />
                      <div className="font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]">
                        CT Ratio: {mt.ct_ratio}
                      </div>
                    </div>
                    <div className="flex items-center gap-[3px]">
                      <Zap className="text-dark-gray h-3.5 w-3.5" />
                      <div className="font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]">
                        PT Ratio: {mt.pt_ratio}
                      </div>
                    </div>
                  </div>

                  {/* Faulty / Rectification Dates */}
                  {/* <div className="font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]">
                    Faulty Date: {mt.faulty_date || 'N/A'}
                  </div>
                  <div className="font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]">
                    Rectification Date: {mt.rectification_date || 'N/A'}
                  </div> */}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]">
                {/* <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    mt.status_name === 'Active' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div
                    className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                      mt.status_name === 'Active' ? 'text-deep-green' : 'text-red-800'
                    }`}
                  >
                    {mt.status.parameter_value}
                  </div>
                </div> */}
                  <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(mt)
                  }}
                  className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {transformers.length === 0 && (
          <div className="p-6 text-center text-slate-500">
            No meter transformers found.
          </div>
        )}
      </div>
    </div>
  )
}
