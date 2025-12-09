import Modal from '@/ui/Modal/Modal'

interface Props {
  setShowModal: (show: boolean) => void
  isStatusChange: boolean
}

export default function ConnectionMeterUpdateModal({ setShowModal, isStatusChange }: Props) {
  const handleClose = () => {
    setShowModal(false)
  }
  return (
    <Modal
      setShowModal={handleClose}
      title={isStatusChange ? 'Update Meter Status' : 'Change Reason'}
    >
      <div>Meter update</div>
    </Modal>
  )
}
