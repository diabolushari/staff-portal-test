import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'
import { StationConsumerRel } from '@/interfaces/data_interfaces'

interface Props {
  setShowModal: (show: boolean) => void
  relation: StationConsumerRel
}

export default function ReprioritizeStationConsumerModal({ setShowModal, relation }: Props) {
  const { formData, setFormValue } = useCustomForm({
    version_id: relation.version_id,
    station_connection_id: relation.station_connection_id,
    consumer_priority_order: relation.consumer_priority_order ?? '',
    station_priority_order: relation.station_priority_order ?? '',
    _method: 'PUT',
  })

  const { post, loading } = useInertiaPost(`/station-consumer-rels/${relation.version_id}`, {
    onComplete: () => {
      setShowModal(false)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const handleClose = () => {
    setShowModal(false)
  }
  console.log(formData)
  return (
    <Modal
      setShowModal={handleClose}
      title='Reprioritize Station'
    >
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <Input
          label='Consumer Priority'
          type='number'
          value={formData.consumer_priority_order}
          setValue={setFormValue('consumer_priority_order')}
        />

        <Input
          label='Station Priority'
          type='number'
          value={formData.station_priority_order}
          setValue={setFormValue('station_priority_order')}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            label='Cancel'
          />
          <Button
            type='submit'
            label='Save'
          />
        </div>
      </form>
    </Modal>
  )
}
