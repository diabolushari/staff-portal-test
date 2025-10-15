import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Input from '@/ui/form/Input'
import DatePicker from '@/ui/form/DatePicker'
import FileInput from '@/ui/form/FileInput'
import Button from '@/ui/button/Button'
import { TariffOrder } from '@/interfaces/data_interfaces'

interface PageProps {
  tariffOrder: TariffOrder
}
const formatDateForInput = (dateString?: string) => {
  if (!dateString) return ''
  return dateString.split('T')[0]
}
export default function TariffOrderForm({ tariffOrder }: Readonly<PageProps>) {
  const { formData, setFormValue } = useCustomForm({
    tariff_order_id: tariffOrder?.tariff_order_id ?? '',
    order_descriptor: tariffOrder?.order_descriptor ?? '',
    reference_document: tariffOrder?.reference_document ?? '',
    published_date: formatDateForInput(tariffOrder?.published_date) ?? '',
    effective_start: formatDateForInput(tariffOrder?.effective_start) ?? '',
    effective_end: formatDateForInput(tariffOrder?.effective_end) ?? '',
    reference_document_name: '',
    _method: tariffOrder != null ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    tariffOrder
      ? route('tariff-order.update', tariffOrder.tariff_order_id)
      : route('tariff-order.store'),
    {
      showErrorToast: true,
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (tariffOrder && typeof formData.reference_document === 'string') {
      formData.reference_document = null
    }

    post(formData)
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className='flex justify-between border-b-2 border-gray-200 py-4'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-8 p-4 md:grid-cols-2'>
          <Input
            label='Order Descriptor'
            setValue={setFormValue('order_descriptor')}
            value={formData.order_descriptor}
            error={errors?.order_descriptor}
            type='text'
          />
          <FileInput
            label='Reference Document'
            setValue={(file) => {
              setFormValue('reference_document')(file)
              setFormValue('reference_document_name')(file ? file.name : '')
            }}
            file={
              typeof formData.reference_document === 'string'
                ? { name: formData.reference_document, size: 0, type: '' }
                : formData.reference_document
            }
            error={errors?.reference_document}
          />
          <DatePicker
            label='From Date'
            setValue={setFormValue('effective_start')}
            value={formData.effective_start}
            error={errors?.effective_start}
          />
          <DatePicker
            label='To Date'
            setValue={setFormValue('effective_end')}
            value={formData.effective_end}
            error={errors?.effective_end}
          />
          <DatePicker
            label='Published Date'
            setValue={setFormValue('published_date')}
            value={formData.published_date}
            error={errors?.published_date}
          />
        </div>
      </Card>
      <div className='mt-4 flex justify-end'>
        <Button
          type='submit'
          disabled={loading}
          label={loading ? 'Saving...' : 'Save'}
        />
      </div>
    </form>
  )
}
