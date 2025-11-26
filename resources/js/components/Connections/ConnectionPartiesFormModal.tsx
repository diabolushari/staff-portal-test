import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, ConnectionPartyMapping } from '@/interfaces/data_interfaces'
import { Party } from '@/interfaces/parties'
import Button from '@/ui/button/Button'
import ComboBox from '@/ui/form/ComboBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

interface ConnectionPartiesFormModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  connection: Connection
  parties: Party[]
  connectionParty?: ConnectionPartyMapping
}
export default function ConnectionPartiesFormModal({
  setShowModal,
  connection,
  parties,
  connectionParty,
}: ConnectionPartiesFormModalProps) {
  const [partyItem, setPartyItem] = useState<Party | null>(null)
  const { formData, setFormValue } = useCustomForm({
    version_id: connectionParty?.version_id ?? '',
    connection_id: connection?.connection_id,
    party_id: partyItem?.party_id ?? '',
    effective_start: dayjs(connectionParty?.effective_start?.date ?? '').format('YYYY-MM-DD'),
    effective_end: dayjs(connectionParty?.effective_end?.date ?? '').format('YYYY-MM-DD'),
    _method: connectionParty ? 'PUT' : 'POST',
  })
  useEffect(() => {
    if (partyItem) {
      setFormValue('party_id')(partyItem?.party_id ?? '')
    }
  }, [partyItem])
  const { post, loading, errors } = useInertiaPost<typeof formData>(
    connectionParty
      ? route('connection-parties.update', connectionParty?.version_id)
      : route('connection-parties.store'),
    {
      showErrorToast: true,
      onComplete: () => {
        setShowModal(false)
      },
    }
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        <ComboBox
          label='Party'
          value={partyItem}
          setValue={setPartyItem}
          dataKey='party_id'
          displayKey='name'
          displayValue2='party_code'
          error={errors.party_id}
          url='/api/parties?search='
        />
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
