import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import DatePicker from '@/ui/form/DatePicker'
import MonthPicker from '@/ui/form/MonthPicker'
import Modal from '@/ui/Modal/Modal'

interface BillInitializeModalProps {
  setShowModal: (show: boolean) => void
  showModal: boolean
  selectedConnections: number[]
}

export default function BillInitializeModal({
  setShowModal,
  showModal,
  selectedConnections,
}: BillInitializeModalProps) {
  const { formData, setFormValue } = useCustomForm({
    connections: selectedConnections,
    reading_month: '',
    bill_month: '',
    bill_date: '',
    due_date: '',
    dc_date: '',
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
  }
  return (
    <Modal
      title='Initialize Bill'
      setShowModal={setShowModal}
      showClosButton={true}
    >
      <form
        action=''
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <MonthPicker
          label='Reading Year and Month'
          value={formData.reading_month}
          setValue={setFormValue('reading_month')}
        />
        <MonthPicker
          label='Bill Year and Month'
          value={formData.bill_month}
          setValue={setFormValue('bill_month')}
        />
        <DatePicker
          label='Bill Date'
          value={formData.bill_date}
          setValue={setFormValue('bill_date')}
        />
        <DatePicker
          label='Due Date'
          value={formData.due_date}
          setValue={setFormValue('due_date')}
        />
        <DatePicker
          label='DC Date'
          value={formData.dc_date}
          setValue={setFormValue('dc_date')}
        />
        <div className='flex justify-end gap-2'>
          <Button
            label='Initialize'
            type='submit'
          />
        </div>
      </form>
    </Modal>
  )
}
