import { Button } from '@/components/ui/button'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import CheckBox from '@/ui/form/CheckBox'
import Datepicker from '@/ui/form/DatePicker'
import FileInput from '@/ui/form/FileInput'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { useEffect, useState } from 'react'

interface Props {
  sdDemand: SdDemand
  collectionModes: ParameterValues[]
  attributeDefinitions: ParameterValues[]
}

const SdCollectionForm = ({ sdDemand, collectionModes, attributeDefinitions }: Props) => {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    sd_demand_id: sdDemand.sd_demand_id,
    collection_date: '',
    collection_mode_id: '',
    collection_amount: '',
    receipt_number: '',
    collected_at: '',
    collected_by: '',
    reversal_reason: '',
    reversed_date: '',
    reversed_by: '',
    attribute_definition_id: '',
    attribute_value: '',
    is_verified: false,
    verified_date: '',
    expiry_date: '',
    document_path: null,
    document_name: '',
  })

  const url = route('sd-collections.store')

  const { post, loading, errors } = useInertiaPost<typeof formData>(url, {
    showErrorToast: true,
  })
  const [selectedCollectionMode, setSelectedCollectionMode] = useState<ParameterValues | null>(null)

  useEffect(() => {
    if (formData.collection_mode_id) {
      const selected = collectionModes.find(
        (mode) => mode.id == Number(formData.collection_mode_id)
      )

      if (selected) {
        setSelectedCollectionMode(selected)
      }
    }
  }, [formData.collection_mode_id, collectionModes])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const isReversed = false

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-4'>
          <Datepicker
            label='Collection Date'
            value={formData.collection_date}
            setValue={setFormValue('collection_date')}
            error={errors.collection_date}
            placeholder='Select Collection Date'
            required
          />

          <SelectList
            label='Collection Mode'
            list={collectionModes}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.collection_mode_id}
            setValue={setFormValue('collection_mode_id')}
            error={errors.collection_mode_id}
            required
            placeholder='Select Collection Mode'
          />

          <Input
            type='number'
            label='Collection Amount'
            value={formData.collection_amount}
            setValue={setFormValue('collection_amount')}
            error={errors.collection_amount}
            required
            placeholder='Enter Amount'
          />

          <Input
            label='Receipt Number'
            value={formData.receipt_number}
            setValue={setFormValue('receipt_number')}
            error={errors.receipt_number}
            placeholder='Enter Receipt Number'
          />

          <Input
            label='Collected By'
            value={formData.collected_by}
            setValue={setFormValue('collected_by')}
            error={errors.collected_by}
            placeholder='Collected By'
          />
          {isReversed && (
            <>
              <Input
                label='Reversal Reason'
                value={formData.reversal_reason}
                setValue={setFormValue('reversal_reason')}
                error={errors.reversal_reason}
                placeholder='Reason (if reversed)'
              />

              <Datepicker
                label='Reversed Date'
                value={formData.reversed_date}
                setValue={setFormValue('reversed_date')}
                error={errors.reversed_date}
                placeholder='Select Reversed Date'
              />

              <Input
                label='Reversed By'
                value={formData.reversed_by}
                setValue={setFormValue('reversed_by')}
                error={errors.reversed_by}
                placeholder='Reversed By'
              />
            </>
          )}
          {selectedCollectionMode?.parameter_value.toLowerCase() !== 'cash' &&
            formData.collection_mode_id && (
              <>
                <SelectList
                  label='Attribute Definition'
                  list={attributeDefinitions}
                  dataKey='id'
                  displayKey='parameter_value'
                  value={formData.attribute_definition_id}
                  setValue={setFormValue('attribute_definition_id')}
                  error={errors.attribute_definition_id}
                  placeholder='Select Attribute Definition'
                  required
                />

                <Input
                  label='Attribute Value'
                  value={formData.attribute_value}
                  setValue={setFormValue('attribute_value')}
                  error={errors.attribute_value}
                  required
                />

                <CheckBox
                  label='Is Verified'
                  value={formData.is_verified}
                  toggleValue={toggleBoolean('is_verified')}
                  error={errors.is_verified}
                />

                <Datepicker
                  label='Verified Date'
                  value={formData.verified_date}
                  setValue={setFormValue('verified_date')}
                  error={errors.verified_date}
                  placeholder='Select Verified Date'
                />

                <Datepicker
                  label='Expiry Date'
                  value={formData.expiry_date}
                  setValue={setFormValue('expiry_date')}
                  error={errors.expiry_date}
                  placeholder='Select Expiry Date'
                />

                <FileInput
                  label='Document'
                  setValue={(file) => {
                    setFormValue('document_path')(file)
                    setFormValue('document_name')(file ? file.name : '')
                  }}
                  file={
                    typeof formData.document_path === 'string'
                      ? { name: formData.document_path, size: 0, type: '' }
                      : formData.document_path
                  }
                  error={errors.document_path}
                />
              </>
            )}
        </div>

        <div className='flex justify-end'>
          <Button
            variant={'default'}
            type='submit'
            disabled={loading}
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SdCollectionForm
