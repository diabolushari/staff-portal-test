import BillArrears from '@/components/Billing/Bill/BillArrears'
import BillInvoice from '@/components/Billing/Bill/BillInvoice'
import BillReadingDetails from '@/components/Billing/Bill/BillReadingDetails'
import BillSummary from '@/components/Billing/Bill/BillSummary'
import {
  BillMeterReading,
  ChargeHeads,
  ComputedProperties,
  ComputedProperty,
  MeterWithMf,
  TotalDemandCharge,
  TotalEnergyCharge,
} from '@/interfaces/bill_pdf_interfaces'
import { Bill, Connection } from '@/interfaces/data_interfaces'
import NormalText from '@/typography/NormalText'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import { getDisplayMonthYear } from '@/utils'

interface BillShowPageProps {
  bill: Bill
  meter: MeterWithMf
  connection: Connection
  kwhValues: BillMeterReading[]
  kvahValues: BillMeterReading[]
  kvaValues: BillMeterReading[]
  lagValues: BillMeterReading[]
  leadValues: BillMeterReading[]
  chargeHeads: ChargeHeads
  computedProperties: ComputedProperties
  totalDemandCharge: TotalDemandCharge
  totalEnergyCharge: TotalEnergyCharge
  averageAndTotalKva: { totalKva: number; averageKva: number }
  averageAndTotalKwh: { averageKwh: number; totalKwh: number }
  selfGenerationkwhValues: BillMeterReading[]
  timeZones: ComputedProperty
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
  selfGenerationkwhValues,
  timeZones,
}: BillShowPageProps) {
  const mf = meter?.meter_mf ?? 1

  return (
    <div className='flex w-full justify-center bg-white p-4'>
      <div className='w-full xl:w-[1500px]'>
        <div className='flex items-center justify-end'>
          {' '}
          <Button
            onClick={() => {
              window.open(`/pdf-download/${bill?.bill_id}`)
            }}
            label='Download'
          />
        </div>
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
            computedProperties={computedProperties}
            selfGenerationkwhValues={selfGenerationkwhValues}
            timeZones={timeZones}
          />

          {/* Final Charges */}
          <BillInvoice
            chargeHeads={chargeHeads}
            totalDemandChargeRows={totalDemandCharge}
            totalEnergyChargeRows={totalEnergyCharge}
            bill={bill}
            computedProperties={computedProperties}
            kwhValues={kwhValues}
            selfGenerationkwhValues={selfGenerationkwhValues}
          />
        </div>

        {/* Footer Outside Border */}
        <div className='border border-black text-xs'>
          <div className='border border-black'>
            <p className=''>
              1. As per Regulation 130 of Kerala Electricity Supply Code 2014 any complaint
              regarding accuracy of a bill shall be first taken up with the officer designated to
              issue the bill (Special Officer(Revenue)). For Enquiry, please contact: 0471 2514323,
              2514262.
            </p>
          </div>
          <div className='border border-black'>
            <p className=''>
              2. The connection will be disconnected without further notice, if the amount is not
              remitted on or before the DC date above.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
