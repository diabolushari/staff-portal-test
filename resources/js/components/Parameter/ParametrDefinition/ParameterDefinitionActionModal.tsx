import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'
import { useState } from 'react'

export default function ParameterDefinitionActionModal({
  show,
  onClose,
  editRow,
}: {
  show: boolean
  onClose: () => void
  editRow: any
}) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    parameter_name: editRow?.parameter_name || '',
    attribute1_name: editRow?.attribute1_name || '',
    attribute2_name: editRow?.attribute2_name || '',
    attribute3_name: editRow?.attribute3_name || '',
    attribute4_name: editRow?.attribute4_name || '',
    attribute5_name: editRow?.attribute5_name || '',
    is_effective_date_driven: editRow?.is_effective_date_driven || false,
    domain_id: editRow?.domain_id || 0,
  })

  // Track which attributes are visible
  const initialVisibility = [
    !!editRow?.attribute1_name,
    !!editRow?.attribute2_name,
    !!editRow?.attribute3_name,
    !!editRow?.attribute4_name,
    !!editRow?.attribute5_name,
  ]
  const [visibleAttrs, setVisibleAttrs] = useState<boolean[]>(() => {
    const defaults = [...initialVisibility]
    while (defaults.length < 5) defaults.push(false)
    return defaults
  })

  const { post, errors } = useInertiaPost(
    editRow
      ? route('parameter-definition.update', editRow.id)
      : route('parameter-definition.store'),
    {
      onComplete: () => onClose(),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(editRow ? { ...formData, _method: 'PUT' } : formData)
  }

  const addAttribute = () => {
    const nextIndex = visibleAttrs.findIndex((v) => !v)
    if (nextIndex !== -1) {
      const updated = [...visibleAttrs]
      updated[nextIndex] = true
      setVisibleAttrs(updated)
    }
  }

  const removeAttribute = (index: number) => {
    const updated = [...visibleAttrs]
    updated[index] = false
    // Also clear the value from formData
    setFormValue(`attribute${index + 1}_name`)('')
    setVisibleAttrs(updated)
  }

  const renderAttributeInput = (index: number) => {
    const attrKey = `attribute${index + 1}_name`
    if (!visibleAttrs[index]) return null

    return (
      <div
        key={attrKey}
        className='relative flex flex-col'
      >
        <Input
          label={`Attribute ${index + 1} Name`}
          value={formData[attrKey]}
          setValue={setFormValue(attrKey)}
          error={errors?.[attrKey]}
        />
        <button
          type='button'
          onClick={() => removeAttribute(index)}
          className='absolute top-2 right-2 font-bold text-red-500'
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <Modal
      title='Edit Parameter Definition'
      setShowModal={onClose}
    >
      <div className='p-4'>
        <form onSubmit={handleSubmit}>
          <div className='flex gap-6 md:grid md:grid-cols-2'>
            <div className='flex flex-col'>
              <Input
                label='Parameter Name'
                value={formData.parameter_name}
                setValue={setFormValue('parameter_name')}
                error={errors?.parameter_name}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <DynamicSelectList
                url='api/parameter-domains'
                dataKey='id'
                displayKey='name'
                setValue={setFormValue('domain_id')}
                value={formData.domain_id}
                label='Parameter Domain'
                error={errors?.domain_id}
              />
            </div>

            {/* Render dynamic attribute fields */}
            {visibleAttrs.map((visible, index) => visible && renderAttributeInput(index))}

            <div className='flex flex-col'>
              <CheckBox
                label='Is Effective Date Driven'
                value={formData.is_effective_date_driven}
                toggleValue={toggleBoolean('is_effective_date_driven')}
              />
            </div>

            {/* Add Attribute Button */}
            {visibleAttrs.filter(Boolean).length < 5 && (
              <div className='col-span-2 mt-2 flex flex-col'>
                <Button
                  type='button'
                  onClick={addAttribute}
                  variant='outline'
                  label='Add Attribute'
                />
              </div>
            )}
          </div>

          <div className='mt-4 flex justify-between gap-2'>
            <Button
              type='button'
              onClick={onClose}
              variant='outline'
              label='Cancel'
            />
            <Button
              type='submit'
              label='Save'
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}
