import capitalSnakeCase from '@/formaters/capitalcase'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDomain } from '@/interfaces/paramater_service'
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
  initialData,
}: {
  title: string
  setShowModal: (value: boolean) => unknown
  initialData?: ParameterDomain | null
}) {
  const { formData, setFormValue } = useCustomForm({
    domainName: initialData?.domainName,
    description: initialData?.description,
    domainCode: initialData?.domainCode,
    managedByModule: initialData?.managedByModule,
  })
  useEffect(() => {
    if (initialData) {
      setFormValue('domainName')(initialData?.domainName)
      setFormValue('description')(initialData?.description)
      setFormValue('domainCode')(initialData?.domainCode)
      setFormValue('managedByModule')(initialData?.managedByModule)
    } else {
      setFormValue('domainName')('')
      setFormValue('description')('')
      setFormValue('domainCode')('')
      setFormValue('managedByModule')(0)
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
      <SubHeading>{title}</SubHeading>
      <Modal
        title={title}
        setShowModal={setShowModal}
      >
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-col'>
              <Input
                label='Domain Name'
                value={formData.domainName}
                setValue={setFormValue('domainName')}
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
                value={formData.domainCode}
                setValue={setFormValue('domainCode')}
                error={errors?.domain_code}
                formatter={capitalSnakeCase}
              />
            </div>
            <div className='flex flex-col'>
              <DynamicSelectList
                url={`api/system-modules`}
                dataKey='id'
                displayKey='name'
                setValue={setFormValue('managedByModule')}
                value={formData.managedByModule}
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
