import Modal from '@/ui/Modal/Modal'

interface BillInitializeModalProps {
  setShowModal: (show: boolean) => void
  showModal: boolean
}

export default function BillInitializeModal({ setShowModal, showModal }: BillInitializeModalProps) {
  return (
    <Modal
      title='Initialize Bill'
      setShowModal={setShowModal}
      showClosButton={true}
    ></Modal>
  )
}
