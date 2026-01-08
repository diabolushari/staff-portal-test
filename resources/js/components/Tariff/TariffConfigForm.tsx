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
  const { formData, setFormValue } = useCustomForm({
    tariff_order_id: tariffOrder.tariff_order_id,
    connection_tariff: '',
    consumption_lower_limit: '',
    consumption_upper_limit: '',
    demand_charge_kva: '',
    energy_charge_kwh: '',
    effective_start: dateToString(tariffOrder.effective_start),
    effective_end: tariffOrder.effective_end ? dateToString(tariffOrder.effective_end) : '',
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(route('tariff-configs.store'), {
    showErrorToast: true,
  })

  const handleSubmit = () => {
    post(formData)
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
            setValue={setFormValue('connection_tariff')}
            value={formData.connection_tariff}
            error={errors.connection_tariff}
            required
          />

          <Input
            label='Consumption Lower Limit'
            type='number'
            value={formData.consumption_lower_limit}
            setValue={setFormValue('consumption_lower_limit')}
            error={errors.consumption_lower_limit}
            required
          />

          <Input
            label='Consumption Upper Limit'
            type='number'
            value={formData.consumption_upper_limit}
            setValue={setFormValue('consumption_upper_limit')}
            error={errors.consumption_upper_limit}
            required
          />

          <Input
            label='Demand Charge KVA'
            type='number'
            value={formData.demand_charge_kva}
            setValue={setFormValue('demand_charge_kva')}
            required
            error={errors.demand_charge_kva}
          />

          <Input
            label='Energy Charge KWH'
            type='number'
            value={formData.energy_charge_kwh}
            setValue={setFormValue('energy_charge_kwh')}
            required
            error={errors.energy_charge_kwh}
          />

          <DatePicker
            label='Effective Start'
            value={formData.effective_start}
            setValue={setFormValue('effective_start')}
            error={errors.effective_start}
            required
          />

          <DatePicker
            label='Effective End'
            value={formData.effective_end}
            setValue={setFormValue('effective_end')}
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

        <div className='mt-4 flex justify-between'>
          <Button
            type='button'
            label='Cancel'
            onClick={() => setModalOpen(false)}
            variant='secondary'
          />
          <Button
            type='button'
            label='Save'
            onClick={handleSubmit}
            disabled={loading}
            variant={loading ? 'loading' : 'default'}
            processing={loading}
          />
        </div>
      </Modal>
    </div>
  )
}
