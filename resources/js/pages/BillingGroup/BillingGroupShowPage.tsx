import BillInitializeModal from '@/components/Billing/BillingGroup/BillInitializeModal'
import { billingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import { BillingGroup, BillingGroupConnection, BillJobStatus } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Button from '@/ui/button/Button'
import DeleteButton from '@/ui/button/DeleteButton'
import CheckBox from '@/ui/form/CheckBox'
import Input from '@/ui/form/Input'
import MonthPicker from '@/ui/form/MonthPicker'
import { formatMeterReadingMonth } from '@/utils'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import BillingGroupAddConnection from './BillingGroupAddConnection'

export interface BillingGroupConnectionRelForm {
  billing_group_id: number
  connection_id: number
  status: string
}

export interface PageProps {
  billingGroup: BillingGroup
  billingGenerateJobStatus: BillJobStatus[]
}

export default function BillingGroupShowPage({
  billingGroup,
  billingGenerateJobStatus,
}: PageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Billing Groups', href: route('billing-groups.index') },
    {
      title: `Group ${billingGroup?.name}`,
      href: route('billing-groups.show', {
        id: billingGroup?.billing_group_id,
      }),
    },
  ]
  const [deleteConnection, setDeleteConnection] = useState<boolean>(false)
  const [deleteConnectionItem, setDeleteConnectionItem] = useState<BillingGroupConnection | null>(
    null
  )
  const [showInitializeModal, setShowInitializeModal] = useState(false)
  const [addConnectionComponent, setAddConnectionComponent] = useState(false)

  const { formData, setFormValue } = useCustomForm({
    search: '',
    bill_year_month: '',
    selectedConnections: [],
  })
  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleDelete = (connectionMapping: BillingGroupConnection) => {
    setDeleteConnectionItem(connectionMapping)
    setDeleteConnection(true)
  }
  const handleBillInitialize = () => {
    setShowInitializeModal(true)
  }
  const handleSelectConnection = (connectionId: number) => {
    const updatedSelectedConnections = formData.selectedConnections.includes(connectionId)
      ? formData.selectedConnections.filter((id) => id !== connectionId)
      : [...formData.selectedConnections, connectionId]
    setFormValue('selectedConnections')(updatedSelectedConnections)
  }

  const handleOnClickConnection = (connectionId: number) => {
    router.get(
      route('connection.meter-reading', {
        id: connectionId,
      })
    )
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      leftBarTitle='Billing Group'
      selectedItem='Billing Groups'
      navItems={billingNavItems}
      title={billingGroup.name}
    >
      <div className='flex justify-end gap-2'>
        <Button
          variant={addConnectionComponent ? 'danger' : 'default'}
          label={addConnectionComponent ? 'Close' : 'Add Member'}
          onClick={() => setAddConnectionComponent(!addConnectionComponent)}
        />
      </div>
      {addConnectionComponent && <BillingGroupAddConnection billingGroup={billingGroup} />}

      {!addConnectionComponent && (
        <div className='grid grid-cols-2 gap-4'>
          <form
            onSubmit={handleSearchClick}
            className='flex gap-4'
          >
            <div>
              <Input
                label='Consumer Number/Name/Type/Purpose'
                value={formData.search}
                setValue={setFormValue('search')}
              />
            </div>
            <div className='mt-1'>
              <MonthPicker
                label='Bill Year Month'
                value={formData.bill_year_month}
                setValue={setFormValue('bill_year_month')}
              />
            </div>
            <div className='mt-6'>
              <Button
                label='Search'
                type='submit'
              />
            </div>
          </form>
          <div className='mt-6 flex justify-end gap-2'>
            <div>
              <Button
                onClick={handleBillInitialize}
                label='Initialize Bill'
              />
            </div>
          </div>
        </div>
      )}
      {billingGroup?.connections && billingGroup?.connections?.length > 0 && (
        <div className='mt-6'>
          <h2 className='mb-4 text-xl font-semibold'>Connected Consumers</h2>

          {billingGroup?.connections?.map((conn: BillingGroupConnection) => (
            <div
              key={conn.connection_id}
              className='mb-4 rounded-xl border bg-white p-4 shadow-sm'
            >
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-4'>
                  <Card
                    className='grid cursor-pointer grid-cols-2 justify-between gap-4 p-4 transition-all duration-150 ease-in-out hover:scale-101'
                    onClick={() => handleOnClickConnection(conn?.connection_id)}
                  >
                    <div>
                      <h4 className='text-sm text-gray-500'>Consumer Number</h4>
                      <p className='text-lg font-semibold'>{conn?.connection?.consumer_number}</p>
                    </div>

                    <div>
                      <h4 className='text-sm text-gray-500'>Type</h4>
                      <p className='text-lg'>
                        {conn?.connection?.connection_type?.parameter_value}
                      </p>
                    </div>

                    <div>
                      <h4 className='text-sm text-gray-500'>Name</h4>
                      <p className='text-lg'>
                        {conn?.connection?.consumer_profiles?.[0]?.organization_name ?? '-'}
                      </p>
                    </div>

                    <div>
                      <h4 className='text-sm text-gray-500'>Purpose</h4>
                      <p className='text-lg'>
                        {conn?.connection?.primary_purpose?.parameter_value}
                      </p>
                    </div>
                  </Card>
                  <Card>
                    <div>
                      <h4 className='text-sm text-gray-500'>Latest Meter Reading</h4>
                      <p className='text-lg font-semibold'>
                        {formatMeterReadingMonth(
                          conn?.connection?.latest_meter_reading?.reading_start_date,
                          conn?.connection?.latest_meter_reading?.reading_end_date
                        )}
                      </p>
                    </div>
                  </Card>
                </div>
                <div className='flex items-center justify-end gap-6'>
                  <DeleteButton onClick={() => handleDelete(conn)} />
                  <CheckBox
                    label=''
                    toggleValue={() => handleSelectConnection(conn?.connection_id)}
                    value={formData?.selectedConnection?.includes(conn?.connection_id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* {billingGenerateJobStatus?.length > 0 && (
        <BillingJobList
          isGroupNameVisible={false}
          billGenerationJobStatus={billingGenerateJobStatus}
        />
      )} */}
      {deleteConnection && deleteConnectionItem && (
        <DeleteModal
          setShowModal={setDeleteConnection}
          url={route('billing-group-connection-rel.destroy', deleteConnectionItem?.version_id)}
          title={`Delete connection ${deleteConnectionItem?.connection?.consumer_number} from the billing group ${billingGroup?.name}`}
        />
      )}
      {showInitializeModal && (
        <BillInitializeModal
          setShowModal={setShowInitializeModal}
          showModal={showInitializeModal}
          selectedConnections={formData.selectedConnections}
          billingGroup={billingGroup}
        />
      )}
    </MainLayout>
  )
}
