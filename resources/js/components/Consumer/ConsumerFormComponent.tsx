import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ConsumerData } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { Address, RegionOption } from '@/interfaces/data_interfaces'
import { useState } from 'react'
import { Card } from '../ui/card'
import ConsumerContactFolioModal from './ConsumerContactFolioModal'

interface Props {
  consumer_types: ParameterValues[]
  districts: RegionOption[]
  states: RegionOption[]
  connection_id: number
  data?: ConsumerData
}

const isSameAddress = (primary?: any, other?: any) => {
  return primary?.address_id === other?.address_id
}

export default function ConsumerFormComponent({
  consumer_types,
  districts,
  states,
  connection_id,
  data,
}: Props) {
  let consumer = null
  let contact = null
  if (data) {
    consumer = data.consumer
    contact = data.contact
  }

  const primary = contact?.primary_address

  const { formData, setFormValue, setAll, toggleBoolean } = useCustomForm({
    // Primary Address
    address_id: primary?.address_id ?? null,
    connection_id: consumer?.connection_id ?? connection_id,
    consumer_type_id: consumer?.consumer_type_id ?? '',
    organization_name: consumer?.organization_name ?? '',
    applicant_code: consumer?.applicant_code ?? '',
    consumer_pan: consumer?.consumer_pan ?? '',
    consumer_tan: consumer?.consumer_tan ?? '',
    consumer_gstin: consumer?.consumer_gstin ?? '',
    income_tax_withholding_ind: consumer?.income_tax_withholding_ind ?? false,
    gst_withholding_ind: consumer?.gst_withholding_ind ?? false,
    consumer_cin: consumer?.consumer_cin ?? '',
    address_line1: primary?.address_line1 ?? '',
    address_line2: primary?.address_line2 ?? '',
    city_town_village: primary?.city_town_village ?? '',
    pincode: primary?.pincode ?? '',
    district_id: primary?.district_id ?? '',
    state_id: primary?.state_id ?? '',
    seasonal_ind: consumer?.seasonal_ind ?? false,
    license_ind: consumer?.license_ind ?? false,
    open_access_ind: consumer?.open_access_ind ?? false,

    // Other addresses
    other_addresses: {
      billing:
        contact?.billing_address && !isSameAddress(primary, contact.billing_address)
          ? contact.billing_address
          : null,
      premises:
        contact?.premises_address && !isSameAddress(primary, contact.premises_address)
          ? contact.premises_address
          : null,
    },

    primary_email: contact?.primary_email ?? '',
    primary_phone: contact?.primary_phone?.toString() ?? '',

    // ✅ NEW: Add array for extra contacts
    contact_folio: contact?.contact_folio ?? [],

    _method: consumer ? 'PUT' : undefined,
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    consumer ? route('consumers.update', consumer.connection_id) : route('consumers.store')
  )

  const [showContactModal, setShowContactModal] = useState(false)

  const setOtherAddress = (type: 'billing' | 'premises', value: any) => {
    setAll({
      other_addresses: {
        ...formData.other_addresses,
        [type]: value,
      },
    })
  }

  const updateOtherAddressField = (type: 'billing' | 'premises', field: string, value: any) => {
    if (!formData.other_addresses[type]) return
    setOtherAddress(type, {
      ...formData.other_addresses[type],
      [field]: value,
    })
  }

  const removeOtherAddress = (type: 'billing' | 'premises') => {
    setOtherAddress(type, null)
  }

  const handleRemoveContact = (index: number) => {
    const updated = formData.contact_folio.filter((_, i) => i !== index)
    setFormValue('contact_folio')(updated)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <form
      className='flex flex-col gap-6'
      onSubmit={handleSubmit}
    >
      {/* Basic Information */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            {consumer_types && (
              <SelectList
                label='Consumer Type'
                list={consumer_types}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('consumer_type_id')}
                value={formData.consumer_type_id}
                required
                error={errors?.consumer_type_id}
              />
            )}
            <Input
              label='Organization Name'
              setValue={setFormValue('organization_name')}
              value={formData.organization_name}
              error={errors?.organization_name}
            />
            <Input
              label='Applicant Code'
              setValue={setFormValue('applicant_code')}
              value={formData.applicant_code}
              error={errors?.applicant_code}
            />
            <Input
              label='Consumer CIN'
              setValue={setFormValue('consumer_cin')}
              value={formData.consumer_cin}
              error={errors?.consumer_cin}
            />
            <Input
              label='Consumer PAN'
              setValue={setFormValue('consumer_pan')}
              value={formData.consumer_pan}
              error={errors?.consumer_pan}
            />
            <Input
              label='Consumer TAN'
              setValue={setFormValue('consumer_tan')}
              value={formData.consumer_tan}
              error={errors?.consumer_tan}
            />
            <Input
              label='Consumer GSTIN'
              setValue={setFormValue('consumer_gstin')}
              value={formData.consumer_gstin}
              error={errors?.consumer_gstin}
            />

            <CheckBox
              label='TDS on GST'
              toggleValue={toggleBoolean('income_tax_withholding_ind')}
              value={formData.income_tax_withholding_ind}
            />
            <CheckBox
              label='TDS on Income Tax'
              toggleValue={toggleBoolean('gst_withholding_ind')}
              value={formData.gst_withholding_ind}
            />
            <CheckBox
              label='Seasonal'
              toggleValue={toggleBoolean('seasonal_ind')}
              value={formData.seasonal_ind}
            />
            <CheckBox
              label='License'
              toggleValue={toggleBoolean('license_ind')}
              value={formData.license_ind}
            />
            <CheckBox
              label='Open Access'
              toggleValue={toggleBoolean('open_access_ind')}
              value={formData.open_access_ind}
            />
          </div>
        </div>
      </Card>

      {/* Primary Address */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Primary Address</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <Input
              label='Address Line1'
              setValue={setFormValue('address_line1')}
              value={formData.address_line1}
              error={errors?.address_line1}
            />
            <Input
              label='Address Line2'
              setValue={setFormValue('address_line2')}
              value={formData.address_line2}
              error={errors?.address_line2}
            />
            <Input
              label='City / Town / Village'
              setValue={setFormValue('city_town_village')}
              value={formData.city_town_village}
              error={errors?.city_town_village}
            />
            <Input
              label='Pincode'
              type='number'
              setValue={setFormValue('pincode')}
              value={formData.pincode}
              error={errors?.pincode}
            />
            {districts && (
              <SelectList
                label='District'
                list={districts}
                dataKey='region_id'
                displayKey='region_name'
                setValue={setFormValue('district_id')}
                value={formData.district_id}
              />
            )}
            {states && (
              <SelectList
                label='State'
                list={states}
                dataKey='region_id'
                displayKey='region_name'
                setValue={setFormValue('state_id')}
                value={formData.state_id}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Contact Information</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <Input
              label='Primary Email'
              type='email'
              setValue={setFormValue('primary_email')}
              value={formData.primary_email}
              error={errors?.primary_email}
            />
            <Input
              label='Primary Phone'
              type='text'
              setValue={setFormValue('primary_phone')}
              value={formData.primary_phone}
              error={errors?.primary_phone}
            />
          </div>

          <div className='flex justify-end px-4'>
            <Button
              type='button'
              label='Add More Contact'
              onClick={() => setShowContactModal(true)}
            />
          </div>

          {/* Show added contacts */}
          {formData.contact_folio.length > 0 && (
            <div className='mt-4 border-t border-gray-200 p-4'>
              <StrongText className='mb-2 block font-medium'>Additional Contacts</StrongText>
              <div className='flex flex-col gap-2'>
                {formData.contact_folio.map((c, i) => (
                  <div
                    key={i}
                    className='flex justify-between rounded border border-gray-200 p-2 text-sm'
                  >
                    <div>
                      <div>
                        <strong>Email:</strong> {c.email || '-'}
                      </div>
                      <div>
                        <strong>Phone:</strong> {c.phone || '-'}
                      </div>
                    </div>
                    <button
                      type='button'
                      className='text-red-500 hover:text-red-700'
                      onClick={() => handleRemoveContact(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal */}
      {showContactModal && (
        <ConsumerContactFolioModal
          setShowModal={setShowContactModal}
          formData={formData}
          setFormValue={setFormValue}
        />
      )}

      <div className='flex justify-end'>
        <Button
          type='submit'
          label='Submit'
        />
      </div>
    </form>
  )
}
