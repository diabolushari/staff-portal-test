import ViewParameterDetail from '@/components/Parameter/ViewParameterDetails'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { settingsReferenceData } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Parameter Values',
    href: '/parameter-value',
  },
]

export default function ParameterValueShow({
  parameter_value,
}: {
  parameter_value: ParameterValues
}) {
  const allFields = [
    { label: 'Id', key: 'id' },
    { label: 'Parameter Code', key: 'parameter_code' },
    { label: 'Parameter Value', key: 'parameter_value' },
    { label: 'Attribute 1 Value', key: 'attribute_1_value' },
    { label: 'Attribute 2 Value', key: 'attribute_2_value' },
    { label: 'Attribute 3 Value', key: 'attribute_3_value' },
    { label: 'Attribute 4 Value', key: 'attribute_4_value' },
    { label: 'Attribute 5 Value', key: 'attribute_5_value' },
    { label: 'Effective Start Date', key: 'effective_start_date' },
    { label: 'Effective End Date', key: 'effective_end_date' },
    { label: 'Sort Priority', key: 'sort_priority' },
    { label: 'Notes', key: 'notes' },
  ]

  const filteredFields = allFields.filter((field) => {
    const isAttributeField = field.key.startsWith('attribute')
    const value = parameter_value?.[field.key as keyof ParameterValues]
    if (isAttributeField) {
      return value !== null && value !== undefined && value.toString().trim() !== ''
    }
    return true
  })
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={settingsReferenceData}
    >
      <ViewParameterDetail
        title='Parameter Value Details'
        data={parameter_value}
        fields={filteredFields}
      />
    </MainLayout>
  )
}
