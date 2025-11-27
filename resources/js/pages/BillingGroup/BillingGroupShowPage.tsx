import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { useEffect, useState } from 'react'
import { BillingGroup } from '@/interfaces/data_interfaces'
import FormCard from '@/ui/Card/FormCard'
import Button from '@/ui/button/Button'
import useCustomForm from '@/hooks/useCustomForm'
import ComboBox from '@/ui/form/ComboBox'
import { Connection } from '@/interfaces/data_interfaces'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Card } from '@/components/ui/card'
import CheckBox from '@/ui/form/CheckBox'
import DeleteButton from '@/ui/button/DeleteButton'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import BillInitializeModal from '@/components/Billing/BillingGroup/BillInitializeModal'
import BillingGroupAddConnection from './BillingGroupAddConnection'

export interface BillingGroupConnectionRelForm {
  billing_group_id: number
  connection_id: number
  status: string
}

export default function BillingGroupShowPage({ billingGroup }: { billingGroup: BillingGroup }) {
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

  const [addedConnection, setAddedConnection] = useState<Connection | null>(null)
  const [showInitializeModal, setShowInitializeModal] = useState(false)
  const [addConnectionComponent, setAddConnectionComponent] = useState(false)

  const { formData: searchFormData, setFormValue: setSearchFormValue } = useCustomForm({
    search: '',
    bill_year_month: '',
    selectedConnection: [],
  })

  const handleDelete = (connectionId: number) => {}
  const handleBillInitialize = () => {
    setShowInitializeModal(true)
  }
  const handleSelectConnection = (connectionId: number) => {
    const updatedConnections = [...searchFormData.selectedConnection]
    if (updatedConnections.includes(connectionId)) {
      updatedConnections.splice(updatedConnections.indexOf(connectionId), 1)
    } else {
      updatedConnections.push(connectionId)
    }
    setSearchFormValue('selectedConnection')(updatedConnections)
  }
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      leftBarTitle='Billing Group'
      navItems={billingNavItems}
      title={billingGroup.name}
      addBtnText={addConnectionComponent ? 'Close' : 'Member'}
      addBtnClick={() => setAddConnectionComponent(!addConnectionComponent)}
    >
      {addConnectionComponent && <BillingGroupAddConnection billingGroup={billingGroup} />}
      <div className='grid grid-cols-2 gap-4'>
        <form
          action=''
          className='flex gap-4'
        >
          <div>
            <Input
              label='Consumer Number/Name/Type/Purpose'
              value={searchFormData.search}
              setValue={setSearchFormValue('search')}
            />
          </div>
          <div className='mt-6'>
            <Input
              label='Bill Year Month'
              value={searchFormData.bill_year_month}
              setValue={setSearchFormValue('bill_year_month')}
            />
          </div>
          <div className='mt-12'>
            <Button
              label='Search'
              type='submit'
            />
          </div>
        </form>
        <div className='mt-12 flex justify-end gap-2'>
          <SelectList
            list={[
              { value: 'All', label: 'All' },
              { value: 'Connected', label: 'Connected' },
              { value: 'Disconnected', label: 'Disconnected' },
            ]}
            value='All'
            setValue={(value: string) => setSearchFormValue('status')(value)}
            dataKey='value'
            displayKey='label'
          />
          <div>
            <Button
              onClick={handleBillInitialize}
              label='Initialize Bill'
            />
          </div>
        </div>
      </div>
      {billingGroup?.connections && billingGroup?.connections?.length > 0 && (
        <div className='mt-6'>
          <h2 className='mb-4 text-xl font-semibold'>Connected Consumers</h2>

          {billingGroup?.connections?.map(
            (conn: { connection_id: number; connection: Connection }) => (
              <div
                key={conn.connection_id}
                className='mb-4 rounded-xl border bg-white p-4 shadow-sm'
              >
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-4'>
                    <Card className='grid grid-cols-2 justify-between gap-4 p-4'>
                      <div>
                        <h4 className='text-sm text-gray-500'>Consumer Number</h4>
                        <p className='text-lg font-semibold'>{conn.connection.consumer_number}</p>
                      </div>

                      <div>
                        <h4 className='text-sm text-gray-500'>Type</h4>
                        <p className='text-lg'>{conn.connection.connection_type.parameter_value}</p>
                      </div>

                      <div>
                        <h4 className='text-sm text-gray-500'>Name</h4>
                        <p className='text-lg'>Name</p>
                      </div>

                      <div>
                        <h4 className='text-sm text-gray-500'>Purpose</h4>
                        <p className='text-lg'>{conn.connection.primary_purpose.parameter_value}</p>
                      </div>
                    </Card>
                  </div>
                  <div className='flex items-center justify-end gap-6'>
                    <DeleteButton onClick={() => handleDelete(conn.connection_id)} />
                    <CheckBox
                      label=''
                      toggleValue={() => handleSelectConnection(conn.connection_id)}
                      value={searchFormData?.selectedConnection?.includes(conn?.connection_id)}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
      {showInitializeModal && (
        <BillInitializeModal
          setShowModal={setShowInitializeModal}
          showModal={showInitializeModal}
          selectedConnections={searchFormData.selectedConnection}
        />
      )}
    </MainLayout>
  )
}
