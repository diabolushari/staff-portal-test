import useCustomForm from '@/hooks/useCustomForm'
import Modal from '@/ui/Modal/Modal'

interface BillInitializeModalProps {
  setShowModal: (show: boolean) => void
  showModal: boolean
}

export default function BillInitializeModal({ setShowModal, showModal }: BillInitializeModalProps) {
  const { formData, setFormValue } = useCustomForm({})
  return (
    <Modal
      title='Initialize Bill'
      setShowModal={setShowModal}
      showClosButton={true}
    >
      <form action=''></form>
    </Modal>
  )
}
