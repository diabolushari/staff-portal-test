import { router } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { ParameterValues } from '@/interfaces/parameter_types'
import { useEffect, useState } from 'react'
import {
  Connection,
  Meter,
  MeterConnectionMapping,
  MeterTransformer,
  MeterTransformerAssignment,
} from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { BreadcrumbItem } from '@/types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import ConnectMeterTransformerModal from '@/components/Connections/ConnectionMeter/ConnectMeterTransformerModal'
import SelectUnassignedMeterModal from '@/components/Connections/ConnectionMeter/SelectUnassignedMeterModal'

const toYMD = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
}

export default function ConnectMeter({
  connection_id,
  relation,
  meters,
  useCategory,
  meterStatus,
  connection,
  ctpts,
  statuses,
}: {
  connection_id: number
  relation?: MeterConnectionMapping
  meters: Meter[]
  useCategory: ParameterValues[]
  meterStatus: ParameterValues[]
  changeReason: ParameterValues[]
  connection: Connection
  ctpts: MeterTransformer[]
  statuses: ParameterValues[]
  changeReasons: ParameterValues[]
}) {
  const [meterTransformers, setMeterTransformers] = useState<MeterTransformerAssignment[]>([])

  const [showModal, setShowModal] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null)
  const [showMeterModal, setShowMeterModal] = useState(false)
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    rel_id: '',
    connection_id: connection_id,
    meter_id: '',
    meter_use_category: '',
    meter_status_id: '',
    sort_priority: '0',
    is_meter_reading_mandatory: false,
    energise_date: '',
    _method: relation ? 'PUT' : undefined,
    meter_transformers: meterTransformers,
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    relation
      ? route('meter-connection-rel.update', connection_id)
      : route('meter-connection-rel.store'),
    {
      showErrorToast: true,
    }
  )
  useEffect(() => {
    setFormValue('meter_transformers')(meterTransformers)
  }, [meterTransformers])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    post(formData)
  }
  const getCtptSerial = (id: number) =>
    availableCtpts.find((ct) => ct.meter_ctpt_id == id)?.ctpt_serial ?? '-'

  const getStatusValue = (id: number) => statuses.find((st) => st.id == id)?.parameter_value ?? '-'

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Connections',
      href: route('connections.index'),
    },
    {
      title: connection?.consumer_number.toString() ?? '',
      href: route('connections.show', connection?.connection_id),
    },
    {
      title: 'Meters',
      href: route('connection.meters', connection?.connection_id),
    },
    {
      title: 'Connect Meter',
      href: route('connection.meter.create', connection?.connection_id),
    },
  ]
  const availableCtpts = ctpts?.filter(
    (ct) => !meterTransformers?.some((m) => m.ctpt_id == ct.meter_ctpt_id)
  )
  const handleClearSelection = () => {
    setSelectedMeter(null)
    setFormValue('meter_id')('')
  }

  return (
    <ConnectionsLayout
      connectionsNavItems={consumerNavItems}
      breadcrumbs={breadcrumbs}
      value='configuration'
      subTabValue='meter'
      heading='Connect Meter'
      subHeading=''
      connectionId={connection?.connection_id ?? 0}
      connection={connection}
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-8'
      >
        <Card>
          <div className='border-b-2 border-gray-200 py-3'>
            <StrongText className='text-base font-semibold'>Connect Meter</StrongText>
          </div>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Meter
              </label>
              <div className='flex gap-2'>
                <Input
                  value={
                    selectedMeter
                      ? `#${selectedMeter.meter_id} - ${selectedMeter.meter_serial}`
                      : ''
                  }
                  setValue={() => {}}
                  disabled
                  error={errors.meter_id}
                />
                <Button
                  type='button'
                  label='Select'
                  onClick={() => setShowMeterModal(true)}
                  variant='secondary'
                  disabled={loading}
                />
                {selectedMeter && (
                  <Button
                    type='button'
                    label='Clear'
                    onClick={handleClearSelection}
                    variant='secondary'
                    disabled={loading}
                  />
                )}
              </div>
            </div>
            <SelectList
              label='Meter Status'
              value={formData.meter_status_id}
              setValue={setFormValue('meter_status_id')}
              list={meterStatus}
              dataKey='id'
              displayKey='parameter_value'
              error={errors.meter_status_id}
              required
            />

            <SelectList
              label='Meter Use Category'
              value={formData.meter_use_category}
              setValue={setFormValue('meter_use_category')}
              list={useCategory}
              dataKey='id'
              displayKey='parameter_value'
              error={errors.meter_use_category}
              required
            />

            <Input
              label='Sort Priority'
              type='number'
              value={formData.sort_priority}
              setValue={setFormValue('sort_priority')}
              error={errors.sort_priority}
            />
            <DatePicker
              label='Energise Date'
              value={formData.energise_date}
              setValue={setFormValue('energise_date')}
              error={errors.energise_date}
            />

            <CheckBox
              label='Meter Reading Mandatory'
              value={formData.is_meter_reading_mandatory}
              toggleValue={toggleBoolean('is_meter_reading_mandatory')}
              error={errors.is_meter_reading_mandatory}
            />
          </div>

          <div className='flex justify-end gap-3 border-t pt-6'>
            <Button
              type='button'
              label='Cancel'
              variant='secondary'
              onClick={() => router.get(route('connections.show', formData.connection_id))}
              disabled={loading}
            />
            <Button
              type='submit'
              label={relation ? 'Save Changes' : 'Connect Meter'}
              disabled={loading}
            />
          </div>
        </Card>
        <Card>
          <div className='flex items-center justify-between border-b-2 border-gray-200 py-3'>
            <StrongText className='text-base font-semibold'>Connect CTPT</StrongText>
            <div>
              {availableCtpts?.length > 0 && (
                <Button
                  type='button'
                  label='Connect CTPT'
                  variant='primary'
                  onClick={() => setShowModal(true)}
                  disabled={loading}
                />
              )}
            </div>
          </div>
          {meterTransformers.length > 0 && (
            <Card className='mt-4 p-4'>
              <strong className='text-base font-semibold'>Added CTPTs</strong>

              <div className='mt-4 space-y-4'>
                {meterTransformers.map((item, idx) => (
                  <div
                    key={item.ctpt_id}
                    className='rounded border bg-gray-50 p-4 dark:bg-gray-800'
                  >
                    <p>
                      <strong>CTPT Serial:</strong> {getCtptSerial(item.ctpt_id)}
                    </p>
                    <p>
                      <strong>Status:</strong> {getStatusValue(item.status_id)}
                    </p>

                    <p>
                      <strong>Faulty Date:</strong> {item.faulty_date || '-'}
                    </p>
                    <p>
                      <strong>Energise:</strong> {item.ctpt_energise_date || '-'}
                    </p>
                    <p>
                      <strong>Change:</strong> {item.ctpt_change_date || '-'}
                    </p>

                    <div className='mt-3 flex justify-end'>
                      <Button
                        type='button'
                        label='Remove'
                        variant='danger'
                        onClick={() => {
                          setMeterTransformers((prev) =>
                            prev.filter((t) => t.ctpt_id !== item.ctpt_id)
                          )
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </Card>
      </form>

      {showModal && (
        <ConnectMeterTransformerModal
          setShowModal={setShowModal}
          relation={relation}
          statuses={statuses}
          ctpts={availableCtpts}
          onAdd={(item) => {
            setMeterTransformers((prev) => [...prev, item])
          }}
        />
      )}
      {showMeterModal && (
        <SelectUnassignedMeterModal
          onClose={() => setShowMeterModal(false)}
          onSelect={(item) => {
            setSelectedMeter(item)
            setFormValue('meter_id')(item.meter_id.toString())
          }}
          currentSelection={selectedMeter}
        />
      )}
    </ConnectionsLayout>
  )
}
