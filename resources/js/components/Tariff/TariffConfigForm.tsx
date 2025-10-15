import React, { useState } from 'react'
import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import DatePicker from '@/ui/form/DatePicker'
import Modal from '@/ui/Modal/Modal'
import { TariffOrder } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'

interface TariffConfigItem {
  connection_purpose: string
  connection_tariff: string
  consumption_lower_limit: string
  consumption_upper_limit: string
  demand_charge_kva: string
  energy_charge_kwh: string
  effective_start: string
  effective_end: string
}

const dateToString = (date: string) => {
  return date.split('T')[0]
}

interface PageProps {
  tariffOrder: TariffOrder
  connectionPurpose: ParameterValues[]
  consumptionTariff: ParameterValues[]
}

export default function TariffConfigForm({
  tariffOrder,
  connectionPurpose,
  consumptionTariff,
}: Readonly<PageProps>) {
  const { formData, setFormValue } = useCustomForm({
    tariff_order_id: tariffOrder.tariff_order_id,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(route('tariff-config.store'), {
    showErrorToast: true,
  })

  // State for modal
  const [modalOpen, setModalOpen] = useState(false)
  const [modalForm, setModalForm] = useState<TariffConfigItem>({
    connection_purpose: '',
    connection_tariff: '',
    consumption_lower_limit: '',
    consumption_upper_limit: '',
    demand_charge_kva: '',
    energy_charge_kwh: '',
    effective_start: dateToString(tariffOrder.effective_start),
    effective_end: tariffOrder.effective_end ? dateToString(tariffOrder.effective_end) : '',
  })

  // List of added items
  const [addedItems, setAddedItems] = useState<TariffConfigItem[]>([])

  const handleModalChange = (field: keyof TariffConfigItem, value: any) => {
    setModalForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleModalSubmit = () => {
    setAddedItems((prev) => [...prev, modalForm])
    // Reset modal
    setModalForm({
      connection_purpose: '',
      connection_tariff: '',
      consumption_lower_limit: '',
      consumption_upper_limit: '',
      demand_charge_kva: '',
      energy_charge_kwh: '',
      effective_start: tariffOrder.effective_start.toString(),
      effective_end: tariffOrder.effective_end?.toString() ?? '',
    })
    setModalOpen(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(formData)
    e.preventDefault()
    console.log(addedItems)
    post({ ...formData, tariff_config_items: addedItems })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Modal */}
        {modalOpen && (
          <div className='w-full max-w-lg rounded-lg bg-white p-6'>
            <Modal
              title='Add Tariff Config'
              setShowModal={setModalOpen}
              showClosButton={true}
              large={true}
            >
              <div className='grid gap-4 md:grid-cols-2'>
                <SelectList
                  label='Connection Purpose'
                  list={connectionPurpose}
                  dataKey='id'
                  displayKey='parameter_value'
                  setValue={(val: any) => handleModalChange('connection_purpose', val)}
                  value={modalForm.connection_purpose}
                />
                <SelectList
                  label='Connection Tariff'
                  list={consumptionTariff}
                  dataKey='id'
                  displayKey='parameter_value'
                  setValue={(val: any) => handleModalChange('connection_tariff', val)}
                  value={modalForm.connection_tariff}
                />
                <Input
                  label='Consumption Lower Limit'
                  type='number'
                  value={modalForm.consumption_lower_limit}
                  setValue={(val: any) => handleModalChange('consumption_lower_limit', val)}
                />
                <Input
                  label='Consumption Upper Limit'
                  type='number'
                  value={modalForm.consumption_upper_limit}
                  setValue={(val: any) => handleModalChange('consumption_upper_limit', val)}
                />
                <Input
                  label='Demand Charge KVA'
                  type='number'
                  value={modalForm.demand_charge_kva}
                  setValue={(val: any) => handleModalChange('demand_charge_kva', val)}
                />
                <Input
                  label='Energy Charge KWH'
                  type='number'
                  value={modalForm.energy_charge_kwh}
                  setValue={(val: any) => handleModalChange('energy_charge_kwh', val)}
                />
                <DatePicker
                  label='Effective Start'
                  value={modalForm.effective_start}
                  setValue={(val: any) => handleModalChange('effective_start', val)}
                />
                <DatePicker
                  label='Effective End'
                  value={modalForm.effective_end}
                  setValue={(val: any) => handleModalChange('effective_end', val)}
                />
              </div>
              <div className='mt-4 flex justify-end'>
                <Button
                  type='button'
                  label='Add'
                  onClick={handleModalSubmit}
                />
              </div>
            </Modal>
          </div>
        )}

        <div className='mt-4 flex justify-between'>
          <Button
            type='button'
            label='Add Config'
            onClick={() => setModalOpen(true)}
          />
          <Button
            type='submit'
            disabled={loading}
            label={loading ? 'Saving...' : 'Save'}
          />
        </div>
      </form>

      {/* Display added items */}
      {addedItems.length > 0 && (
        <Card className='mt-6'>
          <StrongText className='text-base font-semibold'>Pending Tariff Configs</StrongText>
          <table className='mt-2 w-full border-collapse border border-gray-200'>
            <thead>
              <tr>
                <th className='border p-2'>Purpose</th>
                <th className='border p-2'>Tariff</th>
                <th className='border p-2'>Lower</th>
                <th className='border p-2'>Upper</th>
                <th className='border p-2'>KVA</th>
                <th className='border p-2'>KWH</th>
                <th className='border p-2'>Start</th>
                <th className='border p-2'>End</th>
              </tr>
            </thead>
            <tbody>
              {addedItems.map((item, idx) => (
                <tr key={idx}>
                  <td className='border p-2'>{item.connection_purpose}</td>
                  <td className='border p-2'>{item.connection_tariff}</td>
                  <td className='border p-2'>{item.consumption_lower_limit}</td>
                  <td className='border p-2'>{item.consumption_upper_limit}</td>
                  <td className='border p-2'>{item.demand_charge_kva}</td>
                  <td className='border p-2'>{item.energy_charge_kwh}</td>
                  <td className='border p-2'>{item.effective_start}</td>
                  <td className='border p-2'>{item.effective_end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
