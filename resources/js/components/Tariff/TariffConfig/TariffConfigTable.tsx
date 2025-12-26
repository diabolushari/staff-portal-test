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
import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import TariffConfigForm from '../TariffConfigForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import { getDisplayDate } from '@/utils'
import { MoreVertical } from 'lucide-react'
import { router } from '@inertiajs/react'

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

  const [openActionId, setOpenActionId] = useState<number | null>(null)

  const [openDirection, setOpenDirection] = useState<'up' | 'down'>('down')

  return (
    <CustomCard
      title='Tariff Configurations'
      // addButton={{
      //   title: 'Add Tariff Config',
      //   url: route('tariff-config.create', tariffOrder.tariff_order_id),
      // }}
      onAddClick={() => setAddTariffConfig(true)}
      addButtonText='Add Tariff Config'
    >
      <div className='overflow-visible'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>#</TableHead>
              <TableHead>Connection Tariff</TableHead>
              <TableHead>Lower Limit</TableHead>
              <TableHead>Upper Limit</TableHead>
              <TableHead>Demand Charge</TableHead>
              <TableHead>Energy Charge</TableHead>
              <TableHead>Effective Start</TableHead>
              <TableHead>Effective End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tariff_configs?.data?.map((config, index) => (
              <TableRow key={config.tariff_config_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{config.connection_tariff?.parameter_value || '-'}</TableCell>
                <TableCell>{config.consumption_lower_limit}</TableCell>
                <TableCell>{config.consumption_upper_limit}</TableCell>
                <TableCell>{config.demand_charge_kva}</TableCell>
                <TableCell>{config.energy_charge_kwh}</TableCell>
                <TableCell>{getDisplayDate(config.effective_start)}</TableCell>
                <TableCell>{getDisplayDate(config.effective_end)}</TableCell>

                <TableCell className='relative'>
                  <div>
                    {/* Action button */}
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const spaceBelow = window.innerHeight - rect.bottom

                        setOpenDirection(spaceBelow < 300 ? 'up' : 'down')

                        setOpenActionId(
                          openActionId === config.tariff_config_id ? null : config.tariff_config_id
                        )
                      }}
                      className='rounded-md p-2 text-gray-600 hover:bg-gray-100'
                    >
                      <MoreVertical className='h-5 w-5' />
                    </button>

                    {/* Dropdown */}
                    {openActionId === config.tariff_config_id && (
                      <>
                        {/* Backdrop */}
                        <div
                          className='fixed inset-0 z-10'
                          onClick={() => setOpenActionId(null)}
                        />

                        {/* Dropdown */}
                        <div
                          className={`absolute right-0 z-20 w-36 rounded-md border border-gray-200 bg-white shadow-lg ${openDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} `}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              router.visit(route('tariff-configs.edit', config.tariff_config_id))
                            }
                            className='flex w-full px-4 py-2 text-sm hover:bg-gray-100'
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setOpenActionId(null)
                              handleDelete(config)
                            }}
                            className='flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </TableCell>
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
      </div>

      {/* Pagination */}
      <div className='mt-4'>
        <Pagination pagination={tariff_configs} />
      </div>
      {addTariffConfig && (
        <TariffConfigForm
          tariffOrder={tariffOrder}
          consumptionTariff={consumption_tariff ?? []}
          setModalOpen={setAddTariffConfig}
        />
      )}
    </CustomCard>
  )
}
