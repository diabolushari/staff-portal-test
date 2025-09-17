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

// --- Types reflecting proto presence and app data ---
interface ParameterValue {
	id: number;
	parameter_value?: string; // backend variant
	parameterValue?: string; // UI variant used elsewhere
}

interface MeterTimezoneRel {
	rel_id?: number;
	timezone_type_id?: number | string;
	timezone_type?: ParameterValue | null;
}

interface Meter {
	version_id: number;
	meter_id: number;
	meter_serial: string;

	ownership_type?: ParameterValue | null;
	meter_make?: ParameterValue | null;
	meter_type?: ParameterValue | null;
	meter_category?: ParameterValue | null;
	accuracy_class?: ParameterValue | null;
	dialing_factor?: ParameterValue | null;

	company_seal_num?: string | null;
	digit_count?: number | null;

	manufacture_date?: string | null; // "YYYY-MM-DD"
	supply_date?: string | null; // "YYYY-MM-DD"

	meter_unit?: ParameterValue | null;
	meter_reset_type?: ParameterValue | null;

	smart_meter_ind: boolean;
	bidirectional_ind: boolean;

	created_ts: string; // "YYYY-MM-DD HH:mm:ss"
	updated_ts: string;

	created_by: number;
	updated_by?: number | null;

	meter_phase?: ParameterValue | null;

	decimal_digit_count?: number | null;
	programmable_pt_ratio?: number | null;
	programmable_ct_ratio?: number | null;
	meter_mf?: number | null;
	warranty_period?: number | null;
	meter_constant?: number | null;
	batch_code?: string | null;

	// Proto optional internal CT/PT (numbers)
	internal_ct_primary?: number | null;
	internal_ct_secondary?: number | null;
	internal_pt_primary?: number | null;
	internal_pt_secondary?: number | null;
}

// --- Tabs config ---
export const MeterTabs = [
	{ value: "details", label: "Meter Details" },
	{ value: "meter-ctpt", label: "Meter CTPT", href: route("meter-ctpt.index") },
	{
		value: "meter-ctpt-rel",
		label: "Meter CTPT Relations",
		href: route("meter-ctpt-rel.index"),
	},
];

// --- Reusable formatting ---
const formatDate = (dateStr?: string | null, locale = "en-US") => {
	if (!dateStr) return "-";
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return "-";
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
};

// Prefer a small helper to resolve parameter_value vs parameterValue
const pv = (p?: ParameterValue | null) =>
	p?.parameter_value ?? p?.parameterValue ?? "-";

// --- Helper UI components ---
const InfoItem = ({
	label,
	value,
}: {
	label: string;
	value: string | number | boolean | undefined | null;
}) => (
	<div className="flex flex-col gap-1">
		<Label className="text-sm font-medium text-gray-500">{label}</Label>
		<p className="text-base text-gray-800">
			{typeof value === "boolean" ? (value ? "Yes" : "No") : (value ?? "-")}
		</p>
	</div>
);

const Section = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<div className="py-6">
		<h3 className="mb-6 text-lg font-semibold text-gray-700">{title}</h3>
		<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
			{children}
		</div>
	</div>
);

// --- Props & forms ---
interface Props {
	meter: Meter;
	currentTimezone: MeterTimezoneRel | null;
	timezoneTypes: ParameterValue[];
}

interface StoreForm {
	meter_id: number;
	timezone_type_id: string;
}

interface UpdateForm extends StoreForm {
	rel_id: number;
	_method: "PUT";
}

// --- Main component ---
export default function MeterShow({
	meter,
	currentTimezone,
	timezoneTypes,
}: Readonly<Props>) {
	// Timezone state
	const [isEditing, setIsEditing] = useState(false);
	const currentTzId = useMemo<string | undefined>(() => {
		const id =
			currentTimezone?.timezone_type_id ??
			currentTimezone?.timezone_type?.id ??
			undefined;
		return typeof id === "number" ? String(id) : id;
	}, [currentTimezone]);

	const currentTzLabel = useMemo<string | undefined>(
		() =>
			currentTimezone?.timezone_type
				? pv(currentTimezone.timezone_type)
				: undefined,
		[currentTimezone],
	);

	const [selectedTimezone, setSelectedTimezone] = useState<string | undefined>(
		currentTzId,
	);

	// Create vs Update route
	const isUpdate = Boolean(currentTimezone?.rel_id);
	const url = isUpdate
		? route("meter-timezone-rel.update", {
				meter_timezone_rel: currentTimezone?.rel_id,
			})
		: route("meter-timezone-rel.store");

	const { post, loading } = useInertiaPost<StoreForm | UpdateForm>(url, {
		onSuccess: () => setIsEditing(false),
	});

	// Breadcrumbs
	const breadcrumbs: BreadcrumbItem[] = useMemo(
		() => [
			{ title: "Meters", href: route("meters.index") },
			{ title: meter.meter_serial, href: route("meters.show", meter.meter_id) },
		],
		[meter.meter_id, meter.meter_serial],
	);

	// Memoized dates
	const manufDate = useMemo(
		() => formatDate(meter.manufacture_date),
		[meter.manufacture_date],
	);
	const suppDate = useMemo(
		() => formatDate(meter.supply_date),
		[meter.supply_date],
	);
	const createdAt = useMemo(
		() => formatDate(meter.created_ts),
		[meter.created_ts],
	);
	const updatedAt = useMemo(
		() => formatDate(meter.updated_ts),
		[meter.updated_ts],
	);

	// Delete with Inertia visit options
	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this meter?")) {
			router.delete(route("meters.destroy", meter.meter_id), {
				preserveScroll: true,
				onSuccess: () =>
					router.visit(route("meters.index"), { preserveScroll: true }),
			});
		}
	};

	// Save timezone
	const handleSave = () => {
		if (!selectedTimezone) return;
		const commonData = {
			meter_id: meter.meter_id,
			timezone_type_id: selectedTimezone,
		};
		if (isUpdate && currentTimezone?.rel_id) {
			post({ ...commonData, rel_id: currentTimezone.rel_id, _method: "PUT" });
		} else {
			post(commonData);
		}
	};

  const handleCancel = () => {
    setSelectedTimezone(currentTzId)
    setIsEditing(false)
  }

  // --- RENDER LOGIC ---
  const otherTimezoneOptions = useMemo(
    () => timezoneTypes.filter((t) => String(t.id) !== currentTzId),
    [timezoneTypes, currentTzId]
  )

  const tabs = MeterTabs
  console.log(meter)
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
