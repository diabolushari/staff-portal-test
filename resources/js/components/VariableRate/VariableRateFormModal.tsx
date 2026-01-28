import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { VariableRate } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import ComboBox from '@/ui/form/ComboBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'
import { useEffect, useState } from 'react'

interface PageProps {
  setShowModal: (showModal: boolean) => void
  switchForm: (showForm: boolean) => void
  rate?: VariableRate | null
}

export default function VariableRateFormModal({ setShowModal, switchForm, rate }: PageProps) {
  const { formData, setFormValue } = useCustomForm({
    id: rate?.id ?? '',
    variable_name_id: rate?.variable_name_id ?? '',
    rate: rate?.rate ?? '',
    effective_start: rate?.effective_start ?? '',
    effective_end: rate?.effective_end ?? '',
    _method: rate ? 'put' : 'post',
  })
  const { post, loading, errors } = useInertiaPost<typeof formData>(
    rate ? route('variable-rates.update', rate.id) : route('variable-rates.store'),
    {
      onComplete: () => {
        setShowModal(false)
      },
    }
  )

  const [selectedVariableRate, setSelectedVariableRate] = useState<ParameterValues | null>(
    rate?.variable_name ?? null
  )

  useEffect(() => {
    if (selectedVariableRate) {
      setFormValue('variable_name_id')(selectedVariableRate?.id.toString() ?? '')
    }
  }, [selectedVariableRate, setFormValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title='Configure Variable Rate'
    >
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4'>
          <ComboBox
            label='Variable Rate'
            value={selectedVariableRate}
            setValue={setSelectedVariableRate}
            placeholder='Search Variable Rate'
            dataKey='id'
            displayKey='parameter_value'
            displayValue2='parameter_code'
            url='/api/parameter-values?domain_name=Billing&parameter_name=Variable Rate&attribute_value='
            error={errors.variable_name_id}
          />
          <div className='flex justify-end'>
            <Button
              label='Add Variable Name'
              variant='link'
              onClick={() => switchForm(false)}
            />
          </div>
          <Input
            label='Variable Rate'
            value={formData.rate}
            setValue={setFormValue('rate')}
            error={errors.rate}
          />
          <DatePicker
            label='From'
            value={formData.effective_start}
            setValue={setFormValue('effective_start')}
            error={errors.effective_start}
          />
          <DatePicker
            label='To'
            value={formData.effective_end}
            setValue={setFormValue('effective_end')}
            error={errors.effective_end}
          />
        </div>
        <div className='mt-4 flex justify-between gap-2'>
          <Button
            label='Cancel'
            variant='secondary'
            onClick={() => setShowModal(false)}
            disabled={loading}
          />

          <Button
            label='Save'
            type='submit'
            disabled={loading}
            variant={loading ? 'disabled' : 'primary'}
            processing={loading}
          />
        </div>
      </form>
    </Modal>
  )
}
