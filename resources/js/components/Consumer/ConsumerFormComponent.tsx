import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import Input from '@/ui/form/Input'
import useCustomForm from '@/hooks/useCustomForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import SelectList from '@/ui/form/SelectList'
import { c } from 'node_modules/framer-motion/dist/types.d-Bq-Qm38R'
import CheckBox from '@/ui/form/CheckBox'

// interface Address {
//   address_id: number
//   address_line1: string
//   city?: string
// }
// interface GeoRegion {
//   region_id: number
//   name: string
// }

interface Props {
  consumer_types: ParameterValues[]
  // consumer_addresses: Address[]
  // districts: GeoRegion[]
  // states: GeoRegion[]
}

export default function ConsumerFormComponent({ consumer_types,}: Props) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    connection_id: '',
    consumer_type_id: '',
    organisation_name: '',
    applicant_code: '',
    consumer_pan: '',
    consumer_tan: '',
    consumer_gstin: '',
    income_tax_withholding_ind: false,
    gst_withholding_ind: false,
    primary_address_id:'',
    billing_address_id:'',
    premises_address_id:'',
    primary_email:'',
    primary_phone:'',
    address_line1:'',
    address_line2:'',
    city_town_village:'',
    pincode:'',
    district_id:'',
  })
  return (
    <form className='flex flex-col gap-6'>
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <Input
              label='Connection id'
              setValue={() => {}}
              value=''
              disabled
              style='disabled'
            />
            <SelectList
              label='Consumer Type'
              list={consumer_types}
              dataKey='id'
              displayKey='parameter_value'
              setValue={setFormValue('consumer_type_id')}
              value={formData.consumer_type_id}
              required
            />
            <Input
              label='Organisation Name'
               setValue={setFormValue('organisation_name')}
              value={formData.organisation_name}  
              placeholder='Enter organisation name' 
            />
            <Input
              label='Applicant Code'
               setValue={setFormValue('applicant_code')}
              value={formData.applicant_code}  
              placeholder='Enter applicant code' 
            />
            <Input
              label='Consumer PAN'
               setValue={setFormValue('consumer_pan')}
              value={formData.consumer_pan}  
              placeholder='e.g., ABCDE1234F' 
            />
            <Input
              label="Consumer TAN"
              setValue={setFormValue('consumer_tan')}
              value={formData.consumer_tan}
              placeholder="e.g., ABCD12345E"
            />
            <Input
              label="Consumer GSTIN"
              setValue={setFormValue('consumer_gstin')}
              value={formData.consumer_gstin}
              placeholder="e.g., 27ABCDE1234F1Z5"
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
            

          </div>
          

        </div>
      </Card>

       <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Address Details</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
           <Input
              label='Address Line1'
               setValue={setFormValue('address_line1')}
              value={formData.address_line1}  
              placeholder='Enter Address Line' 
              required
            />
             <Input
              label='Address Line2'
               setValue={setFormValue('address_line2')}
              value={formData.address_line2}  
              placeholder='Enter Address Line'
            />
            <Input
              label="City / Town / Village"
              setValue={setFormValue('city_town_village')}
              value={formData.city_town_village}
              placeholder="Enter City / Town / Village"
              required
            />

            <Input
              label="Pincode"
              setValue={setFormValue('pincode')}
              value={formData.pincode}
              placeholder="Enter Pincode"
              required
              type="number"
            />
            {/* <SelectList
              label="District"
              list={districts}               
              dataKey="region_id"
              displayKey="name"
              setValue={setFormValue('district_id')}
              value={formData.district_id}
            /> */}
          
          </div>
          

        </div>
      </Card>

      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Contact Information</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <Input
              label='Connection id'
              setValue={() => {}}
              value=''
              disabled
              style='disabled'
            />
           {/* <SelectList
            label="Primary Address"
            list={consumer_addresses}   
            dataKey="address_id"                
            displayKey="address_line1"  
            setValue={setFormValue('primary_address_id')}
            value={formData.primary_address_id}
            required
          />
          <SelectList
            label="Billing Address"
            list={consumer_addresses}   
            dataKey="address_id"                
            displayKey="address_line1"  
            setValue={setFormValue('billing_address_id')}
            value={formData.billing_address_id}
            required
          />

          <SelectList
            label="Premises Address"
            list={consumer_addresses}
            dataKey="address_id"
            displayKey="address_line1"
            setValue={setFormValue('premises_address_id')}
            value={formData.premises_address_id}
            required
          /> */}
           <Input
            label="Primary Email"
            type="email"
            setValue={setFormValue('primary_email')}
            value={formData.primary_email}  
            placeholder="Enter primary email"
          />
          <Input
            label="Primary Phone"
            setValue={setFormValue('primary_phone')}
            value={formData.primary_phone}
            placeholder="Enter primary phone"
          />
          </div>
          

        </div>
      </Card>
    </form>
  )
}
