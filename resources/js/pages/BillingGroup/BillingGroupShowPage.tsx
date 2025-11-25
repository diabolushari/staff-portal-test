import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { useEffect, useState } from 'react'
import { BillingGroup } from '@/interfaces/data_interfaces'
import FormCard from '@/ui/Card/FormCard'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'
import useCustomForm from '@/hooks/useCustomForm'
import ComboBox from '@/ui/form/ComboBox'
import { Connection } from '@/interfaces/data_interfaces'
import useInertiaPost from '@/hooks/useInertiaPost'

export interface BillingGroupConnectionRelForm {
  billing_group_id: number
  connection_id: number
}

export default function BillingGroupShowPage({
  billingGroup,
  connectionData,
}: {
  billingGroup: BillingGroup
  connectionData?: Connection
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Billing Groups', href: route('billing-groups.index') },
    {
      title: 'Billing Group Show',
      href: route('billing-groups.show', {
        versionId: billingGroup.version_id,
        id: billingGroup.billing_group_id,
      }),
    },
  ]

  const [selectedConsumer, setSelectedConsumer] = useState<Connection | null>(null)

  const payload = {
    billing_group_id: billingGroup.billing_group_id,
    connection_id: selectedConsumer?.connection_id ?? 0,
  }

  const [addedConnection, setAddedConnection] = useState<Connection | null>(null)

  useEffect(() => {
    if (connectionData) {
      setAddedConnection(connectionData)
    }
  }, [connectionData])

  const { formData, setFormValue } = useCustomForm<BillingGroupConnectionRelForm>(payload)
  const { post, errors, loading } = useInertiaPost(route('billing-group-connection-rel.store'))
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  useEffect(() => {
    setFormValue('connection_id')(selectedConsumer?.connection_id ?? 0)
  }, [selectedConsumer, setSelectedConsumer])

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      leftBarTitle='Billing Group'
      navItems={billingNavItems}
      title={billingGroup.name}
      addBtnText='Billing Group'
      addBtnUrl='/billing-groups/show'
    >
      <form
        className='flex flex-col gap-6'
        onSubmit={handleSubmit}
      >
        <FormCard title='Search & Add Members'>
          <ComboBox
            label='Consumer Number'
            url={`/api/consumer-number?q=`}
            setValue={setSelectedConsumer}
            value={selectedConsumer}
            dataKey='connection_id'
            displayKey='consumer_number'
            displayValue2='connection_type_id'
            placeholder='Enter Consumer Number'
          />
        </FormCard>
        <div className='flex justify-end'>
          <Button
            label='Submit'
            type='submit'
          />
        </div>
      </form>
      {billingGroup.connections && billingGroup.connections.length > 0 && (
        <div className='mt-6'>
          <h2 className='mb-4 text-xl font-semibold'>Connected Consumers</h2>

          {billingGroup.connections.map((conn: Connection) => (
            <div
              key={conn.connection_id}
              className='mb-4 rounded-xl border bg-white p-4 shadow-sm'
            >
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <h4 className='text-sm text-gray-500'>Consumer Number</h4>
                  <p className='text-lg font-semibold'>{conn.consumer_number}</p>
                </div>

                <div>
                  <h4 className='text-sm text-gray-500'>Type</h4>
                  <p className='text-lg'>{conn.connection_type}</p>
                </div>

                <div>
                  <h4 className='text-sm text-gray-500'>Name</h4>
                  <p className='text-lg'>{conn.consumer_name}</p>
                </div>

                <div>
                  <h4 className='text-sm text-gray-500'>Purpose</h4>
                  <p className='text-lg'>{conn.purpose}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  )
}
