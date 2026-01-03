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
import { getDisplayDate } from '@/utils'
import { Connection } from '@/interfaces/data_interfaces'

interface BillShowPageProps {
  bill: any
  meter: any
  connection: Connection
  consumer: any
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
      title='HT Bill - Demand cum Disconnection Notice'
      breadcrumb={[]}
      leftBarTitle='Billing'
      selectedItem='Bill Details'
    >
      <div className='bg-white'>
        <div>
          <Button
            onClick={() => {
              window.open(`/pdf-download/${bill?.bill_id}`)
            }}
            label='Download'
          />
        </div>
        {/* Main Bill Container - Like Original PDF */}
        <div className='p-2 font-sans text-xs'>
          {/* Header */}

          {/* Top Info - 65/35 Split */}
          <div className='mb-4 grid grid-cols-12 gap-4 text-xs'>
            <div className='col-span-8'>
              <Table className=''>
                <TableBody>
                  <TableRow>
                    <TableCell className='w-24 font-bold'>Cons#</TableCell>
                    <TableCell className='font-mono'>{connection?.consumer_number}</TableCell>
                    <TableCell className='w-24 font-bold'>Bill Date</TableCell>
                    <TableCell>{getDisplayDate(bill?.bill_date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-bold'>Due Date</TableCell>
                    <TableCell>{getDisplayDate(bill?.due_date)}</TableCell>
                    <TableCell className='font-bold'>DC Date</TableCell>
                    <TableCell>{getDisplayDate(bill?.dc_date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-bold'>LCN</TableCell>
                    <TableCell>{connection?.consumer_legacy_code}</TableCell>
                    <TableCell className='font-bold'>Tariff</TableCell>
                    <TableCell>{connection?.tariff?.parameter_value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      rowSpan={4}
                      className='align-top text-sm font-bold'
                    >
                      {connection?.consumer_profiles?.[0]?.organization_name ?? '-'}
                      <br />
                      {connection?.consumer_profiles?.[0]?.contact_person ?? '-'}
                      <br />
                    </TableCell>
                    <TableCell className='font-bold'>Bill.No</TableCell>
                    <TableCell
                      colSpan={2}
                      className='font-mono'
                    >
                      {bill?.bill_id}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-bold'>CD</TableCell>
                    <TableCell>{connection?.contract_demand_kva_val}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-bold'>Ver</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-bold'>BG</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className='col-span-4'>
              <Table className='border border-black text-xs'>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      colSpan={2}
                      className='text-center font-bold'
                    >
                      Bank / GST
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className='font-bold'>Virtual A/c No</TableCell>
                    <TableCell>
                      {connection?.consumer_profiles?.[0]?.virtual_account_number}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-bold'>GSTIN</TableCell>
                    <TableCell>{connection?.consumer_profiles?.[0]?.consumer_gstin}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className='text-center italic'
                    >
                      Email:
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-bold'>Supply Voltage</TableCell>
                    <TableCell>{connection?.voltage?.parameter_value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-bold'>Billing Type</TableCell>
                    <TableCell>{connection?.billing_process?.parameter_value}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Arrears & Summary */}
          <div className='mb-4 border border-black p-2'>
            <Table className='border border-black text-xs'>
              <TableHeader>
                <TableRow>
                  <TableHead>Arrears</TableHead>
                  <TableHead>Date of Previous Reading</TableHead>
                  <TableHead>Date of Present Reading</TableHead>
                  <TableHead>Average MD (kVA)</TableHead>
                  <TableHead>Consumption (kWh)</TableHead>
                  <TableHead>PF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Disputed: 0 | Undisputed: 115</TableCell>
                  <TableCell>31-Aug-2025</TableCell>
                  <TableCell>
                    {getDisplayDate(connection?.latest_meter_reading?.metering_date) ?? '---'}
                  </TableCell>
                  <TableCell className='text-center'>
                    {kvaValues
                      ?.reduce((s, r) => s + (r?.difference ?? 0) / kvaValues.length, 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell className='text-center'>
                    {kwhValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0)}
                  </TableCell>
                  <TableCell className='text-center'>
                    {computedProperties?.['Power Factor']?.result ?? '--'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    Contract Demand (kVA): {connection?.contract_demand_kva_val ?? '--'}{' '}
                    {connection?.contract_demand_kva_val
                      ? (connection.contract_demand_kva_val * 0.75).toFixed(1)
                      : '--'}
                    {connection?.contract_demand_kva_val
                      ? (connection.contract_demand_kva_val * 1.3).toFixed(1)
                      : '--'}
                  </TableCell>
                  <TableCell colSpan={4}>
                    Connected Load (kW): {connection?.connected_load_kw_val ?? '--'} | Section: -- |
                    Circle: --
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Reading Details */}
          <div className='mb-4 border border-black p-3 text-xs'>
            <h3 className='mb-2 font-bold'>
              Reading Details of meter {meter?.meter_serial} - Working (KVA, KWh, KVAh & KVARh) for{' '}
              {bill?.reading_year_month}
            </h3>

            {/* kWh + kVARh */}
            <Table className='mb-3 border border-black'>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={6}>1. Energy Consumption (kWh)</TableHead>
                  <TableHead colSpan={8}>
                    3. Energy Consumption (KVARh) Lag and kVARh (Lead)
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>FR</TableHead>
                  <TableHead>IR</TableHead>
                  <TableHead>MF</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>FR</TableHead>
                  <TableHead>IR</TableHead>
                  <TableHead>MF</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>FR</TableHead>
                  <TableHead>IR</TableHead>
                  <TableHead>Units</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kwhValues?.map((kwh, i) => {
                  const lag = lagValues[i] || {}
                  const lead = leadValues[i] || {}
                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{kwh?.final_reading}</TableCell>
                      <TableCell>{kwh?.initial_reading}</TableCell>
                      <TableCell>{mf}</TableCell>
                      <TableCell className='text-right'>{(kwh?.difference ?? 0) * mf}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{lag?.initial_reading || '-'}</TableCell>
                      <TableCell>{lag?.final_reading || '-'}</TableCell>
                      <TableCell>{mf}</TableCell>
                      <TableCell className='text-right'>{(lag?.difference ?? 0) * mf}</TableCell>
                      <TableCell>{lead?.initial_reading || ''}</TableCell>
                      <TableCell>{lead?.final_reading || ''}</TableCell>
                      <TableCell className='text-right'>{(lead.difference || 0) * mf}</TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className='bg-gray-100 font-bold'>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className='text-right'>
                    {kwhValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell colSpan={4}>Total kVARh (Lag)</TableCell>
                  <TableCell className='text-right'>
                    {lagValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0)}
                  </TableCell>
                  <TableCell colSpan={2}>Total kVARh (Lead)</TableCell>
                  <TableCell>
                    {leadValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* kVAh + Demand */}
            <Table className='border border-black'>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={6}>2. Energy Consumption (KVAh)</TableHead>
                  <TableHead colSpan={4}>4. Demand (KVA) Readings</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>FR</TableHead>
                  <TableHead>IR</TableHead>
                  <TableHead>MF</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Reading</TableHead>
                  <TableHead>MF</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kvahValues?.map((kvah, i) => {
                  const kva = kvaValues[i] || {}
                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{kvah?.initial_reading ?? '--'}</TableCell>
                      <TableCell>{kvah?.final_reading ?? '--'}</TableCell>
                      <TableCell>{mf}</TableCell>
                      <TableCell className='text-right'>
                        {kvah?.difference ? (kvah?.difference * mf).toFixed(0) : '--'}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className='text-center'>
                        {kva?.difference ? kva.difference : '-'}
                      </TableCell>
                      <TableCell>{mf}</TableCell>
                      <TableCell className='text-right'>
                        {kva?.difference ? (kva.difference * mf).toFixed(1) : '-'}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className='bg-gray-100 font-bold'>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className='text-right'>
                    {kvahValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className='text-right'>
                    {kvaValues?.reduce((s, r) => s + (r?.difference ?? 0) * mf, 0).toFixed(1)}
                  </TableCell>
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
                      {Number(chargeHeads['TOTAL DEMAND CHARGE']?.result).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className='font-bold'>
                    <TableCell colSpan={3}>2. Total Energy Charges</TableCell>
                    <TableCell className='text-right'>
                      {Number(energyChargeRows?.subTotal).toFixed(2)}
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
                      {Number(
                        chargeHeads['Power Factor Incentive and Disincentive']?.result
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className='bg-gray-100 font-bold'>
                    <TableCell colSpan={3}>Total (add 1 to 9)</TableCell>
                    <TableCell className='text-right'>
                      {(
                        Number(chargeHeads['ENERGY CHARGE']?.result ?? 0) +
                        Number(chargeHeads['TOTAL DEMAND CHARGE']?.result ?? 0) +
                        Number(chargeHeads['Power Factor Incentive and Disincentive']?.result ?? 0)
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
                      {Number(chargeHeads['Monthly Fuel Surcharge']?.result ?? 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Electricity Duty</TableCell>
                    <TableCell className='text-right'>
                      {Number(chargeHeads['Electricity Duty']?.result ?? 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ele. Surcharge</TableCell>
                    <TableCell className='text-right'>
                      {Number(chargeHeads['Electricity Surcharge']?.result ?? 0).toFixed(2)}
                    </TableCell>
                  </TableRow>

                  <TableRow className='bg-gray-100 font-bold'>
                    <TableCell>Net Payable</TableCell>
                    <TableCell className='text-right text-base'>{bill?.bill_amount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className='mt-6 text-center italic'>
            (Rupees One Lakh Seventeen Thousand Eight Hundred Thirty Nine Only)
          </div>

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
                  <span className='font-mono'>{connection?.consumer_number}</span>
                </TableCell>
                <TableCell>
                  <strong>Bill No:</strong> <span className='font-mono'>{bill?.bill_id}</span>
                </TableCell>
                <TableCell>
                  <strong>Rs:</strong> <span className='font-mono'>{bill?.bill_amount}</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  )
}
