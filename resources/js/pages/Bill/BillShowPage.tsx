import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import CustomCard from '@/ui/Card/CustomCard'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
} from '@/components/ui/table'

interface BillShowPageProps {
  bill: any
}

export default function BillShowPage({ bill }: BillShowPageProps) {
  return (
    <MainLayout
      navItems={billingNavItems}
      title='Bill Summary'
      breadcrumb={[]}
      leftBarTitle='Billing'
      selectedItem='Billing Cycles'
    >
      {/* ================= Summary ================ */}
      <CustomCard>
        <div className='grid grid-cols-2 gap-4 p-3 text-sm'>
          <div>
            <strong>Bill ID:</strong> {bill?.bill_id}
          </div>
          <div>
            <strong>Bill Date:</strong> {bill?.bill_date}
          </div>
          <div>
            <strong>Bill Month:</strong> {bill?.bill_year_month}
          </div>
          <div>
            <strong>Total Bill Amount:</strong> ₹{Number(bill?.bill_amount).toLocaleString()}
          </div>
        </div>
      </CustomCard>

      {/* ================= CHARGE HEADS ================ */}
      <CustomCard title='Charge Heads'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bill?.charge_heads?.map((item: any, idx: number) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item?.name}</TableCell>
                <TableCell>₹{Number(item?.results?.[0]?.result || 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomCard>

      {/* ================= COMPUTED PROPERTIES ================ */}
      <CustomCard title='Computed Properties'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Values</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bill?.computed_properties?.map((item: any, idx: number) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item?.name}</TableCell>
                <TableCell>
                  {item?.results?.length > 1 ? (
                    // Multiple zone values
                    <div className='space-y-1'>
                      {item?.results?.map((r: any, i: number) => (
                        <div
                          key={i}
                          className='flex items-center gap-2 text-[13px]'
                        >
                          <span className='rounded-md bg-gray-200 px-2 py-0.5 text-gray-700'>
                            Zone {r.zoneId}
                          </span>
                          <span>₹{Number(r.result).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Single value case
                    <span>
                      {item?.results?.[0]?.result
                        ? `₹${Number(item?.results?.[0]?.result).toLocaleString()}`
                        : '-'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomCard>
    </MainLayout>
  )
}
