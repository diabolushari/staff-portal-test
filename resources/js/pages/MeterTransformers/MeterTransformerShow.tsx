import { router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/layouts/main-layout";
import type { BreadcrumbItem } from "@/types";
import StrongText from "@/typography/StrongText";
import Button from "@/ui/button/Button";
import { transformerNavItems } from "@/components/Navbar/navitems";

interface ParameterValue {
	parameter_value: string;
}


export interface MeterTransformer {
	meter_ctpt_id: number;
	ctpt_serial: string;
	ratio_primary_value: string;
	ratio_secondary_value: string;
	manufacture_date: string | null;
	ownership_type: ParameterValue;
	accuracy_class: ParameterValue;
	burden: ParameterValue;
	make: ParameterValue;
	type: ParameterValue;
	// status: ParameterValue;
	// change_reason: ParameterValue;
	// faulty_date: string | null;
	// rectification_date: string | null;
	created_ts: string;
	updated_ts: string;
	is_active: boolean;
}

interface Props {
	transformer: MeterTransformer;
}
const breadcrumbs = [
	{ title: "Meter CTPT", href: "/meter-ctpt" },
];

export default function MeterTransformerShow({
	transformer,
}: Readonly<Props>) {
	const breadcrumbs: BreadcrumbItem[] = [
		{ title: "Meter CTPT", href: "/meter-ctpt" },
		{ title: "Detail", href: `/meter-ctpt/${transformer.meter_ctpt_id}` },
	];

	const formatDate = (dateStr?: string | null) => {
		if (!dateStr) return "-";
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this transformer?")) {
			router.delete(`/meter-ctpt/${transformer.meter_ctpt_id}`);
		}
	};
	

	return (
		<MainLayout breadcrumb={breadcrumbs}
					  navItems={transformerNavItems}>
			<div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
				{/* Header Section */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<StrongText className="text-2xl font-semibold text-[#252c32]">
							{transformer.ctpt_serial}
						</StrongText>
						{/* <Button
							label="Delete Transformer"
							onClick={handleDelete}
							variant="destructive"
						/> */}
					</div>
				</div>

				{/* Main Content Card */}
				<Card className="rounded-lg p-7">
					<CardHeader className="p-0 mb-6">
						<CardTitle className="text-base font-semibold text-[#252c32]">
							Meter Transformer Details
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
									<InfoItem
										label="CTPT Serial"
										value={transformer.ctpt_serial}
									/>
									<InfoItem
										label="Ownership"
										value={transformer.ownership_type?.parameter_value}
									/>
									<InfoItem
										label="Make"
										value={transformer.make?.parameter_value}
									/>
									<InfoItem
										label="Type"
										value={transformer.type?.parameter_value}
									/>
									{/* <InfoItem
										label="Status"
										value={transformer.status?.parameter_value}
									/>
									<InfoItem
										label="Change Reason"
										value={transformer.change_reason?.parameter_value}
									/> */}
								</div>
							</div>

							{/* Section: Technical Specifications */}
							<div>
								<StrongText className="mb-4 block text-sm font-medium text-gray-500">
									Technical Specifications
								</StrongText>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								<InfoItem label="Primary Ratio" value={transformer.ratio_primary_value} />
								<InfoItem label="Secondary Ratio" value={transformer.ratio_secondary_value} />

									<InfoItem
										label="Accuracy Class"
										value={transformer.accuracy_class?.parameter_value}
									/>
									<InfoItem
										label="Burden"
										value={transformer.burden?.parameter_value}
									/>
									<InfoItem label="Manufacture Date" value={formatDate(transformer.manufacture_date)} />

								</div>
							</div>

							{/* Section: History */}
							<div>
								<StrongText className="mb-4 block text-sm font-medium text-gray-500">
									History
								</StrongText>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									{/* <InfoItem
										label="Faulty Date"
										value={formatDate(transformer.faulty_date)}
									/>
									<InfoItem
										label="Rectification Date"
										value={formatDate(transformer.rectification_date)}
									/> */}
									<InfoItem
										label="Created At"
										value={formatDate(transformer.created_ts)}
									/>
									<InfoItem
										label="Last Updated At"
										value={formatDate(transformer.updated_ts)}
									/>
									{/* <InfoItem
										label="Active"
										value={transformer.is_active ? "Yes" : "No"}
									/> */}
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
	value: string | number | undefined | null;
}) => (
	<div className="space-y-1">
		<label className="text-sm font-normal text-[#252c32]">{label}</label>
		<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
			{value ?? "-"}
		</div>
	</div>
);
