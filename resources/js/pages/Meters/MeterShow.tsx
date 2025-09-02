import { router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useInertiaPost from "@/hooks/useInertiaPost";
import type { Meter } from "@/interfaces/meter";
import MainLayout from "@/layouts/main-layout";
import type { BreadcrumbItem } from "@/types";
import StrongText from "@/typography/StrongText";
import Button from "@/ui/button/Button";

interface ParameterValue {
	id: number;
	parameterValue: string;
}
interface Props {
	meter: Meter;
	currentTimezone: any; // supports either { timezone_type_id } or { timezone_type: { id, parameter_value } }
	timezoneTypes: ParameterValue[]; // "other" options
}

interface StoreForm {
	meter_id: number;
	timezone_type_id: string;
}

interface UpdateForm {
	rel_id: number;
	timezone_type_id: string;
}

export default function MeterShow({
	meter,
	currentTimezone,
	timezoneTypes,
}: Readonly<Props>) {
	// Normalize current timezone id/label from either shape
	const currentTzId = useMemo<string | undefined>(() => {
		const id =
			currentTimezone?.timezone_type_id ??
			currentTimezone?.timezone_type?.id ??
			undefined;
		return id !== undefined && id !== null ? String(id) : undefined;
	}, [currentTimezone]);

	const currentTzLabel = useMemo<string | undefined>(() => {
		return (
			currentTimezone?.timezone_type?.parameter_value ?? undefined
			// Note: timezoneTypes intentionally excludes current; do not try to derive label from it.
		);
	}, [currentTimezone]);

	const [isEditing, setIsEditing] = useState(false);
	const [selectedTimezone, setSelectedTimezone] = useState<string | undefined>(
		currentTzId,
	);

	const isUpdate = !!(currentTimezone as any)?.rel_id;
	const url = isUpdate
		? route("meter-timezone-rel.update", {
				meter_timezone_rel: (currentTimezone as any).rel_id,
			})
		: route("meter-timezone-rel.store");

	const { post, loading } = useInertiaPost<StoreForm | UpdateForm>(url, {
		onComplete: () => {
			setIsEditing(false);
		},
	});

	const breadcrumbs: BreadcrumbItem[] = [
		{ title: "Meters", href: "/meters" },
		{ title: "Detail", href: `/meters/${meter.meter_id}` },
	];

	const formatDate = (dateStr?: string) => {
		if (!dateStr) return "-";
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this meter?")) {
			router.delete(`/meters/${meter.meter_id}`);
		}
	};

	const handleSave = () => {
		if (!selectedTimezone) {
			return;
		}
		if (isUpdate) {
			post({
				rel_id: currentTimezone.rel_id,
				meter_id: meter.meter_id,
				timezone_type_id: selectedTimezone,
				_method: "PUT",
			});
		} else {
			post({
				meter_id: meter.meter_id,
				timezone_type_id: selectedTimezone,
			});
		}
	};

	const handleCancel = () => {
		setSelectedTimezone(currentTzId);
		setIsEditing(false);
	};

	// Only show "other" options in the dropdown
	const otherTimezoneOptions = useMemo(
		() => timezoneTypes.filter((t) => String(t.id) !== (currentTzId ?? "")),
		[timezoneTypes, currentTzId],
	);

	const displayTimezoneLabel =
		(isEditing
			? // In edit mode show the label of the selected value or fallback to current label
				selectedTimezone === currentTzId
				? currentTzLabel
				: undefined
			: // In view mode show current label
				currentTzLabel) || "-";

	return (
		<MainLayout breadcrumb={breadcrumbs}>
			<div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
				{/* Header Section */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<StrongText className="text-2xl font-semibold text-[#252c32]">
							{meter.meter_serial}
						</StrongText>
						<Button
							label="Delete Meter"
							onClick={handleDelete}
							variant="destructive"
							disabled={loading}
						/>
					</div>
				</div>

				{/* Main Content Card */}
				<Card className="rounded-lg p-7">
					<CardHeader className="p-0 mb-6">
						<CardTitle className="text-base font-semibold text-[#252c32]">
							Meter Details
						</CardTitle>
					</CardHeader>
					<hr className="mb-6 border-[#e5e9eb]" />
					<CardContent className="p-0">
						<div className="space-y-8">
							{/* Section: General Information */}
							<div>
								<StrongText className="mb-4 block text-sm font-medium text-gray-500">
									General Information
								</StrongText>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									<InfoItem label="Meter Serial" value={meter.meter_serial} />
									<InfoItem
										label="Ownership"
										value={meter.ownership_type.parameter_value}
									/>
									<InfoItem
										label="Make"
										value={meter.meter_make.parameter_value}
									/>
									<InfoItem
										label="Type"
										value={meter.meter_type.parameter_value}
									/>
									<InfoItem
										label="Category"
										value={meter.meter_category.parameter_value}
									/>
									<InfoItem
										label="Unit"
										value={meter.meter_unit.parameter_value}
									/>
								</div>
							</div>

							{/* Section: Technical Specifications */}
							<div>
								<StrongText className="mb-4 block text-sm font-medium text-gray-500">
									Technical Specifications
								</StrongText>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									<InfoItem
										label="Accuracy Class"
										value={meter.accuracy_class.parameter_value}
									/>
									<InfoItem
										label="Dialing Factor"
										value={meter.dialing_factor.parameter_value}
									/>
									<InfoItem label="Digit Count" value={meter.digit_count} />
									<InfoItem
										label="Voltage Ratio"
										value={meter.voltage_meter_ratio}
									/>
									<InfoItem
										label="Current Ratio"
										value={meter.current_meter_ratio}
									/>
									<InfoItem
										label="Company Seal No."
										value={meter.company_seal_num}
									/>
									<InfoItem
										label="Reset Type"
										value={meter.meter_reset_type.parameter_value}
									/>
									<InfoItem
										label="Smart Meter"
										value={meter.smart_meter_ind ? "Yes" : "No"}
									/>
									<InfoItem
										label="Bidirectional"
										value={meter.bidirectional_ind ? "Yes" : "No"}
									/>
								</div>
							</div>

							{/* Section: Timezone Information */}
							<div>
								<div className="flex justify-between items-center mb-4">
									<StrongText className="block text-sm font-medium text-gray-500">
										Timezone Information
									</StrongText>
									{!isEditing && (
										<Button
											label="Edit"
											onClick={() => setIsEditing(true)}
											variant="outline"
											disabled={loading}
										/>
									)}
								</div>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									{isEditing ? (
										<div className="space-y-1">
											<Label>Timezone Type</Label>
											<Select
												value={selectedTimezone}
												onValueChange={setSelectedTimezone}
											>
												<SelectTrigger>
													{/* Placeholder falls back to current label when value isn't in items */}
													<SelectValue
														placeholder={
															currentTzLabel || "Select a timezone type"
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{/* Hidden current option so SelectValue can resolve its label */}
													{currentTzId && currentTzLabel && (
														<SelectItem
															value={currentTzId}
															disabled
															className="hidden"
														>
															{currentTzLabel}
														</SelectItem>
													)}
													{/* Only show "other" options in the list */}
													{otherTimezoneOptions.map((type) => (
														<SelectItem
															key={type.id}
															value={type.id.toString()}
														>
															{type.parameterValue}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									) : (
										<InfoItem
											label="Timezone Type"
											value={displayTimezoneLabel}
										/>
									)}
								</div>

								{isEditing && (
									<div className="flex justify-end gap-2 mt-4">
										<Button
											label="Cancel"
											onClick={handleCancel}
											variant="secondary"
											disabled={loading}
										/>
										<Button
											label="Save"
											onClick={handleSave}
											disabled={loading}
										/>
									</div>
								)}
							</div>

							{/* Section: History */}
							<div>
								<StrongText className="mb-4 block text-sm font-medium text-gray-500">
									History
								</StrongText>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									<InfoItem
										label="Manufacture Date"
										value={formatDate(meter.manufacture_date)}
									/>
									<InfoItem
										label="Supply Date"
										value={formatDate(meter.supply_date)}
									/>
									<InfoItem
										label="Created At"
										value={formatDate(meter.created_ts)}
									/>
									<InfoItem
										label="Last Updated At"
										value={formatDate(meter.updated_ts)}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
}

// Reusable helper component
const InfoItem = ({
	label,
	value,
}: {
	label: string;
	value: string | number | undefined;
}) => (
	<div className="space-y-1">
		<label className="text-sm font-normal text-[#252c32]">{label}</label>
		<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
			{value ?? "-"}
		</div>
	</div>
);
