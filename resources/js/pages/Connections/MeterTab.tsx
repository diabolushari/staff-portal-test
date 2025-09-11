import { router } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import StrongText from "@/typography/StrongText";

export function MeterTab({
	meterConnectionRel,
	meter,
	connectionId,
}: {
	meterConnectionRel: any;
	meter: any;
	connectionId: number;
}) {
	return (
		<Card className="rounded-lg p-7">
			<div className="mb-6 flex items-center justify-between">
				<StrongText className="text-base font-semibold text-[#252c32]">
					Meter Details
				</StrongText>
				{!meter && (
					<button
						onClick={() =>
							router.visit(
								route("meter-connection-rel.create", { connectionId }),
							)
						}
						className="flex items-center gap-2 rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]"
					>
						Add Meter
					</button>
				)}
			</div>
			<hr className="mb-6 border-[#e5e9eb]" />
			{meter ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{/* Meter Details */}
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Meter Serial
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.meter_serial}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Ownership
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.ownership_type?.parameter_value}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Meter Make
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.meter_make?.parameter_value}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Meter Type
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.meter_type?.parameter_value}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Meter Category
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.meter_category?.parameter_value}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Accuracy Class
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.accuracy_class?.parameter_value}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Company Seal Number
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.company_seal_num}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Manufacture Date
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.manufacture_date}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Supply Date
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.supply_date}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Smart Meter
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.smart_meter_ind ? "Yes" : "No"}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Bidirectional
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meter.bidirectional_ind ? "Yes" : "No"}
						</div>
					</div>

					{/* Meter Connection Relation Details */}
					<div className="col-span-1 md:col-span-2 lg:col-span-3">
						<hr className="my-6 border-[#e5e9eb]" />
						<StrongText className="text-base font-semibold text-[#252c32]">
							Meter Connection
						</StrongText>
					</div>

					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Billing Mode
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meterConnectionRel.meter_billing_mode}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Meter Status
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meterConnectionRel.meter_status?.parameter_value}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Faulty Date
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meterConnectionRel.faulty_date}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Rectification Date
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meterConnectionRel.rectification_date}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Effective Start Date
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meterConnectionRel.effective_start_ts}
						</div>
					</div>
					<div>
						<label className="text-sm font-normal text-[#252c32]">
							Effective End Date
						</label>
						<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
							{meterConnectionRel.effective_end_ts}
						</div>
					</div>
				</div>
			) : (
				<div className="text-center">
					<p className="text-gray-500">
						No meter connected to this connection.
					</p>
				</div>
			)}
		</Card>
	);
}
