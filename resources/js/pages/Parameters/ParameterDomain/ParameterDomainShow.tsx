import ViewParameterDetails from '@/components/Parameter/ViewParameterDetails' // adjust path
import { ParameterDomain } from '@/interfaces/paramater_types'
import AppLayout from '@/layouts/app-layout'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'

export default function ParameterDomainShow({ domain }: { domain: ParameterDomain }) {
  const fields = [
    { label: 'Domain Name', key: 'domainName' },
    { label: 'Description', key: 'description' },
    { label: 'Domain Code', key: 'domainCode' },
    { label: 'Managed By Module', key: 'managedByModuleName' },
  ]
  console.log(domain)

  return (
    <AppLayout>
      <CardHeader
        title='Parameter Domain'
        subheading='Parameter Domain Details'
      />
      <Card className='p-4'>
        <ViewParameterDetails
          title='Parameter Domain'
          data={domain}
          fields={fields}
        />
      </Card>
    </AppLayout>
  )
}
