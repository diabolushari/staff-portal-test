import { SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'
import { router } from '@inertiajs/react'

interface Props {
  sdRegisters: SdRegister[]
}

const SdRegisterList = ({ sdRegisters }: Props) => {
  return (
    <>
      <div className='context-menu-item grid grid-cols-10 gap-x-6 gap-y-2 pt-5'>
        <span>SD Register Type</span>
        <span>Consumer Number</span>
        <span>Occupancy Type</span>
        <span>Period From</span>
        <span>Period To</span>
        <span>Generated Date</span>
        <span>SD Amount</span>
        <span>BG Expiry Date</span>
        <span>BG Renewal Due Date</span>
        <span>Settled Date</span>
      </div>
      {sdRegisters.map((sdRegister) => (
        <div
          key={sdRegister.sd_register_id}
          className='normal-font grid cursor-pointer grid-cols-10 gap-x-6 gap-y-2 hover:bg-gray-100'
          onClick={() => router.get(route(`sd-register.show`, sdRegister.sd_register_id))}
        >
          <span>{sdRegister.sd_type.name}</span>
          <span>{sdRegister.connection.consumer_number}</span>
          <span>{sdRegister.occupancy_type.parameter_value}</span>
          <span>{getDisplayDate(sdRegister.period_from)}</span>
          <span>{getDisplayDate(sdRegister.period_to)}</span>
          <span>{getDisplayDate(sdRegister.generated_date)}</span>
          <span>{sdRegister.sd_amount}</span>
          <span>{sdRegister.bg_expiry_date ? getDisplayDate(sdRegister.bg_expiry_date) : '-'}</span>
          <span>
            {sdRegister.bg_renewal_due_date ? getDisplayDate(sdRegister.bg_renewal_due_date) : '-'}
          </span>
          <span>{sdRegister.settled_date ? getDisplayDate(sdRegister.settled_date) : '-'}</span>
        </div>
      ))}
    </>
  )
}

export default SdRegisterList
