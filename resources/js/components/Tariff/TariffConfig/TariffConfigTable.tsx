import { TariffConfig } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
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

export default function TariffConfigTable({
  tariff_configs,
  tariffOrderId,
}: {
  tariff_configs: Paginator<TariffConfig>
  tariffOrderId: number
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTariffConfigId, setSelectedTariffConfigId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    setSelectedTariffConfigId(id)
    setIsDeleteModalOpen(true)
  }
  console.log(tariff_configs)
  return (
    <CustomCard
      title='Tariff Configurations'
      addButton={{ title: 'Add Tariff Config', url: route('tariff-config.create', tariffOrderId) }}
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
                <DeleteButton onClick={() => handleDelete(config.tariff_config_id)} />
              </TableCell>
            </TableRow>
          ))}
          {isDeleteModalOpen && selectedTariffConfigId && (
            <DeleteModal
              title='Delete Tariff Config'
              url={route('tariff-configs.destroy', selectedTariffConfigId)}
              setShowModal={() => setIsDeleteModalOpen(false)}
            />
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className='mt-4'>
        <Pagination pagination={tariff_configs} />
      </div>
    </CustomCard>
  )
}
