import { router } from "@inertiajs/react";
import { TabsContent } from "@radix-ui/react-tabs";
import { Edit, Trash2 } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { meterNavItems } from "@/components/Navbar/navitems";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useInertiaPost from "@/hooks/useInertiaPost";
import MainLayout from "@/layouts/main-layout";
import type { BreadcrumbItem } from "@/types";
import Button from "@/ui/button/Button";
import { TabGroup } from "@/ui/Tabs/TabGroup";

// --- PROPS AND INTERFACES ---
interface ParameterValue {
  id: number
  parameterValue: string
}
export const MeterTabs = (meterId: number, ctptId?: number, relId?: number) => [
  {
    value: 'details',
    label: 'Meter Details',
    href: route('meters.show', meterId),
  },
  {
    value: 'meter-ctpt',
    label: 'Meter CTPT',
    href: ctptId ? route('meter-ctpt.show', ctptId) : undefined,
  },
  {
    value: 'meter-ctpt-rel',
    label: 'Meter CTPT Relations',
    href: relId ? route('meter-ctpt-rel.show', relId) : undefined,
  },
]

interface Props {
  meter: Meter
  rel?: any
  currentTimezone: any
  timezoneTypes: ParameterValue[]
}

interface StoreForm {
  meter_id: number
  timezone_type_id: string
}

interface UpdateForm {
  rel_id: number
  timezone_type_id: string
  _method: 'PUT'
}

// --- HELPER COMPONENT: InfoItem ---
const InfoItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div className='flex flex-col gap-1'>
    <Label className='text-sm font-medium text-gray-500'>{label}</Label>
    <p className='text-base text-gray-800'>{value ?? '-'}</p>
  </div>
)

// --- HELPER COMPONENT: Section ---
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className='py-6'>
    <h3 className='mb-6 text-lg font-semibold text-gray-700'>{title}</h3>
    <div className='grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3'>{children}</div>
  </div>
)

