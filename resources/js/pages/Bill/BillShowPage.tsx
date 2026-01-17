import MainLayout from '@/layouts/main-layout'
import { billingNavItems } from '@/components/Navbar/navitems'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Button from '@/ui/button/Button'
import { router } from '@inertiajs/react'
import { getDisplayDate, getDisplayMonthYear } from '@/utils'
import { Connection, Consumer } from '@/interfaces/data_interfaces'
import { Badge } from 'lucide-react'
import StrongText from '@/typography/StrongText'
import NormalText from '@/typography/NormalText'

interface BillShowPageProps {
  bill: any
  meter: any
  connection: Connection
  consumer: Consumer
  kwhValues: any[]
  kvahValues: any[]
  kvaValues: any[]
  lagValues: any[]
  leadValues: any[]
  chargeHeads: any
  computedProperties: any
  energyChargeRows: { energyChargeRows: any[]; subTotal: number }
}

export default function BillShowPage({
  bill,
  meter,
  connection,
  consumer,
  kwhValues,
  kvahValues,
  kvaValues,
  lagValues,
  leadValues,
  chargeHeads,
  computedProperties,
  energyChargeRows,
}: BillShowPageProps) {
  const mf = meter?.meter_mf || 1
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
        <div className='p-2 font-sans text-xs'>
          <Table className=''>
            <TableBody>
              <TableRow>
                <TableCell className='border border-black font-mono'>Cons#</TableCell>
                <TableCell className='border border-black font-bold'>
                  {connection?.consumer_number ?? '-'}
                </TableCell>
                <TableCell className='border border-black font-mono'>Bill Date</TableCell>
                <TableCell className='border border-black font-bold'>
                  {getDisplayDate(bill?.bill_date) ?? '-'}
                </TableCell>
                <TableCell className='border border-black font-mono'>Due Date</TableCell>
                <TableCell className='border border-black font-bold'>
                  {getDisplayDate(bill?.due_date) ?? '-'}
                </TableCell>
                <TableCell className='border border-black font-mono'>DC Date</TableCell>
                <TableCell className='border border-black font-bold'>
                  {getDisplayDate(bill?.dc_date) ?? '-'}
                </TableCell>
                <TableCell className='border border-black font-mono'>Bill.No</TableCell>
                <TableCell
                  colSpan={2}
                  className='border border-black font-bold'
                >
                  {bill?.bill_id ?? '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='border border-black'>LCN</TableCell>
                <TableCell className='border border-black'>
                  {connection?.consumer_legacy_code ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>Tariff</TableCell>
                <TableCell
                  colSpan={4}
                  className='border border-black'
                >
                  {connection?.tariff?.parameter_value ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>CD</TableCell>
                <TableCell className='border border-black'>
                  {' '}
                  {connection?.contract_demand_kva_val ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>BG</TableCell>
                <TableCell className='border border-black'>--</TableCell>
              </TableRow>
              {/* Address + Virtual Account + GSTIN */}
              <TableRow>
                {/* LEFT: Address (3 rows high) */}
                <TableCell
                  rowSpan={3}
                  colSpan={5}
                  className='border border-black align-top text-sm'
                >
                  {connection?.consumer_profiles?.[0]?.organization_name ?? '-'} <br />
                  {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
                    ?.address_line1 ?? '-'}
                  {', '}
                  {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
                    ?.address_line2 ?? '-'}
                  <br />
                  {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
                    ?.city_town_village ?? '-'}
                  {', '}
                  {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
                    ?.district?.name ?? '-'}
                  <br />
                  {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address?.state
                    ?.name ?? '-'}
                  {' - '}
                  {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
                    ?.pincode ?? '-'}
                  <br />
                  {connection?.consumer_profiles?.[0]?.contact_person ?? '-'}
                  {' , '}
                  Phone:{' '}
                  {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.primary_phone ?? '-'}
                </TableCell>

                {/* RIGHT: Virtual Account */}
                <TableCell
                  colSpan={6}
                  className='border border-black text-sm'
                >
                  <NormalText>Virtual Account No:</NormalText>{' '}
                  {connection?.consumer_profiles?.[0]?.virtual_account_number ?? '-'}
                </TableCell>
              </TableRow>

              <TableRow>
                {/* RIGHT: Consumer GSTIN */}
                <TableCell
                  colSpan={6}
                  className='border border-black text-sm'
                >
                  <NormalText>Consumer GSTIN:</NormalText>{' '}
                  {connection?.consumer_profiles?.[0]?.consumer_gstin ?? '-'}
                </TableCell>
              </TableRow>

              <TableRow></TableRow>
            </TableBody>
          </Table>

          {/* Arrears & Summary */}

          <Table className='border border-black text-xs'>
            <TableBody>
              {/* ───── Row 1 : Arrears + Reading Dates + Email ───── */}
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='border border-black text-center font-semibold'
                >
                  Arrears as on {getDisplayDate(bill?.arrears_date) ?? '-'}
                </TableCell>

                <TableCell
                  colSpan={3}
                  className='border border-black'
                >
                  Date of Previous Reading
                </TableCell>
                <TableCell
                  colSpan={2}
                  className='border border-black font-semibold'
                >
                  {getDisplayDate(connection?.previous_reading?.reading_start_date) ?? '-'}
                </TableCell>
                <TableCell
                  colSpan={1}
                  className='border border-black'
                >
                  {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.primary_email ?? '-'}
                </TableCell>
              </TableRow>

              {/* ───── Row 2 : Disputed / Undisputed + Present Reading + Voltage ───── */}
              <TableRow>
                <TableCell className='border border-black'>Disputed</TableCell>
                <TableCell className='border border-black text-right'>
                  {bill?.disputed_amount ?? '0'}
                </TableCell>
                <TableCell className='border border-black'>Undisputed</TableCell>
                <TableCell className='border border-black text-right'>
                  {bill?.undisputed_amount ?? '0'}
                </TableCell>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                />

                <TableCell
                  colSpan={3}
                  className='border border-black'
                >
                  Date of Present Reading
                </TableCell>
                <TableCell
                  colSpan={2}
                  className='border border-black font-semibold'
                >
                  {getDisplayDate(connection?.latest_meter_reading?.reading_start_date) ?? '-'}
                </TableCell>
                <TableCell className='flex border border-black p-0'>
                  <div className='border border-black p-1'>Supply Voltage </div>{' '}
                  <div className='border border-black p-1'>
                    {connection?.voltage?.parameter_value ?? '-'} kV{' '}
                  </div>
                  <div className='border border-black p-1'>
                    {connection?.connection_type?.parameter_value ?? '-'}{' '}
                  </div>
                </TableCell>
              </TableRow>

              {/* ───── Row 3 : Contract Demand headers + Average header + Billing Type ───── */}
              <TableRow>
                <TableCell className='border border-black text-center'>
                  Contract Demand (kVA)
                </TableCell>
                <TableCell className='border border-black text-center'>75% of CD (kVA)</TableCell>
                <TableCell className='border border-black text-center'>130% of CD (kVA)</TableCell>
                <TableCell
                  colSpan={3}
                  className='border border-black text-center'
                >
                  Connected Load (kW)
                </TableCell>

                <TableCell
                  colSpan={3}
                  className='border border-black text-center font-semibold'
                >
                  Average
                </TableCell>

                <TableCell
                  colSpan={3}
                  className='border border-black'
                >
                  Billing Type : {connection.billing_process?.parameter_value ?? '-'}
                </TableCell>
              </TableRow>

              {/* ───── Row 4 : Contract Demand values + Average values + Section ───── */}
              <TableRow>
                <TableCell className='border border-black text-center'>
                  {connection?.contract_demand_kva_val ?? '-'}
                </TableCell>
                <TableCell className='border border-black text-center'>
                  {connection?.contract_demand_kva_val
                    ? (connection.contract_demand_kva_val * 0.75).toFixed(2)
                    : '-'}
                </TableCell>
                <TableCell className='border border-black text-center'>
                  {connection?.contract_demand_kva_val
                    ? (connection.contract_demand_kva_val * 1.3).toFixed(2)
                    : '-'}
                </TableCell>
                <TableCell
                  colSpan={3}
                  className='border border-black text-center'
                >
                  {connection?.connected_load_kw_val ?? '-'}
                </TableCell>

                <TableCell className='border border-black text-center'>MD (kVA)</TableCell>
                <TableCell className='border border-black text-center'>Consumption (kWh)</TableCell>
                <TableCell className='border border-black text-center'>PF</TableCell>

                <TableCell
                  colSpan={3}
                  className='border border-black'
                >
                  Section : {connection?.service_office?.office_name ?? '-'}
                </TableCell>
              </TableRow>

              {/* ───── Row 5 : Average numbers + Circle ───── */}
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='border border-black'
                />

                <TableCell className='border border-black text-center'>
                  {kvaValues?.length
                    ? (
                        kvaValues.reduce((s, r) => s + (r?.difference ?? 0), 0) / kvaValues.length
                      ).toFixed(2)
                    : '-'}
                </TableCell>

                <TableCell className='border border-black text-center'>
                  {kwhValues?.length
                    ? kwhValues.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0)
                    : '-'}
                </TableCell>

                <TableCell className='border border-black text-center'>
                  {computedProperties?.['Power Factor']?.result ?? '-'}
                </TableCell>

                <TableCell
                  colSpan={3}
                  className='border border-black'
                >
                  Circle : {connection?.service_office?.office_name ?? '-'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Reading Details */}
          <div className='mb-4 border border-black p-3 text-xs'>
            <h3 className='mb-2 font-bold'>
              Reading Details of meter {meter?.meter_serial ?? '-'} - Working (KVA, KWh, KVAh &
              KVARh) for {bill?.reading_year_month ?? '-'}
            </h3>

            {/* kWh + kVARh */}
            <Table className='mb-3 w-full border border-black text-xs'>
              <TableHeader>
                {/* Section titles */}
                <TableRow>
                  <TableHead
                    colSpan={5}
                    className='border border-black'
                  >
                    1. Energy Consumption (kWh)
                  </TableHead>
                  <TableHead className='border border-black' />
                  <TableHead
                    colSpan={8}
                    className='border border-black'
                  >
                    3. Energy Consumption (kVARh) Lag and kVARh (Lead)
                  </TableHead>
                </TableRow>

                {/* Column headers */}
                <TableRow>
                  {/* kWh */}
                  <TableHead className='border border-black'>Zone</TableHead>
                  <TableHead className='border border-black'>FR</TableHead>
                  <TableHead className='border border-black'>IR</TableHead>
                  <TableHead className='border border-black'>MF</TableHead>
                  <TableHead className='border border-black'>Units</TableHead>

                  {/* separator */}
                  <TableHead className='border border-black' />

                  {/* kVARh Lag */}
                  <TableHead className='border border-black'>Zone</TableHead>
                  <TableHead className='border border-black'>FR</TableHead>
                  <TableHead className='border border-black'>IR</TableHead>
                  <TableHead className='border border-black'>MF</TableHead>
                  <TableHead className='border border-black'>Units</TableHead>

                  {/* kVARh Lead */}
                  <TableHead className='border border-black'>FR</TableHead>
                  <TableHead className='border border-black'>IR</TableHead>
                  <TableHead className='border border-black'>Units</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {kwhValues?.map((kwh, i) => {
                  const lag = lagValues?.[i] ?? {}
                  const lead = leadValues?.[i] ?? {}

                  return (
                    <TableRow key={i}>
                      {/* kWh */}
                      <TableCell className='border border-black'>{i + 1}</TableCell>
                      <TableCell className='border border-black'>
                        {kwh?.final_reading ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>
                        {kwh?.initial_reading ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>{mf}</TableCell>
                      <TableCell className='border border-black'>
                        {(kwh?.difference ?? 0) * mf}
                      </TableCell>

                      {/* separator */}
                      <TableCell className='border border-black' />

                      {/* kVARh Lag */}
                      <TableCell className='border border-black'>{i + 1}</TableCell>
                      <TableCell className='border border-black'>
                        {lag?.final_reading ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>
                        {lag?.initial_reading ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>{mf}</TableCell>
                      <TableCell className='border border-black'>
                        {(lag?.difference ?? 0) * mf}
                      </TableCell>

                      {/* kVARh Lead */}
                      <TableCell className='border border-black'>
                        {lead?.final_reading ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>
                        {lead?.initial_reading ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>
                        {(lead?.difference ?? 0) * mf}
                      </TableCell>
                    </TableRow>
                  )
                })}

                {/* Totals row */}
                <TableRow className='bg-gray-100 font-bold'>
                  <TableCell
                    colSpan={4}
                    className='border border-black'
                  >
                    Total
                  </TableCell>
                  <TableCell className='border border-black'>
                    {kwhValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0) ?? '-'}
                  </TableCell>

                  <TableCell className='border border-black' />

                  <TableCell
                    colSpan={4}
                    className='border border-black'
                  >
                    Total kVARh (Lag)
                  </TableCell>
                  <TableCell className='border border-black'>
                    {lagValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0) ?? '-'}
                  </TableCell>

                  <TableCell
                    colSpan={2}
                    className='border border-black'
                  >
                    Total kVARh (Lead)
                  </TableCell>
                  <TableCell className='border border-black'>
                    {leadValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0) ?? '-'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* kVAh + Demand */}
            <Table className='w-full border border-black text-xs'>
              <TableHeader>
                <TableRow>
                  <TableHead
                    colSpan={5}
                    className='border border-black'
                  >
                    2. Energy Consumption (kVAh)
                  </TableHead>
                  <TableHead className='border border-black' />
                  <TableHead
                    colSpan={4}
                    className='border border-black'
                  >
                    4. Demand (kVA)
                  </TableHead>
                </TableRow>

                <TableRow>
                  <TableHead className='border border-black'>Zone</TableHead>
                  <TableHead className='border border-black'>FR</TableHead>
                  <TableHead className='border border-black'>IR</TableHead>
                  <TableHead className='border border-black'>MF</TableHead>
                  <TableHead className='border border-black'>Units</TableHead>

                  <TableHead className='border border-black' />

                  <TableHead className='border border-black'>Reading</TableHead>
                  <TableHead className='border border-black'>MF</TableHead>
                  <TableHead className='border border-black'>Units</TableHead>
                  <TableHead className='border border-black' />
                </TableRow>
              </TableHeader>

              <TableBody>
                {kvahValues?.map((kvah, i) => {
                  const kva = kvaValues?.[i] ?? {}

                  return (
                    <TableRow key={i}>
                      <TableCell className='border border-black'>{i + 1}</TableCell>
                      <TableCell className='border border-black'>
                        {kvah?.final_reading ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>
                        {kvah?.initial_reading ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>{mf}</TableCell>
                      <TableCell className='border border-black'>
                        {(kvah?.difference ?? 0) * mf}
                      </TableCell>

                      <TableCell className='border border-black' />

                      <TableCell className='border border-black text-center'>
                        {kva?.difference ?? '-'}
                      </TableCell>
                      <TableCell className='border border-black'>{mf}</TableCell>
                      <TableCell className='border border-black'>
                        {kva?.difference ? (kva.difference * mf).toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className='border border-black' />
                    </TableRow>
                  )
                })}

                <TableRow className='bg-gray-100 font-bold'>
                  <TableCell
                    colSpan={4}
                    className='border border-black'
                  >
                    Total
                  </TableCell>
                  <TableCell className='border border-black'>
                    {kvahValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0) ?? '-'}
                  </TableCell>

                  <TableCell className='border border-black' />

                  <TableCell
                    colSpan={2}
                    className='border border-black'
                  >
                    Total
                  </TableCell>
                  <TableCell className='border border-black'>
                    {kvaValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0) ?? '-'}
                  </TableCell>
                  <TableCell className='border border-black' />
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Final Charges */}
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-8 border border-black p-2'>
              <Table className='text-xs'>
                <TableBody>
                  <TableRow className='font-bold'>
                    <TableCell colSpan={3}>Total Demand Charge</TableCell>
                    <TableCell className='text-right'>
                      {Number.isNaN(Number(chargeHeads['TOTAL DEMAND CHARGE']?.result)) ||
                      chargeHeads['TOTAL DEMAND CHARGE']?.result === null
                        ? '-'
                        : Number(chargeHeads['TOTAL DEMAND CHARGE']?.result).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className='font-bold'>
                    <TableCell colSpan={3}>2. Total Energy Charges</TableCell>
                    <TableCell className='text-right'>
                      {Number.isNaN(Number(energyChargeRows?.subTotal)) ||
                      energyChargeRows?.subTotal === null
                        ? '-'
                        : Number(energyChargeRows?.subTotal).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {energyChargeRows?.energyChargeRows?.map((row: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell
                        colSpan={3}
                        className='pl-8'
                      >
                        {String.fromCharCode(97 + i)}. {row?.label} ({row?.units} ×{' '}
                        {Number(row?.rate).toFixed(2)})
                      </TableCell>
                      <TableCell className='text-right'>{Number(row?.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>3. PF Incentive / Disincentive</TableCell>
                    <TableCell className='text-right'>
                      {Number.isNaN(
                        Number(chargeHeads['Power Factor Incentive and Disincentive']?.result)
                      ) || chargeHeads['Power Factor Incentive and Disincentive']?.result === null
                        ? '-'
                        : Number(
                            chargeHeads['Power Factor Incentive and Disincentive']?.result
                          ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className='bg-gray-100 font-bold'>
                    <TableCell colSpan={3}>Total (add 1 to 9)</TableCell>
                    <TableCell className='text-right'>
                      {Number.isNaN(
                        Number(chargeHeads['ENERGY CHARGE']?.result ?? 0) +
                          Number(chargeHeads['TOTAL DEMAND CHARGE']?.result ?? 0) +
                          Number(
                            chargeHeads['Power Factor Incentive and Disincentive']?.result ?? 0
                          )
                      ) || chargeHeads['Power Factor Incentive and Disincentive']?.result === null
                        ? '-'
                        : (
                            Number(chargeHeads['ENERGY CHARGE']?.result ?? 0) +
                            Number(chargeHeads['TOTAL DEMAND CHARGE']?.result ?? 0) +
                            Number(
                              chargeHeads['Power Factor Incentive and Disincentive']?.result ?? 0
                            )
                          ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className='col-span-4 border border-black p-2'>
              <Table className='text-xs'>
                <TableBody>
                  <TableRow>
                    <TableCell>Monthly Fuel Surcharge</TableCell>
                    <TableCell className='text-right'>
                      {Number.isNaN(Number(chargeHeads['Monthly Fuel Surcharge']?.result ?? 0)) ||
                      chargeHeads['Monthly Fuel Surcharge']?.result === null
                        ? '-'
                        : Number(chargeHeads['Monthly Fuel Surcharge']?.result ?? 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Electricity Duty</TableCell>
                    <TableCell className='text-right'>
                      {Number.isNaN(Number(chargeHeads['Electricity Duty']?.result ?? 0)) ||
                      chargeHeads['Electricity Duty']?.result === null
                        ? '-'
                        : Number(chargeHeads['Electricity Duty']?.result ?? 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ele. Surcharge</TableCell>
                    <TableCell className='text-right'>
                      {Number.isNaN(Number(chargeHeads['Electricity Surcharge']?.result ?? 0)) ||
                      chargeHeads['Electricity Surcharge']?.result === null
                        ? '-'
                        : Number(chargeHeads['Electricity Surcharge']?.result ?? 0).toFixed(2)}
                    </TableCell>
                  </TableRow>

                  <TableRow className='bg-gray-100 font-bold'>
                    <TableCell>Net Payable</TableCell>
                    <TableCell className='text-right text-base'>
                      {Number.isNaN(Number(bill?.bill_amount ?? 0)) || bill?.bill_amount === null
                        ? '-'
                        : Number(bill?.bill_amount ?? 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

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
