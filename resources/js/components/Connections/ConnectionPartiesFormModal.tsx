import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection } from '@/interfaces/data_interfaces'
import { Party } from '@/interfaces/parties'
import Button from '@/ui/button/Button'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'

interface ConnectionPartiesFormModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  connection: Connection
  parties: Party[]
}
export default function ConnectionPartiesFormModal({
  setShowModal,
  connection,
  parties,
}: ConnectionPartiesFormModalProps) {
  const { formData, setFormValue } = useCustomForm({
    connection_id: connection?.connection_id,
    party_id: '',
    effective_start: '',
    effective_end: '',
    _method: 'POST',
  })
  const { post, loading, errors } = useInertiaPost<typeof formData>(
    route('connection-parties.store'),
    {
      showErrorToast: true,
    }
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <Modal
      setShowModal={setShowModal}
      title='Add Party'
      showClosButton={true}
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 space-y-4'
      >
        {parties && parties.length > 0 && (
          <SelectList
            label='Party'
            value={formData.party_id}
            setValue={setFormValue('party_id')}
            list={parties}
            dataKey='party_id'
            displayKey='name'
            error={errors.party_id}
            required
          />
        )}
        <DatePicker
          label='From Date'
          value={formData.effective_start}
          setValue={setFormValue('effective_start')}
          error={errors.effective_start}
          required
        />
        <DatePicker
          label='To Date'
          value={formData.effective_end}
          setValue={setFormValue('effective_end')}
          error={errors.effective_end}
          required
        />
        <Button
          type='submit'
          label='Submit'
          disabled={loading}
        />
      </form>
    </Modal>
  )
}
