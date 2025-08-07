import capitalSnakeCase from '@/formaters/capitalcase'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import SubHeading from '@/typography/SubHeading'
import Button from '@/ui/button/Button'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import Modal from '@/ui/Modal/Modal'
import { useEffect } from 'react'

export default function ParameterDomainActionModal({
  title,
  setShowModal,
  show,
  initialData,
}: {
  title: string
  setShowModal: (value: boolean) => unknown
  show: boolean
  children?: React.ReactNode
  initialData?: any
}) {
  const { formData, setFormValue } = useCustomForm({
    domain_name: initialData?.domain_name,
    description: initialData?.description,
    domain_code: initialData?.domain_code,
    managed_by_module: initialData?.managed_by_module,
  })
  useEffect(() => {
    if (initialData) {
      setFormValue('domain_name')(initialData?.domain_name)
      setFormValue('description')(initialData?.description)
      setFormValue('domain_code')(initialData?.domain_code)
      setFormValue('managed_by_module')(initialData?.managed_by_module)
    } else {
      setFormValue('domain_name')('')
      setFormValue('description')('')
      setFormValue('domain_code')('')
      setFormValue('managed_by_module')('')
    }
  }, [initialData])
  const { post, errors, loading } = useInertiaPost(
    initialData
      ? route('parameter-domain.update', initialData.id)
      : route('parameter-domain.store'),
    {
      onComplete: () => {
        setShowModal(false)
      },
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    initialData ? post({ ...formData, _method: 'PUT' }) : post(formData)
  }
  console.log(errors)
  return (
    <div>
      <SubHeading>Create Parameter Domain</SubHeading>
      <Modal
        title={title}
        setShowModal={setShowModal}
      >
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-col'>
              <Input
                label='Domain Name'
                value={formData.domain_name}
                setValue={setFormValue('domain_name')}
                error={errors?.domain_name}
              />
            </div>
            <div className='flex flex-col'>
              <TextArea
                label='Description'
                value={formData.description}
                setValue={setFormValue('description')}
                error={errors?.description}
                required
              />
            </div>
            <div className='flex flex-col'>
              <Input
                label='Domain Code'
                value={formData.domain_code}
                setValue={setFormValue('domain_code')}
                error={errors?.domain_code}
                formatter={capitalSnakeCase}
              />
            </div>
            <div className='flex flex-col'>
              <DynamicSelectList
                url={`api/system-modules`}
                dataKey='id'
                displayKey='name'
                setValue={setFormValue('managed_by_module')}
                value={formData.managed_by_module}
                label='Managed By Module'
                error={errors?.managed_by_module}
              />
            </div>
            <div className='flex justify-between'>
              <Button
                label='Cancel'
                onClick={() => setShowModal(false)}
              />
              <Button
                label='Save'
                type='submit'
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
