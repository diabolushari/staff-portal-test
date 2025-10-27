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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DeleteButton from '@/ui/button/DeleteButton'
import dayjs from 'dayjs'

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

const dateToString = (date: string) => date.split('T')[0]

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
  const { formData } = useCustomForm({
    tariff_order_id: tariffOrder.tariff_order_id,
  })

  const { post, loading } = useInertiaPost<typeof formData>(route('tariff-configs.store'), {
    showErrorToast: true,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const [addedItems, setAddedItems] = useState<TariffConfigItem[]>([])

  const handleModalChange = (field: keyof TariffConfigItem, value: any) => {
    setModalForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' })) // clear error on change
  }

  const validateModalForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    const start = dayjs(modalForm.effective_start)
    const end = dayjs(modalForm.effective_end)
    const tariffStart = dayjs(tariffOrder.effective_start)
    const tariffEnd = tariffOrder.effective_end ? dayjs(tariffOrder.effective_end) : null

    // Rule 1: Start < End
    if (!start.isBefore(end)) {
      newErrors.effective_start = 'Effective start must be before effective end.'
    }

    // Rule 2: Start >= tariffOrder start
    if (start.isBefore(tariffStart)) {
      newErrors.effective_start = 'Effective start cannot be before the tariff order start date.'
    }

    // Rule 3: End <= tariffOrder end
    if (tariffEnd && end.isAfter(tariffEnd)) {
      newErrors.effective_end = 'Effective end cannot exceed tariff order effective end.'
    }

    // Rule 4: Duplicate / overlapping range for same combo
    const overlap = addedItems.find((item) => {
      const sameCombo =
        item.connection_purpose === modalForm.connection_purpose &&
        item.connection_tariff === modalForm.connection_tariff
      if (!sameCombo) return false

      // check if date ranges overlap
      const itemStart = dayjs(item.effective_start)
      const itemEnd = dayjs(item.effective_end)
      const overlapDate =
        start.isBefore(itemEnd.add(1, 'day')) && end.isAfter(itemStart.subtract(1, 'day'))

      // check if consumption range overlaps
      const low1 = parseFloat(modalForm.consumption_lower_limit || '0')
      const up1 = parseFloat(modalForm.consumption_upper_limit || '0')
      const low2 = parseFloat(item.consumption_lower_limit || '0')
      const up2 = parseFloat(item.consumption_upper_limit || '0')
      const overlapConsumption = low1 <= up2 && up1 >= low2

      // Check all fields are filled
      const allFieldsFilled =
        modalForm.connection_purpose &&
        modalForm.connection_tariff &&
        modalForm.consumption_lower_limit &&
        modalForm.consumption_upper_limit &&
        modalForm.demand_charge_kva &&
        modalForm.energy_charge_kwh &&
        modalForm.effective_start

      return overlapDate && overlapConsumption && allFieldsFilled
    })

    if (overlap) {
      newErrors.consumption_lower_limit =
        'This range overlaps with an existing configuration for same purpose & tariff.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleModalSubmit = () => {
    if (!validateModalForm()) return
    setAddedItems((prev) => [...prev, modalForm])
    setModalForm({
      connection_purpose: '',
      connection_tariff: '',
      consumption_lower_limit: '',
      consumption_upper_limit: '',
      demand_charge_kva: '',
      energy_charge_kwh: '',
      effective_start: dateToString(tariffOrder.effective_start),
      effective_end: tariffOrder.effective_end ? dateToString(tariffOrder.effective_end) : '',
    })
    setErrors({})
    setModalOpen(false)
  }

  const handleDelete = (index: number) => {
    setAddedItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({ ...formData, tariff_config_items: addedItems })
  }

  const getParameterLabel = (list: ParameterValues[], id: string) => {
    const item = list.find((p) => String(p.id) === String(id))
    return item ? item.parameter_value : id
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
                  error={errors.connection_purpose}
                  required
                />
                <SelectList
                  label='Connection Tariff'
                  list={consumptionTariff}
                  dataKey='id'
                  displayKey='parameter_value'
                  setValue={(val: any) => handleModalChange('connection_tariff', val)}
                  value={modalForm.connection_tariff}
                  error={errors.connection_tariff}
                  required
                />
                <Input
                  label='Consumption Lower Limit'
                  type='number'
                  value={modalForm.consumption_lower_limit}
                  setValue={(val: any) => handleModalChange('consumption_lower_limit', val)}
                  error={errors.consumption_lower_limit}
                  required
                />
                <Input
                  label='Consumption Upper Limit'
                  type='number'
                  value={modalForm.consumption_upper_limit}
                  setValue={(val: any) => handleModalChange('consumption_upper_limit', val)}
                  error={errors.consumption_upper_limit}
                  required
                />
                <Input
                  label='Demand Charge KVA'
                  type='number'
                  value={modalForm.demand_charge_kva}
                  setValue={(val: any) => handleModalChange('demand_charge_kva', val)}
                  required
                />
                <Input
                  label='Energy Charge KWH'
                  type='number'
                  value={modalForm.energy_charge_kwh}
                  setValue={(val: any) => handleModalChange('energy_charge_kwh', val)}
                  required
                />
                <DatePicker
                  label='Effective Start'
                  value={modalForm.effective_start}
                  setValue={(val: any) => handleModalChange('effective_start', val)}
                  error={errors.effective_start}
                  required
                />
                <DatePicker
                  label='Effective End'
                  value={modalForm.effective_end}
                  setValue={(val: any) => handleModalChange('effective_end', val)}
                  error={errors.effective_end}
                />
              </div>
              {Object.keys(errors).length > 0 && (
                <div className='mt-2 text-sm text-red-600'>
                  {Object.values(errors).map((err, idx) => (
                    <div key={idx}>{err}</div>
                  ))}
                </div>
              )}
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

        {/* Action Buttons */}
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
        <Card className='mt-6 p-4'>
          <StrongText className='text-base font-semibold'>Pending Tariff Configs</StrongText>

          <Table className='mt-4'>
            <TableHeader>
              <TableRow>
                <TableHead>Purpose</TableHead>
                <TableHead>Tariff</TableHead>
                <TableHead>Lower</TableHead>
                <TableHead>Upper</TableHead>
                <TableHead>KVA</TableHead>
                <TableHead>KWH</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addedItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {getParameterLabel(connectionPurpose, item.connection_purpose)}
                  </TableCell>
                  <TableCell>
                    {getParameterLabel(consumptionTariff, item.connection_tariff)}
                  </TableCell>
                  <TableCell>{item.consumption_lower_limit}</TableCell>
                  <TableCell>{item.consumption_upper_limit}</TableCell>
                  <TableCell>{item.demand_charge_kva}</TableCell>
                  <TableCell>{item.energy_charge_kwh}</TableCell>
                  <TableCell>{item.effective_start}</TableCell>
                  <TableCell>{item.effective_end}</TableCell>
                  <TableCell className='text-right'>
                    <DeleteButton onClick={() => handleDelete(idx)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
