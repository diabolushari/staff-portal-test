import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import Input from '@/ui/form/Input'
import useCustomForm from '@/hooks/useCustomForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import SelectList from '@/ui/form/SelectList'
import CheckBox from '@/ui/form/CheckBox'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Address, ConsumerData, RegionOption } from '@/interfaces/data_interfaces'

interface Props {
  consumer_types: ParameterValues[]
  districts: RegionOption[]
  states: RegionOption[]
  connection_id: number
  data?: ConsumerData
}

// 🔹 Helper to compare two addresses
const isSameAddress = (primary?: Address, other?: Address) => {
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
    _method: consumer ? 'PUT' : undefined,
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    consumer ? route('consumers.update', consumer.connection_id) : route('consumers.store')
  )

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
            <Input
              label='Organization Name'
              setValue={setFormValue('organization_name')}
              value={formData.organization_name}
              placeholder='Enter organization name'
              error={errors?.organization_name}
            />
            <Input
              label='Applicant Code'
              setValue={setFormValue('applicant_code')}
              value={formData.applicant_code}
              placeholder='Enter applicant code'
              error={errors?.applicant_code}
            />
            <Input
              label='Consumer PAN'
              setValue={setFormValue('consumer_pan')}
              value={formData.consumer_pan}
              placeholder='e.g., ABCDE1234F'
              error={errors?.consumer_pan}
            />
            <Input
              label='Consumer TAN'
              setValue={setFormValue('consumer_tan')}
              value={formData.consumer_tan}
              placeholder='e.g., ABCD12345E'
              error={errors?.consumer_tan}
            />
            <Input
              label='Consumer GSTIN'
              setValue={setFormValue('consumer_gstin')}
              value={formData.consumer_gstin}
              placeholder='e.g., 27ABCDE1234F1Z5'
              error={errors?.consumer_gstin}
            />
            <Input
              label='Consumer CIN'
              setValue={setFormValue('consumer_cin')}
              value={formData.consumer_cin}
              error={errors?.consumer_cin}
            />
            <CheckBox
              label='TDS on GST'
              toggleValue={toggleBoolean('income_tax_withholding_ind')}
              value={formData.income_tax_withholding_ind}
              error={errors?.income_tax_withholding_ind}
            />
            <CheckBox
              label='TDS on Income Tax'
              toggleValue={toggleBoolean('gst_withholding_ind')}
              value={formData.gst_withholding_ind}
              error={errors?.gst_withholding_ind}
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
              type='text'
              setValue={setFormValue('address_line1')}
              value={formData.address_line1}
              error={errors?.address_line1}
            />
            <Input
              label='Address Line2'
              type='text'
              setValue={setFormValue('address_line2')}
              value={formData.address_line2}
              error={errors?.address_line2}
            />
            <Input
              label='City / Town / Village'
              type='text'
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
                error={errors?.district_id}
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
                error={errors?.state_id}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Add Other Addresses Buttons */}
      <div className='flex gap-4'>
        {!formData.other_addresses.billing && (
          <Button
            type='button'
            label='Add Billing Address'
            onClick={() =>
              setOtherAddress('billing', {
                address_id: null,
                address_line1: '',
                address_line2: '',
                city_town_village: '',
                pincode: '',
                district_id: '',
                state_id: '',
              })
            }
          />
        )}
        {!formData.other_addresses.premises && (
          <Button
            type='button'
            label='Add Premises Address'
            onClick={() =>
              setOtherAddress('premises', {
                address_id: null,
                address_line1: '',
                address_line2: '',
                city_town_village: '',
                pincode: '',
                district_id: '',
                state_id: '',
              })
            }
          />
        )}
      </div>

      {/* Billing Address */}
      {formData.other_addresses.billing && (
        <Card>
          <div className='mb-2 flex items-center justify-between border-b-2 border-gray-200 pb-2'>
            <StrongText className='text-base font-semibold'>Billing Address</StrongText>
            <button
              type='button'
              className='rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600'
              onClick={() => removeOtherAddress('billing')}
            >
              Remove
            </button>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Input
              label='Address Line1'
              type='text'
              value={formData.other_addresses.billing.address_line1}
              setValue={(val) => updateOtherAddressField('billing', 'address_line1', val)}
              required
            />
            <Input
              label='Address Line2'
              type='text'
              value={formData.other_addresses.billing.address_line2}
              setValue={(val) => updateOtherAddressField('billing', 'address_line2', val)}
              required
            />
            <Input
              label='City / Town / Village'
              type='text'
              value={formData.other_addresses.billing.city_town_village}
              setValue={(val) => updateOtherAddressField('billing', 'city_town_village', val)}
              required
            />
            <Input
              label='Pincode'
              type='number'
              value={formData.other_addresses.billing.pincode}
              setValue={(val) => updateOtherAddressField('billing', 'pincode', val)}
              required
            />
            {districts && (
              <SelectList
                label='District'
                list={districts}
                dataKey='region_id'
                displayKey='region_name'
                setValue={(val) => updateOtherAddressField('billing', 'district_id', val)}
                value={formData.other_addresses.billing.district_id}
                required
              />
            )}
            {states && (
              <SelectList
                label='State'
                list={states}
                dataKey='region_id'
                displayKey='region_name'
                setValue={(val) => updateOtherAddressField('billing', 'state_id', val)}
                value={formData.other_addresses.billing.state_id}
                required
              />
            )}
          </div>
        </Card>
      )}

      {/* Premises Address */}
      {formData.other_addresses.premises && (
        <Card>
          <div className='mb-2 flex items-center justify-between border-b-2 border-gray-200 pb-2'>
            <StrongText className='text-base font-semibold'>Premises Address</StrongText>
            <button
              type='button'
              className='rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600'
              onClick={() => removeOtherAddress('premises')}
            >
              Remove
            </button>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Input
              label='Address Line1'
              type='text'
              value={formData.other_addresses.premises.address_line1}
              setValue={(val) => updateOtherAddressField('premises', 'address_line1', val)}
              required
            />
            <Input
              label='Address Line2'
              type='text'
              value={formData.other_addresses.premises.address_line2}
              setValue={(val) => updateOtherAddressField('premises', 'address_line2', val)}
              required
            />
            <Input
              label='City / Town / Village'
              type='text'
              value={formData.other_addresses.premises.city_town_village}
              setValue={(val) => updateOtherAddressField('premises', 'city_town_village', val)}
              required
            />
            <Input
              label='Pincode'
              type='number'
              value={formData.other_addresses.premises.pincode}
              setValue={(val) => updateOtherAddressField('premises', 'pincode', val)}
              required
            />
            {districts && (
              <SelectList
                label='District'
                list={districts}
                dataKey='region_id'
                displayKey='region_name'
                setValue={(val) => updateOtherAddressField('premises', 'district_id', val)}
                value={formData.other_addresses.premises.district_id}
                required
              />
            )}
            {states && (
              <SelectList
                label='State'
                list={states}
                dataKey='region_id'
                displayKey='region_name'
                setValue={(val) => updateOtherAddressField('premises', 'state_id', val)}
                value={formData.other_addresses.premises.state_id}
                required
              />
            )}
          </div>
        </Card>
      )}

      {/* Contact */}
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
        </div>
      </Card>
      <div className='flex justify-end'>
        <Button
          type='submit'
          label='Submit'
        />
      </div>
    </form>
  )
}
