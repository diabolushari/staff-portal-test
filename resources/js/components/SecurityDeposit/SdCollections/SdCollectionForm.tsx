import { Button } from '@/components/ui/button'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { SdAttribute, SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { useEffect, useMemo, useState } from 'react'
import SdAttributeForm from './SdAttributeForm'
import DynamicAttributeForm from '@/ui/form/DynamicAttributeForm'

interface Props {
  sdDemand: SdDemand
  collectionModes: ParameterValues[]
}

const SdCollectionForm = ({ sdDemand, collectionModes }: Props) => {
  const [selectedCollectionMode, setSelectedCollectionMode] = useState<ParameterValues | null>(null)

  const { formData, setFormValue } = useCustomForm({
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

  //TODO useEffect has missing dependency of collectionModes
  useEffect(() => {
    if (!formData.collection_mode_id) return setSelectedCollectionMode(null)
    // TODO wrong naming convention
    const CollectionMode = collectionModes.find(
      (mode) => mode.id == Number(formData.collection_mode_id)
    )
    setSelectedCollectionMode(CollectionMode ?? null)
  }, [formData.collection_mode_id])

  const url = route('sd-collections.store')

  const { post, loading, errors } = useInertiaPost<typeof formData>(url, {
    showErrorToast: true,
  })

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

  const isReversed = false

  //TODO should default to empty array
  const [attributeData, setAttributeData] = useState<SdAttribute[] | null>(null)

  const customFormData = useMemo(() => {
    return {
      ...formData,
      attributeData: attributeData?.map((item) => {
        return {
          attribute_definition_id: item.attribute_definition_id,
          attribute_value: item.attribute_value,
          file: item.file,
        }
      }),
    }
  }, [attributeData, formData])

  console.log(customFormData)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(customFormData)
  }

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
        </div>
        <DynamicAttributeForm
          selectedValue={selectedCollectionMode}
          domainName='Connection'
          parameterName='SD Collection Attribute'
          foreignKeyName='sd_collection_id'
          foreignKeyValue={null}
          attributeData={attributeData}
          setAttributeData={setAttributeData}
        />

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
