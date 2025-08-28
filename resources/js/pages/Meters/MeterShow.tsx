import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/layouts/main-layout";
import type { BreadcrumbItem } from "@/types";
import StrongText from "@/typography/StrongText";
import TinyContainer from "@/ui/Card/TinyContainer";

// Define the structure of the meter object
interface Meter {
	meter_id: number;
	meter_serial: string;
	ownership_type: { id: number; parameter_value: string };
	meter_make: { id: number; parameter_value: string };
	meter_type: { id: number; parameter_value: string };
	meter_category: { id: number; parameter_value: string };
	accuracy_class: { id: number; parameter_value: string };
	dialing_factor: { id: number; parameter_value: string };
	company_seal_num: string;
	digit_count: number;
	voltage_meter_ratio: number;
	current_meter_ratio: number;
	manufacture_date: string;
	supply_date: string;
	meter_unit: { id: number; parameter_value: string };
	meter_reset_type: { id: number; parameter_value: string };
	smart_meter_ind: boolean;
	bidirectional_ind: boolean;
	created_ts: string;
	updated_ts: string;
	created_by: number;
	updated_by: number;
}

interface Props {
	meter: Meter;
}

export default function MeterShow({ meter }: Readonly<Props>) {
	console.log(meter);
	const breadcrumbs: BreadcrumbItem[] = [
		{ title: "Meters", href: "/meters" },
		{ title: "Detail", href: `/meters/${meter.meter_id}` },
	];

	const formatDate = (dateStr?: string) => {
		if (!dateStr) return "-";
		// This will format the date to a more readable "Month Day, Year" format
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<MainLayout breadcrumb={breadcrumbs}>
			<div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
				{/* Header Section */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3">
						<StrongText className="text-2xl font-semibold text-[#252c32]">
							{meter.meter_serial}
						</StrongText>
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

							{/* Section: Other Information */}
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

// Reusable helper component to display a labeled piece of information
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
			{value}
		</div>
	</div>
);
