import { useState } from 'react'
import Modal from '@/ui/Modal/Modal'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'

interface Props {
  setShowModal: (value: boolean) => void
  onAdd: (contact: { email: string; phone: string }) => void
}

export default function ConsumerContactFolioModal({ setShowModal, onAdd }: Props) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email && !phone) return
    onAdd({ email, phone })
    setShowModal(false)
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title='Add Contact'
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <Input
          label='Email'
          type='email'
          value={email}
          setValue={setEmail}
          placeholder='Enter additional email'
        />
        <Input
          label='Phone'
          type='text'
          value={phone}
          setValue={setPhone}
          placeholder='Enter additional phone number'
        />
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            label='Cancel'
            onClick={() => setShowModal(false)}
          />
          <Button
            type='button'
            label='Add'
            onClick={handleSubmit}
          />
        </div>
      </form>
    </Modal>
  )
}
