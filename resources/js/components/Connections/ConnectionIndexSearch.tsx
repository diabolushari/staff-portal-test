import StrongText from '@/typography/StrongText'
import Input from '@/ui/form/Input'
import { router } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import { Office, OfficeWithHierarchy } from '@/interfaces/data_interfaces'
import { useEffect, useState } from 'react'
import ComboBox from '@/ui/form/ComboBox'

interface Props {
  oldConsumerNumber?: string
  oldOffice?: OfficeWithHierarchy
}

const ConnectionIndexSearch = ({ oldConsumerNumber, oldOffice }: Readonly<Props>) => {
  const { formData, setFormValue } = useCustomForm({
    consumer_number: oldConsumerNumber ?? '',
    office_code: oldOffice?.office_code ?? '',
  })
  console.log(oldOffice)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get(route('connections.index'), formData)
  }
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(oldOffice?.office ?? null)
  useEffect(() => {
    if (selectedOffice) {
      setFormValue('office_code')(selectedOffice?.office_code ?? '')
    } else if (!selectedOffice) {
      setFormValue('office_code')('')
    }
  }, [selectedOffice, setFormValue])

  return (
    <div className='relative flex flex-col items-center bg-white p-6 shadow-sm'>
      <div className='absolute top-0 left-6 size-18 h-2/3 w-1/4 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%'></div>
      <div className='flex w-full flex-col justify-center p-10'>
        <div className='mr-10 mb-4 flex items-center justify-center'>
          <StrongText className='text-2xl font-semibold'>Connections Search</StrongText>
        </div>
        <div className='flex w-full items-center justify-center'>
          <form
            action=''
            className='w-2/3'
            onSubmit={handleSubmit}
          >
            <div className='grid grid-cols-3 items-end gap-3'>
              <Input
                label='Consumer Number'
                setValue={setFormValue('consumer_number')}
                value={formData.consumer_number}
                showClearButton={true}
                placeholder='Search by consumer number'
                className='w-full'
              />

              <ComboBox
                label='Office'
                url={`/api/offices?q=`}
                setValue={setSelectedOffice}
                value={selectedOffice}
                dataKey='office_code'
                displayKey='office_name'
                displayValue2='office_code'
                placeholder='Search by Office'
                className='w-full'
              />
              <div className='flex w-1/4 items-center justify-center'>
                <Button
                  label='Search'
                  type='submit'
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='h-half absolute right-0 bottom-0 size-18 w-1/12 rounded-tl-full bg-radial-[at_1%_1%] from-[#0078D4]/30 to-[#0078D4]/5 to-90%'></div>
    </div>
  )
}

export default ConnectionIndexSearch
