import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition } from '@/interfaces/paramater_service'
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
  editRow: ParameterDefinition | null
}) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: editRow?.name ?? '',
    attribute1: editRow?.attribute1 ?? '',
    attribute2: editRow?.attribute2 ?? '',
    attribute3: editRow?.attribute3 ?? '',
    attribute4: editRow?.attribute4 ?? '',
    attribute5: editRow?.attribute5 ?? '',
    isEffectiveDateDriven: editRow?.isEffectiveDateDriven ?? false,
    domainId: editRow?.domainId ?? 0,
  })

  // Track which attributes are visible
  const initialVisibility = [
    !!editRow?.attribute1,
    !!editRow?.attribute2,
    !!editRow?.attribute3,
    !!editRow?.attribute4,
    !!editRow?.attribute5,
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
    setFormValue(`attribute${index + 1}`)('')
    setVisibleAttrs(updated)
  }

  const renderAttributeInput = (index: number) => {
    const attrKey = `attribute${index + 1}`
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
                value={formData.name}
                setValue={setFormValue('name')}
                error={errors?.name}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <DynamicSelectList
                url='api/parameter-domains'
                dataKey='id'
                displayKey='name'
                setValue={setFormValue('domainId')}
                value={formData.domainId}
                label='Parameter Domain'
                error={errors?.domainId}
              />
            </div>

            {/* Render dynamic attribute fields */}
            {visibleAttrs.map((visible, index) => visible && renderAttributeInput(index))}

            <div className='flex flex-col'>
              <CheckBox
                label='Is Effective Date Driven'
                value={formData.isEffectiveDateDriven}
                toggleValue={toggleBoolean('isEffectiveDateDriven')}
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
