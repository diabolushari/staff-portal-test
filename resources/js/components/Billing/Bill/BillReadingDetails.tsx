import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BillMeterReading, ComputedProperties, MeterWithMf } from '@/interfaces/bill_pdf_interfaces'
import { Bill } from '@/interfaces/data_interfaces'
import { getDisplayMonthYear } from '@/utils'

interface BillReadingDetailsProps {
  bill: Bill
  meter: MeterWithMf
  kwhValues: BillMeterReading[]
  kvahValues: BillMeterReading[]
  kvaValues: BillMeterReading[]
  lagValues: BillMeterReading[]
  leadValues: BillMeterReading[]
  computedProperties: ComputedProperties
  selfGenerationkwhValues: BillMeterReading[]
}

export default function BillReadingDetails({
  bill,
  meter,
  kwhValues,
  kvahValues,
  kvaValues,
  lagValues,
  leadValues,
  computedProperties,
  selfGenerationkwhValues,
}: Readonly<BillReadingDetailsProps>) {
  const mf = meter?.meter_mf ?? 1
  console.log(kwhValues)
  return (
    <div className='mb-4 border border-black p-3 text-xs'>
      <div className='mb-2 flex items-center justify-center'>
        <h3 className='font-bold'>
          Reading Details of meter {meter?.meter?.meter_serial ?? '-'} - Working (KVA, KWh, KVAh &
          KVARh) for {getDisplayMonthYear(bill?.reading_year_month) ?? '-'}
        </h3>
      </div>

      {/* kWh + kVARh */}
      <div className='grid grid-cols-2'>
        <Table className='mb-3 w-full border border-black text-xs'>
          <TableHeader>
            {/* SECTION TITLES */}
            <TableRow>
              <TableHead
                colSpan={12}
                className='border border-black text-center font-bold'
              >
                1. Energy Consumption (kWh)
              </TableHead>
            </TableRow>

            {/* COLUMN HEADERS */}
            <TableRow>
              {/* kWh (LEFT HALF) */}
              <TableHead
                colSpan={2}
                className='border border-black'
              >
                Zone
              </TableHead>
              <TableHead
                colSpan={3}
                className='border border-black'
              >
                FR
              </TableHead>
              <TableHead
                colSpan={3}
                className='border border-black'
              >
                IR
              </TableHead>
              <TableHead
                colSpan={2}
                className='border border-black'
              >
                MF
              </TableHead>
              <TableHead
                colSpan={2}
                className='border border-black'
              >
                Units
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kwhValues?.map((kwh, i) => {
              return (
                <TableRow key={i}>
                  {/* kWh */}
                  <TableCell
                    colSpan={2}
                    className='border border-black text-center'
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    className='border border-black text-right'
                  >
                    {kwh?.final_reading ?? 0}
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    className='border border-black text-right'
                  >
                    {kwh?.initial_reading ?? 0}
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className='border border-black text-center'
                  >
                    {kwh?.meter_mf}
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className='border border-black text-right'
                  >
                    {kwh.value}
                  </TableCell>

                  {/* kVARh LAG */}
                </TableRow>
              )
            })}

            {/* TOTAL ROW */}
            <TableRow className='bg-gray-100 font-bold'>
              {/* kWh total */}
              <TableCell
                colSpan={10}
                className='border border-black text-right'
              >
                Total
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                {kwhValues?.reduce((s, r) => s + (r?.value ?? 0), 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className='p-0'>
          <TableHeader>
            {/* SECTION TITLES */}
            <TableRow>
              <TableHead
                colSpan={4}
                className='border border-black text-center font-bold'
              >
                3. Energy Consumption (kVARh) Lag &
              </TableHead>
              <TableHead
                colSpan={4}
                className='border border-black text-center font-bold'
              >
                Consumption (kVARh) Lead
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className='border border-black'>Zone</TableHead>
              <TableHead className='border border-black'>FR</TableHead>
              <TableHead className='border border-black'>IR</TableHead>
              <TableHead className='border border-black'>MF</TableHead>
              <TableHead className='border border-black'>Units</TableHead>

              {/* kVARh LEAD (1/3 of right half) */}
              <TableHead className='border border-black'>FR</TableHead>
              <TableHead className='border border-black'>IR</TableHead>
              <TableHead className='border border-black'>Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lagValues?.map((lag, i) => {
              const lead = leadValues?.[i] ?? {}
              return (
                <TableRow key={i}>
                  <TableCell className='border border-black'>{i + 1}</TableCell>
                  <TableCell className='border border-black'>{lag?.final_reading ?? 0}</TableCell>
                  <TableCell className='border border-black'>{lag?.initial_reading ?? 0}</TableCell>
                  <TableCell className='border border-black'>{lag?.meter_mf}</TableCell>
                  <TableCell className='border border-black text-right'>
                    {lag?.value ?? 0}
                  </TableCell>

                  {/* kVARh LEAD */}
                  <TableCell className='border border-black text-right'>
                    {lead?.final_reading ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {lead?.initial_reading ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {lead?.value ?? 0}
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow>
              {/* kVARh Lag total */}
              <TableCell
                colSpan={4}
                className='border border-black text-right'
              >
                Total kVARh (Lag)
              </TableCell>
              <TableCell className='border border-black text-right'>
                {lagValues?.reduce((s, r) => s + (r?.value ?? 0), 0)}
              </TableCell>

              {/* kVARh Lead total */}
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                Total kVARh (Lead)
              </TableCell>
              <TableCell
                colSpan={3}
                className='border border-black text-right'
              >
                {leadValues?.reduce((s, r) => s + (r?.value ?? 0), 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* kVAh + Demand */}
      <div className='grid grid-cols-2'>
        <Table className='w-full border border-black text-xs'>
          <TableHeader>
            <TableRow>
              <TableHead
                colSpan={5}
                className='border border-black font-bold'
              >
                2. Energy Consumption (kVAh)
              </TableHead>
            </TableRow>

            <TableRow>
              <TableHead className='border border-black'>Zone</TableHead>
              <TableHead className='border border-black'>FR</TableHead>
              <TableHead className='border border-black'>IR</TableHead>
              <TableHead className='border border-black'>MF</TableHead>
              <TableHead className='border border-black'>Units</TableHead>
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
                  <TableCell className='border border-black'>{kvah?.meter_mf}</TableCell>
                  <TableCell className='border border-black'>{kvah?.value ?? 0}</TableCell>
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
                {kvahValues?.reduce((s, r) => s + (r?.value ?? 0), 0) ?? '-'}
              </TableCell>
            </TableRow>
            <TableRow className='bg-gray-100'>
              <TableCell
                colSpan={3}
                className='border border-black'
              >
                Ave.PF=KWh/KVAh
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                {Number(computedProperties?.power_factor?.result).toFixed(2) ?? '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className='border border-black text-xs'>
          <TableHeader>
            <TableRow>
              <TableHead
                colSpan={0}
                className='border border-black font-bold'
              >
                4. Demand (kVA)
              </TableHead>
              <TableHead className='border border-black'>Readings</TableHead>
              <TableHead className='border border-black'>MF</TableHead>
              <TableHead className='border border-black'>Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kvaValues?.map((kva, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className='border border-black'>{i + 1}</TableCell>
                  <TableCell className='border border-black text-center'>
                    {kva?.final_reading ?? '-'}
                  </TableCell>
                  <TableCell className='border border-black'>{kva.meter_mf}</TableCell>
                  <TableCell className='border border-black'>{kva.value.toFixed(2) ?? 0}</TableCell>
                </TableRow>
              )
            })}
            <TableRow className='bg-gray-100'>
              <TableCell
                colSpan={2}
                className='border border-black font-bold'
              >
                5. Factory lighting
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                {Number(computedProperties.total_consumption_factory_lighting.result).toFixed(2) ??
                  '-'}
              </TableCell>
            </TableRow>
            <TableRow className='bg-gray-100'>
              <TableCell
                colSpan={2}
                className='border border-black font-bold'
              >
                6. Colony lighting
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                {Number(computedProperties.total_consumption_colony_lighting.result).toFixed(2) ??
                  '-'}
              </TableCell>
            </TableRow>
            <TableRow className='bg-gray-100'>
              <TableCell
                colSpan={2}
                className='border border-black font-bold'
              >
                7. Generator
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                {selfGenerationkwhValues?.reduce((s, r) => s + (r?.value ?? 0), 0).toFixed(2) ??
                  '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
