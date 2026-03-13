import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { BillingGroup } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import MonthPicker from '@/ui/form/MonthPicker'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'
import dayjs from 'dayjs'

interface SdAssessModalProps {
  setShowModal: (show: boolean) => void
  connection_ids: number[]
  triggerTypes: ParameterValues[]
}

export default function SdAssessModal({
  setShowModal,
  connection_ids,
  triggerTypes,
}: SdAssessModalProps) {
  const { formData, setFormValue } = useCustomForm({
    connection_ids: connection_ids,
    trigger_type_id: '',
    context_date: '',
  })

  const { post, loading } = useInertiaPost(route('sd-assess'))

  const handleSubmitBill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const financialYearList = [
    {
      id: '2024-04-01',
      name: '2024-2025',
    },
  ]

  return (
    <Modal
      title='Initialize Bill'
      setShowModal={setShowModal}
      showClosButton={true}
    >
      <form
        action=''
        className='flex flex-col gap-4'
        onSubmit={handleSubmitBill}
      >
        <SelectList
          label='Trigger Type'
          list={triggerTypes}
          displayKey='parameter_value'
          dataKey='id'
          value={formData?.trigger_type_id}
          setValue={setFormValue('trigger_type_id')}
        />
        <SelectList
          label='Financial Year'
          list={financialYearList}
          displayKey='name'
          dataKey='id'
          value={formData?.context_date}
          setValue={setFormValue('context_date')}
        />
        <div className='flex justify-end gap-2'>
          <Button
            label='Assess Selected'
            type='submit'
            disabled={loading}
            processing={loading}
            variant={loading ? 'loading' : 'primary'}
          />
        </div>
      </form>
    </Modal>
  )
}
