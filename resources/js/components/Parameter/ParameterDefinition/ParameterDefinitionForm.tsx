import { useState } from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition, ParameterDomain } from '@/interfaces/parameter_types'
import CheckBox from '@/ui/form/CheckBox'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'
import AttributeInput from './AttributeInput'
import Button from '@/ui/button/Button'
import SubHeading from '@/typography/SubHeading'
import SelectList from '@/ui/form/SelectList'

interface Props {
  title: string
  setShowModal: (value: boolean) => unknown
  show: boolean
  children?: React.ReactNode
  parameterDefinition?: ParameterDefinition | null
  domains: ParameterDomain[]
}

export default function ParameterDefinitionForm({
  title,
  setShowModal,
  show,
  parameterDefinition,
  domains,
}: Readonly<Props>) {
  const [visibleAttrs, setVisibleAttrs] = useState<boolean[]>(() => {
    const initialVisibility = [
      !!parameterDefinition?.attribute1_name,
      !!parameterDefinition?.attribute2_name,
      !!parameterDefinition?.attribute3_name,
      !!parameterDefinition?.attribute4_name,
      !!parameterDefinition?.attribute5_name,
    ]
    const defaults = [...initialVisibility]
    while (defaults.length < 5) defaults.push(false)
    return defaults
  })

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    parameter_name: parameterDefinition?.parameter_name ?? '',
    domain_id: parameterDefinition?.domain_id ?? '',
    attribute1_name: parameterDefinition?.attribute1_name ?? '',
    attribute2_name: parameterDefinition?.attribute2_name ?? '',
    attribute3_name: parameterDefinition?.attribute3_name ?? '',
    attribute4_name: parameterDefinition?.attribute4_name ?? '',
    attribute5_name: parameterDefinition?.attribute5_name ?? '',
    is_effective_date_driven: parameterDefinition?.is_effective_date_driven ?? false,
  })

  const { post, errors, loading } = useInertiaPost(
    parameterDefinition
      ? route('parameter-definition.update', parameterDefinition.id)
      : route('parameter-definition.store'),
    {
      showErrorToast: true,
      onComplete: () => setShowModal(false),
    }
  )

  const removeAttribute = (index: number) => {
    const updated = [...visibleAttrs]
    updated[index] = false
    setFormValue(`attribute${index + 1}_name`)('')
    setVisibleAttrs(updated)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    parameterDefinition ? post({ ...formData, _method: 'PUT' }) : post(formData)
  }

  // Find the first hidden attribute index
  const firstHiddenIndex = visibleAttrs.findIndex((v) => !v)
  const addAttribute = () => {
    const updated = [...visibleAttrs]
    updated[firstHiddenIndex] = true
    setVisibleAttrs(updated)
  }
  return (
    <div>
      <SubHeading>Parameter Definition</SubHeading>
      <Modal
        title={title}
        setShowModal={setShowModal}
      >
        <form onSubmit={handleSubmit}>
          <div className='md:grid md:grid-cols-2 md:gap-4'>
            <div className='flex flex-col'>
              <Input
                label='Parameter Name'
                setValue={setFormValue('parameter_name')}
                value={formData.parameter_name}
                placeholder='Type your Parameter Name'
                error={errors?.parameter_name}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Domain'
                setValue={setFormValue('domain_id')}
                value={formData.domain_id}
                placeholder='Type your Domain'
                error={errors?.domain_id}
                list={domains}
                dataKey='id'
                displayKey='domain_name'
              />
            </div>

            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className='flex flex-col'
              >
                {visibleAttrs[index] ? (
                  <AttributeInput
                    index={index}
                    visibleAttrs={visibleAttrs}
                    formData={formData}
                    setFormValue={setFormValue}
                    errors={errors}
                    removeAttribute={removeAttribute}
                  />
                ) : firstHiddenIndex === index ? (
                  <div className='mt-6 flex flex-col'>
                    <Button
                      type='button'
                      onClick={addAttribute}
                      variant='outline'
                      label='+ Add Attribute'
                    />
                  </div>
                ) : null}
              </div>
            ))}

            <div className='flex flex-col'>
              <CheckBox
                label='Effective date'
                toggleValue={toggleBoolean('is_effective_date_driven')}
                value={formData.is_effective_date_driven}
                error={errors?.is_effective_date_driven}
              />
            </div>
          </div>

          {/* Submit */}
          <div className='flex justify-end p-4'>
            <Button
              type='submit'
              label={loading ? 'Saving...' : 'Save'}
              disabled={loading}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
