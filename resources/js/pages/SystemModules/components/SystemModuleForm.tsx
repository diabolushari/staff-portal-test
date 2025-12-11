import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { SystemModule } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import React, { useCallback, useEffect } from 'react'
import { route } from 'ziggy-js'

interface Props {
  selectedSystemModule?: SystemModule | null
  onSuccess?: () => void
  onCancel?: () => void
}

export default function SystemModuleForm({
  selectedSystemModule,
  onSuccess,
  onCancel,
}: Readonly<Props>) {
  const isEditing = selectedSystemModule != null

  const { formData, setFormValue } = useCustomForm({
    system_module_name: '',
  })

  const handleComplete = useCallback(() => {
    setFormValue('system_module_name')('')
    onSuccess?.()
  }, [onSuccess, setFormValue])

  const { post, errors, loading } = useInertiaPost(
    isEditing
      ? route('system-module.update', selectedSystemModule.id)
      : route('system-module.store'),
    {
      onComplete: handleComplete,
    }
  )

  // Set form data when editing
  useEffect(() => {
    if (selectedSystemModule) {
      setFormValue('system_module_name')(selectedSystemModule.name)
    } else {
      setFormValue('system_module_name')('')
    }
  }, [selectedSystemModule, setFormValue])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEditing) {
      post({ ...formData, _method: 'PUT' })
    } else {
      post(formData)
    }
  }

  return (
    <div className='p-4'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4'>
          <Input
            label={isEditing ? 'Edit System Module Name' : 'Create System Module'}
            setValue={setFormValue('system_module_name')}
            value={formData.system_module_name}
            placeholder={isEditing ? '' : 'Type your System Module Name'}
            error={(errors as Record<string, string>)?.system_module_name}
            type='text'
            required
          />
        </div>
        <div className='mt-6 flex justify-end gap-3'>
          {onCancel && (
            <Button
              type='button'
              label='Cancel'
              variant='secondary'
              onClick={onCancel}
            />
          )}
          <Button
            type='submit'
            label={isEditing ? 'Update' : 'Create'}
            processing={loading}
          />
        </div>
      </form>
    </div>
  )
}
