import React, { useEffect, useState } from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import DatePicker from '@/ui/form/DatePicker'
import Modal from '@/ui/Modal/Modal'
import { TariffOrder } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import dayjs from 'dayjs'
import Field from '../ui/field'

interface TariffConfigItem {
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
  consumptionTariff: ParameterValues[]
  setModalOpen: (open: boolean) => void
}

export default function TariffConfigForm({
  tariffOrder,
  consumptionTariff,
  setModalOpen,
}: Readonly<PageProps>) {
  const { formData } = useCustomForm({
    tariff_order_id: tariffOrder.tariff_order_id,
  })

  const { post, loading } = useInertiaPost<typeof formData>(route('tariff-configs.store'), {
    showErrorToast: true,
  })

  const [connectionTariff, setConnectionTariff] = useState<ParameterValues | null>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [modalForm, setModalForm] = useState<TariffConfigItem>({
    connection_tariff: '',
    consumption_lower_limit: '',
    consumption_upper_limit: '',
    demand_charge_kva: '',
    energy_charge_kwh: '',
    effective_start: dateToString(tariffOrder.effective_start),
    effective_end: tariffOrder.effective_end ? dateToString(tariffOrder.effective_end) : '',
  })

  const handleModalChange = (field: keyof TariffConfigItem, value: any) => {
    setModalForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  useEffect(() => {
    const tariff = consumptionTariff.find((t) => t.id === Number(modalForm.connection_tariff))
    if (tariff) setConnectionTariff(tariff)
  }, [modalForm.connection_tariff])

  const validateModalForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const start = dayjs(modalForm.effective_start)
    const end = dayjs(modalForm.effective_end)
    const tariffStart = dayjs(tariffOrder.effective_start)
    const tariffEnd = tariffOrder.effective_end ? dayjs(tariffOrder.effective_end) : null

    if (!start.isBefore(end)) {
      newErrors.effective_start = 'Effective start must be before effective end.'
    }

    if (start.isBefore(tariffStart)) {
      newErrors.effective_start = 'Effective start cannot be before the tariff order start date.'
    }

    if (tariffEnd && end.isAfter(tariffEnd)) {
      newErrors.effective_end = 'Effective end cannot exceed tariff order effective end.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateModalForm()) return

    post({
      ...formData,
      tariff_config_items: [modalForm], // only 1 item
    })

    setModalOpen(false)
  }

  return (
    <div>
      {/* Modal contains the only form */}
      <Modal
        title='Add Tariff Config'
        setShowModal={setModalOpen}
        showClosButton={true}
        large={true}
      >
        <div className='grid gap-4 md:grid-cols-2'>
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

          <Field
            label='Tariff Type'
            value={connectionTariff?.attribute1_value || ''}
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
            {Object.values(errors).map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}

        <div className='mt-4 flex justify-end'>
          <Button
            type='button'
            label='Save'
            onClick={handleSubmit}
            loading={loading}
          />
        </div>
      </Modal>
    </div>
  )
}
