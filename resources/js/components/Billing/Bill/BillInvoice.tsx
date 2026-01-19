import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChargeHeads } from '@/interfaces/bill_pdf_interfaces'
import StrongText from '@/typography/StrongText'

export default function BillInvoice({ chargeHeads }: { chargeHeads: ChargeHeads }) {
  return (
    <>
      <div className='flex items-center justify-center border border-black'>
        <StrongText className='text-lg'>Invoice</StrongText>
      </div>
      <div className='grid grid-cols-3'>
        <div className='col-span-2'>
          <Table>
            <TableHeader>
              <TableRow className='p-0'>
                <TableHead
                  className='border border-black'
                  colSpan={2}
                />
                <TableHead className='border border-black text-right'>Units</TableHead>
                <TableHead className='border border-black text-right'>Rate</TableHead>
                <TableHead className='border border-black text-right'>Amount(Rs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='border border-black'
                >
                  1.Total Demand Charge
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  Timezone
                </TableCell>
                <TableCell className='border border-black'>Unit</TableCell>
                <TableCell className='border border-black'>Rate</TableCell>
                <TableCell className='border border-black'>Amount(Rs)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black font-bold'
                  colSpan={4}
                >
                  Sub Total(a+b+c+d+e+f)
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(Number(chargeHeads.total_demand_charge.result)) ||
                  chargeHeads.total_demand_charge.result === null
                    ? '-'
                    : Number(chargeHeads.total_demand_charge.result).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='border border-black'
                >
                  2.Total Energy Charges
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  Timezone
                </TableCell>
                <TableCell className='border border-black'>Unit</TableCell>
                <TableCell className='border border-black'>Rate</TableCell>
                <TableCell className='border border-black'>Amount(Rs)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black font-bold'
                  colSpan={4}
                >
                  Sub Total(a+b+c)
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(Number(chargeHeads.energy_charge.result)) ||
                  chargeHeads.energy_charge.result === null
                    ? '-'
                    : Number(chargeHeads.energy_charge.result).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black'
                  colSpan={4}
                >
                  3. PF Incentive / Disincentive
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(
                    Number(chargeHeads.power_factor_incentive_and_disincentive.result)
                  ) || chargeHeads.power_factor_incentive_and_disincentive.result === null
                    ? '-'
                    : Number(chargeHeads.power_factor_incentive_and_disincentive.result).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black font-bold'
                  colSpan={4}
                >
                  Total Energy Charge
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(Number(chargeHeads.energy_charge.result)) ||
                  chargeHeads.energy_charge.result === null
                    ? '-'
                    : Number(chargeHeads.energy_charge.result).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='border border-black'
                >
                  4.Energy Charges on Lighting load
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  a.Factory lighting
                </TableCell>
                <TableCell className='border border-black'>-</TableCell>
                <TableCell className='border border-black'>-</TableCell>
                <TableCell className='border border-black'>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  b. Colony lighting
                </TableCell>
                <TableCell className='border border-black'>-</TableCell>
                <TableCell className='border border-black'>-</TableCell>
                <TableCell className='border border-black'>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black font-bold'
                  colSpan={4}
                >
                  Sub Total(a+b)
                </TableCell>
                <TableCell className='border border-black text-right'>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  5. Electricity Duty
                </TableCell>
                <TableCell className='border border-black'>Unit</TableCell>
                <TableCell className='border border-black'>Rate</TableCell>
                <TableCell className='border border-black'>Amount(Rs)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  6.Ele. Surcharge(*)
                </TableCell>
                <TableCell className='border border-black'>Unit</TableCell>
                <TableCell className='border border-black'>Rate</TableCell>
                <TableCell className='border border-black'>Amount(Rs)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  7. Duty On Self Generated Energy
                </TableCell>
                <TableCell className='border border-black'>Unit</TableCell>
                <TableCell className='border border-black'>Rate</TableCell>
                <TableCell className='border border-black'>Amount(Rs)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black'
                  colSpan={4}
                >
                  8.Penalty for non-segn. of light load
                </TableCell>
                <TableCell className='border border-black text-right'>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <Table className='w-full border border-black text-xs'>
          <TableHeader>
            <TableRow>
              <TableHead
                colSpan={2}
                className='border border-black'
              />
              <TableHead className='border border-black text-right'>Amount (Rs)</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* 9. Other Charges */}
            <TableRow>
              <TableCell
                colSpan={3}
                className='border border-black font-bold'
              >
                9. Other Charges
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                Reconnection Fee
              </TableCell>
              <TableCell className='border border-black text-right'>0.00</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                Charges for Belated Payments
              </TableCell>
              <TableCell className='border border-black text-right'>1587.00</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                LOW_VOLT_SUR
              </TableCell>
              <TableCell className='border border-black text-right'>117705.00</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                Monthly Fuel Surcharge
              </TableCell>
              <TableCell className='border border-black text-right'>0.00</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                Green Energy Charge
              </TableCell>
              <TableCell className='border border-black text-right'>14622.30</TableCell>
            </TableRow>

            {/* Spacer rows like printed bill */}
            <TableRow>
              <TableCell
                colSpan={3}
                className='h-6 border border-black'
              />
            </TableRow>

            {/* 10. Total */}
            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black font-bold'
              >
                10. Total (add 1 to 9)
              </TableCell>
              <TableCell className='border border-black text-right font-bold'>334125.93</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                Plus / Minus (Round off)
              </TableCell>
              <TableCell className='border border-black text-right'>0.07</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                UnDisputed Arr Amount
              </TableCell>
              <TableCell className='border border-black text-right'>1096.00</TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                ACD_FY Assessment
              </TableCell>
              <TableCell className='border border-black text-right'>0.00</TableCell>
            </TableRow>

            {/* Less section */}
            <TableRow>
              <TableCell
                rowSpan={3}
                className='border border-black align-top'
              >
                Less
              </TableCell>
              <TableCell className='border border-black'>1. Advance / Credit</TableCell>
              <TableCell className='border border-black text-right'>0.00</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='border border-black'>2. CD Interest</TableCell>
              <TableCell className='border border-black text-right'>0.00</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='border border-black'>3. CD / Oth Ref</TableCell>
              <TableCell className='border border-black text-right'>0.00</TableCell>
            </TableRow>

            {/* Net Payable */}
            <TableRow className='text-base font-bold'>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                Net Payable
              </TableCell>
              <TableCell className='border border-black text-right'>335222.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  )
}
