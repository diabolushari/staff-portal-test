import { Button } from '@/components/ui/button'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { SdAttribute, SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { useEffect, useMemo, useState } from 'react'
import DynamicAttributeForm from '@/ui/form/DynamicAttributeForm'
import CheckBox from '@/ui/form/CheckBox'

interface Props {
  sdDemand: SdDemand
  paymentModes: ParameterValues[]
  collectionStatus: ParameterValues[]
}

const SdCollectionForm = ({ sdDemand, paymentModes, collectionStatus }: Props) => {
  const [selectedCollectionMode, setSelectedCollectionMode] = useState<ParameterValues | null>(null)
  const [isReversed, setIsReversed] = useState<boolean>(false)

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    sd_demand_id: sdDemand.sd_demand_id,
    collection_date: '',
    payment_mode_id: '',
    collection_amount: '',
    receipt_number: '',
    collected_at: '',
    collected_by: '',
    is_active: true,
    reversal_reason: '',
    reversed_date: '',
    reversed_by: '',
    transaction_ref: '',
    remarks: '',
    status_id: '',
  })

  //TODO useEffect has missing dependency of collectionModes
  useEffect(() => {
    if (!formData.payment_mode_id) return setSelectedCollectionMode(null)
    // TODO wrong naming convention
    const selectedCollectionMode = paymentModes.find(
      (mode) => mode.id == Number(formData.payment_mode_id)
    )
    setSelectedCollectionMode(selectedCollectionMode ?? null)
  }, [formData.payment_mode_id, paymentModes])

  useEffect(() => {
    setIsReversed(!formData.is_active)
  }, [formData.is_active])

  const url = route('sd-collections.store')

  const { post, loading, errors } = useInertiaPost<typeof formData>(url, {
    showErrorToast: true,
  })

  useEffect(() => {
    if (formData.payment_mode_id) {
      const selectedCollectionMode = paymentModes.find(
        (mode) => mode.id == Number(formData.payment_mode_id)
      )

      if (selectedCollectionMode) {
        setSelectedCollectionMode(selectedCollectionMode)
      }
    }
  }, [formData.payment_mode_id, paymentModes])

  //TODO should default to empty array
  const [attributeData, setAttributeData] = useState<SdAttribute[] | null>([])

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
    console.log(customFormData)
    post(customFormData)
  }

  console.log(errors)
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
            label='Payment Mode'
            list={paymentModes}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.payment_mode_id}
            setValue={setFormValue('payment_mode_id')}
            error={errors.payment_mode_id}
            required
            placeholder='Select Payment Mode'
          />
          <DynamicAttributeForm
            selectedValue={selectedCollectionMode}
            domainName='Connection'
            parameterName='SD Collection Attribute'
            foreignKeyName='sd_collection_id'
            foreignKeyValue={null}
            attributeData={attributeData}
            setAttributeData={setAttributeData}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
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
          <Input
            label='Collected At'
            value={formData.collected_at}
            setValue={setFormValue('collected_at')}
            error={errors.collected_at}
            placeholder='Collected At'
          />
          <CheckBox
            label='Is Active'
            value={formData.is_active}
            toggleValue={toggleBoolean('is_active')}
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
          <Input
            label='Transaction Ref'
            value={formData.transaction_ref}
            setValue={setFormValue('transaction_ref')}
            error={errors.transaction_ref}
            placeholder='Enter Transaction Ref'
          />
          <Input
            label='Remarks'
            value={formData.remarks}
            setValue={setFormValue('remarks')}
            error={errors.remarks}
            placeholder='Enter Remarks'
          />
          <SelectList
            label='Status'
            list={collectionStatus}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.status_id}
            setValue={setFormValue('status_id')}
            error={errors.status_id}
            required
            placeholder='Select Status'
          />
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
