import SdCollectionForm from '@/components/SecurityDeposit/SdCollections/SdCollectionForm'
import AssessmentSummaryCard from '@/components/SecurityDeposit/SdRefunds/AssessmentSummaryCard'
import SdRegisterDetailView from '@/components/SecurityDeposit/SdRegister/SdRegisterDetailView'
import {
  ChargeHeadDefinition,
  Connection,
  SdBalanceSummary,
  SdDemand,
  SdRegister,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { useState } from 'react'

interface Props {
  sdDemand: SdDemand
  paymentModes: ParameterValues[]
  collectionStatus: ParameterValues[]
  connection: Connection
  sdRegister: SdRegister[]
  balanceSummary: SdBalanceSummary
  occupancyTypes: ParameterValues[]
  sdTypes: ChargeHeadDefinition[]
  page?: number
  pageSize?: number
}

export default function SdRefundCreate({
  sdDemand,
  paymentModes,
  collectionStatus,
  connection,
  sdRegister,
  balanceSummary,
  occupancyTypes,
  sdTypes,
  page,
  pageSize,
}: Readonly<Props>) {
  const [sheetOpen, setSheetOpen] = useState<boolean>(true)
  return (
    <SdRegisterDetailView
      sdRegister={sdRegister}
      connection={connection}
      balanceSummary={balanceSummary}
      occupancyTypes={occupancyTypes}
      sdTypes={sdTypes}
      page={page}
      pageSize={pageSize}
      sheetTitle={'Manage Refunds'}
      sheetAction={setSheetOpen}
      sheetOpen={sheetOpen}
      sheetContent={
        <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
          <AssessmentSummaryCard
            balanceSummary={balanceSummary}
            sdRegister={sdRegister[0]}
            isRefundCard={true}
          />
          <SdCollectionForm
            sdDemand={sdDemand}
            paymentModes={paymentModes}
            collectionStatus={collectionStatus}
            connection={connection}
            sdRegister={sdRegister[0]}
            isRefund={true}
          />
        </div>
      }
      highlightedAction={'refund'}
    />
  )
}