// --- MAIN COMPONENT: MeterShow ---
export default function MeterShow({ meter, currentTimezone, timezoneTypes, rel }: Readonly<Props>) {
  // --- STATE AND DATA NORMALIZATION ---
  const [isEditing, setIsEditing] = useState(false)

  const currentTzId = useMemo<string | undefined>(
    () =>
      String(currentTimezone?.timezone_type_id ?? currentTimezone?.timezone_type?.id ?? '') ||
      undefined,
    [currentTimezone]
  )

  const currentTzLabel = useMemo<string | undefined>(
    () => currentTimezone?.timezone_type?.parameter_value ?? undefined,
    [currentTimezone]
  )

  const [selectedTimezone, setSelectedTimezone] = useState<string | undefined>(currentTzId)

  // --- FORM AND API HANDLING ---
  const isUpdate = !!(currentTimezone as any)?.rel_id
  const url = isUpdate
    ? route('meter-timezone-rel.update', {
        meter_timezone_rel: (currentTimezone as any).rel_id,
      })
    : route('meter-timezone-rel.store')

  const { post, loading } = useInertiaPost<StoreForm | UpdateForm>(url, {
    onSuccess: () => setIsEditing(false),
  })

  // --- BREADCRUMBS AND FORMATTERS ---
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Meters', href: route('meters.index') },
    { title: meter.meter_serial, href: route('meters.show', meter.meter_id) },
  ]

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // --- EVENT HANDLERS ---
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this meter?')) {
      router.delete(route('meters.destroy', meter.meter_id))
    }
  }

  const handleSave = () => {
    if (!selectedTimezone) return

    const commonData = {
      meter_id: meter.meter_id,
      timezone_type_id: selectedTimezone,
    }

    if (isUpdate) {
      post({
        ...commonData,
        rel_id: currentTimezone.rel_id,
        _method: 'PUT',
      })
    } else {
      post(commonData)
    }
  }

  const handleCancel = () => {
    setSelectedTimezone(currentTzId)
    setIsEditing(false)
  }

  // --- RENDER LOGIC ---
  const otherTimezoneOptions = useMemo(
    () => timezoneTypes.filter((t) => String(t.id) !== currentTzId),
    [timezoneTypes, currentTzId]
  )

  const tabs = MeterTabs (meter.meter_id, rel?.ctpt_id, rel?.version_id)

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterNavItems}
    >
      <TabGroup tabs={tabs}>
        <TabsContent value='details'>
          <div className='container mx-auto py-8'>
            {/* Header */}
            <div className='mb-8 flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-gray-800'>{meter.meter_serial}</h1>
                <p className='text-gray-500'>Meter Details</p>
              </div>
              <Button
                label='Delete Meter'
                onClick={handleDelete}
                variant='destructive'
                disabled={loading}
                icon={<Trash2 className='mr-2 h-4 w-4' />}
              />
            </div>

						{/* Main Card */}
						<Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
							<CardContent className="p-8">
								{/* General Information */}
								<Section title="General Information">
									<InfoItem label="Meter Serial" value={meter.meter_serial} />
									<InfoItem
										label="Ownership"
										value={pv(meter.ownership_type)}
									/>
									<InfoItem label="Make" value={pv(meter.meter_make)} />
									<InfoItem label="Type" value={pv(meter.meter_type)} />
									<InfoItem label="Category" value={pv(meter.meter_category)} />
									<InfoItem label="Unit" value={pv(meter.meter_unit)} />
									<InfoItem label="Batch Code" value={meter.batch_code} />
								</Section>

								<Separator className="my-6" />

								{/* Technical Specifications */}
								<Section title="Technical Specifications">
									<InfoItem
										label="Accuracy Class"
										value={pv(meter.accuracy_class)}
									/>
									<InfoItem
										label="Dialing Factor"
										value={pv(meter.dialing_factor)}
									/>
									<InfoItem label="Digit Count" value={meter.digit_count} />
									<InfoItem
										label="Decimal Digit Count"
										value={meter.decimal_digit_count}
									/>
									<InfoItem
										label="Programmable PT Ratio"
										value={meter.programmable_pt_ratio}
									/>
									<InfoItem
										label="Programmable CT Ratio"
										value={meter.programmable_ct_ratio}
									/>
									<InfoItem label="Meter MF" value={meter.meter_mf} />
									<InfoItem
										label="Meter Constant"
										value={meter.meter_constant}
									/>
									<InfoItem
										label="Company Seal No."
										value={meter.company_seal_num}
									/>
									<InfoItem
										label="Reset Type"
										value={pv(meter.meter_reset_type)}
									/>
									<InfoItem label="Smart Meter" value={meter.smart_meter_ind} />
									<InfoItem
										label="Bidirectional"
										value={meter.bidirectional_ind}
									/>
									<InfoItem label="Phase" value={pv(meter.meter_phase)} />
									<InfoItem
										label="Warranty Period (months)"
										value={meter.warranty_period}
									/>
								</Section>

								<Separator className="my-6" />

								{/* Internal CT/PT (proto optional numbers) */}
								<Section title="Internal CT/PT">
									<InfoItem
										label="Internal CT Primary"
										value={meter.internal_ct_primary}
									/>
									<InfoItem
										label="Internal CT Secondary"
										value={meter.internal_ct_secondary}
									/>
									<InfoItem
										label="Internal PT Primary"
										value={meter.internal_pt_primary}
									/>
									<InfoItem
										label="Internal PT Secondary"
										value={meter.internal_pt_secondary}
									/>
								</Section>

								<Separator className="my-6" />

								{/* Timezone Information */}
								<div className="py-6">
									<div className="mb-6 flex items-center justify-between">
										<h3 className="text-lg font-semibold text-gray-700">
											Timezone Information
										</h3>
										{!isEditing && (
											<Button
												label="Edit"
												onClick={() => setIsEditing(true)}
												variant="outline"
												disabled={loading}
												icon={<Edit className="mr-2 h-4 w-4" />}
											/>
										)}
									</div>

									{isEditing ? (
										<div className="rounded-lg border bg-gray-50 p-6">
											<div className="max-w-sm space-y-2">
												<Label htmlFor="timezone-select">Timezone Type</Label>
												<Select
													value={selectedTimezone}
													onValueChange={setSelectedTimezone}
												>
													<SelectTrigger id="timezone-select">
														<SelectValue placeholder="Select a timezone..." />
													</SelectTrigger>
													<SelectContent>
														{currentTzId && currentTzLabel && (
															<SelectItem value={currentTzId}>
																{currentTzLabel}
															</SelectItem>
														)}
														{otherTimezoneOptions.map((type) => (
															<SelectItem key={type.id} value={String(type.id)}>
																{pv(type)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div className="mt-6 flex justify-end gap-2">
												<Button
													label="Cancel"
													onClick={handleCancel}
													variant="secondary"
													disabled={loading}
												/>
												<Button
													label="Save Changes"
													onClick={handleSave}
													disabled={loading || !selectedTimezone}
												/>
											</div>
										</div>
									) : (
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
											<InfoItem
												label="Timezone Type"
												value={currentTzLabel || "-"}
											/>
										</div>
									)}
								</div>

								<Separator className="my-6" />

								{/* History */}
								<Section title="History">
									<InfoItem label="Manufacture Date" value={manufDate} />
									<InfoItem label="Supply Date" value={suppDate} />
									<InfoItem label="Created At" value={createdAt} />
									<InfoItem label="Last Updated At" value={updatedAt} />
								</Section>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</TabGroup>
		</MainLayout>
	);
}
