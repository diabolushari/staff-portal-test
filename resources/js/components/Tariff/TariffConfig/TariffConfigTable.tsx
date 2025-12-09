import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Pagination from '@/ui/Pagination/Pagination'
import CustomCard from '@/ui/Card/CustomCard'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import TariffConfigForm from '../TariffConfigForm'
import { ParameterValues } from '@/interfaces/parameter_types'

export default function TariffConfigTable({
  tariff_configs,
  tariffOrder,
  consumption_tariff,
}: {
  tariff_configs: Paginator<TariffConfig>

  tariffOrder: TariffOrder
  consumption_tariff: ParameterValues[]
}) {
  const [addTariffConfig, setAddTariffConfig] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTariffConfig, setSelectedTariffConfig] = useState<TariffConfig | null>(null)

  const handleDelete = (tariffConfig: TariffConfig) => {
    setSelectedTariffConfig(tariffConfig)
    setIsDeleteModalOpen(true)
  }

  return (
    <CustomCard
      title='Tariff Configurations'
      // addButton={{
      //   title: 'Add Tariff Config',
      //   url: route('tariff-config.create', tariffOrder.tariff_order_id),
      // }}
      onAddClick={() => setAddTariffConfig(true)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>Connection Tariff</TableHead>
            <TableHead>Tariff Type</TableHead>
            <TableHead>Lower Limit</TableHead>
            <TableHead>Upper Limit</TableHead>
            <TableHead>Demand Charge</TableHead>
            <TableHead>Energy Charge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tariff_configs?.data?.map((config, index) => (
            <TableRow key={config.tariff_config_id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{config.connection_tariff?.parameter_value || '-'}</TableCell>
              <TableCell>{config.connection_tariff?.attribute1_value ?? '-'}</TableCell>
              <TableCell>{config.consumption_lower_limit}</TableCell>
              <TableCell>{config.consumption_upper_limit}</TableCell>
              <TableCell>{config.demand_charge_kva}</TableCell>
              <TableCell>{config.energy_charge_kwh}</TableCell>
              <TableCell className='flex gap-2'>
                <EditButton link={route('tariff-configs.edit', config.tariff_config_id)} />
                <DeleteButton onClick={() => handleDelete(config)} />
              </TableCell>
              TariffConfigTable
            </TableRow>
          ))}
          {isDeleteModalOpen && selectedTariffConfig && (
            <DeleteModal
              title='Delete Tariff Config'
              url={route('tariff-configs.destroy', selectedTariffConfig.tariff_config_id)}
              setShowModal={() => setIsDeleteModalOpen(false)}
            >
              Are you sure to delete {selectedTariffConfig.connection_tariff?.parameter_value}
            </DeleteModal>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className='mt-4'>
        <Pagination pagination={tariff_configs} />
      </div>
      {addTariffConfig && (
        <TariffConfigForm
          tariffOrder={tariffOrder}
          consumptionTariff={consumption_tariff ?? []}
        />
      )}
    </CustomCard>
  )
}
