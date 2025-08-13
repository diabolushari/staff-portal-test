import ViewParameterDetail from '@/components/Parameter/ViewParameterDetails'
import { ParameterValues } from '@/interfaces/paramater_service'
import AppLayout from '@/layouts/app-layout'

export default function ParameterValueShow({ data }: { data: ParameterValues }) {
  const allFields = [
    { label: 'Parameter Code', key: 'parameterCode' },
    { label: 'Parameter Value', key: 'parameterValue' },
    { label: 'Attribute 1 Value', key: 'attribute1Value' },
    { label: 'Attribute 2 Value', key: 'attribute2Value' },
    { label: 'Attribute 3 Value', key: 'attribute3Value' },
    { label: 'Attribute 4 Value', key: 'attribute4Value' },
    { label: 'Attribute 5 Value', key: 'attribute5Value' },
    { label: 'Effective Start Date', key: 'effectiveStartDate' },
    { label: 'Effective End Date', key: 'effectiveEndDate' },
    { label: 'Sort Priority', key: 'sortPriority' },
    { label: 'Notes', key: 'notes' },
  ]

  const filteredFields = allFields.filter((field) => {
    const isAttributeField = field.key.startsWith('attribute')
    const value = data?.[field.key as keyof ParameterValues]
    if (isAttributeField) {
      return value !== null && value !== undefined && value.toString().trim() !== ''
    }
    return true // always include non-attribute fields
  })

  return (
    <AppLayout>
      <ViewParameterDetail
        title='Parameter Value Details'
        data={data}
        fields={filteredFields}
      />
    </AppLayout>
  )
}
