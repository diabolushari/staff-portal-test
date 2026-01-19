import MainLayout from '@/layouts/main-layout'
import { billingNavItems } from '@/components/Navbar/navitems'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import Button from '@/ui/button/Button'
import { getDisplayMonthYear } from '@/utils'
import { Bill, Connection, Consumer, Meter } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import NormalText from '@/typography/NormalText'
import BillSummary from '@/components/Billing/Bill/BillSummary'
import BillArrears from '@/components/Billing/Bill/BillArrears'
import BillReadingDetails from '@/components/Billing/Bill/BillReadingDetails'
import BillInvoice from '@/components/Billing/Bill/BillInvoice'
import {
  BillMeterReadings,
  ChargeHeads,
  ComputedProperties,
  MeterWithMf,
  TotalDemandCharge,
  TotalEnergyCharge,
} from '@/interfaces/bill_pdf_interfaces'

interface BillShowPageProps {
  bill: Bill
  meter: MeterWithMf
  connection: Connection
  kwhValues: BillMeterReadings[]
  kvahValues: BillMeterReadings[]
  kvaValues: BillMeterReadings[]
  lagValues: BillMeterReadings[]
  leadValues: BillMeterReadings[]
  chargeHeads: ChargeHeads
  computedProperties: ComputedProperties
  totalDemandCharge: TotalDemandCharge
  totalEnergyCharge: TotalEnergyCharge
  averageAndTotalKva: { totalKva: number; averageKva: number }
  averageAndTotalKwh: { averageKwh: number; totalKwh: number }
}

export default function BillShowPage({
  bill,
  meter,
  connection,
  kwhValues,
  kvahValues,
  kvaValues,
  lagValues,
  leadValues,
  chargeHeads,
  computedProperties,
  totalDemandCharge,
  totalEnergyCharge,
  averageAndTotalKva,
  averageAndTotalKwh,
}: BillShowPageProps) {
  const mf = meter?.meter_mf ?? 1
  console.log(computedProperties, 'computedProperties', chargeHeads, 'chargeHeads', meter, 'mf')
  return (
    <MainLayout
      navItems={billingNavItems}
      title=''
      breadcrumb={[]}
      leftBarTitle='Billing'
      selectedItem='Bill Details'
    >
      <div className='bg-white'>
        <div className='flex flex-col items-center justify-center gap-1'>
          <StrongText className='text-2xl font-bold'>
            KERALA STATE ELECTRICITY BOARD LIMITED
          </StrongText>
          <NormalText>
            Office of the special officer(Revenue), Pattom, Thiruvananthapuram
          </NormalText>

          <StrongText className='text-3xl font-bold'>{`DEMAND CUM DISCONNECTION NOTICE FOR ${getDisplayMonthYear(bill?.bill_date, true, true)}`}</StrongText>
          <NormalText>(As per CHAPTER VII OF KERALA ELECTRICITY SUPPLY CODE -2014)</NormalText>
        </div>
        <div className='flex items-center justify-end'>
          {' '}
          <Button
            onClick={() => {
              window.open(`/pdf-download/${bill?.bill_id}`)
            }}
            label='Download'
          />
        </div>

        {/* Main Bill Container - Like Original PDF */}
        <div className='font-sans text-xs'>
          <BillSummary
            bill={bill}
            connection={connection}
          />
          <BillArrears
            bill={bill}
            connection={connection}
            kvaValues={kvaValues}
            kwhValues={kwhValues}
            mf={mf}
            computedProperties={computedProperties}
          />
          <BillReadingDetails
            bill={bill}
            meter={meter}
            kwhValues={kwhValues}
            kvahValues={kvahValues}
            kvaValues={kvaValues}
            lagValues={lagValues}
            leadValues={leadValues}
          />

          {/* Final Charges */}
          <BillInvoice
            chargeHeads={chargeHeads}
            totalDemandChargeRows={totalDemandCharge}
            totalEnergyChargeRows={totalEnergyCharge}
            bill={bill}
            computedProperties={computedProperties}
            averageAndTotalKva={averageAndTotalKva}
            averageAndTotalKwh={averageAndTotalKwh}
            mf={mf}
          />

          <div className='mt-6 text-center italic'>(Rupees {bill?.bill_amount ?? '-'})</div>

          <div className='mt-8 border-t border-black pt-2 text-right font-bold'>
            SPECIAL OFFICER (REVENUE)
          </div>
        </div>

        {/* Footer Outside Border */}
        <div className='mt-4 border-t-2 border-black pt-4 text-xs'>
          <p className='italic'>
            1. As per Regulation 130 of Kerala Electricity Supply Code 2014 any complaint regarding
            accuracy of a bill shall be first taken up with the officer designated to issue the bill
            (Special Officer(Revenue)). For Enquiry, please contact: 0471 2514323, 2514262.
          </p>
          <p className='mt-2 italic'>
            2. The connection will be disconnected without further notice, if the amount is not
            remitted on or before the DC date above.
          </p>
          <Table className='mt-4 text-xs'>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Cons#:</strong>{' '}
                  <span className='font-mono'>{connection?.consumer_number ?? '-'}</span>
                </TableCell>
                <TableCell>
                  <strong>Bill No:</strong>{' '}
                  <span className='font-mono'>{bill?.bill_id ?? '-'}</span>
                </TableCell>
                <TableCell>
                  <strong>Rs:</strong> <span className='font-mono'>{bill?.bill_amount ?? '-'}</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  )
}
