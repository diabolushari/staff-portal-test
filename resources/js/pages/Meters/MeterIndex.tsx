import { router } from "@inertiajs/react";
import { useState } from "react";
import MainLayout from "@/layouts/main-layout";
import Button from "@/ui/button/Button"; // <-- 1. Import the Button component
import CardHeader from "@/ui/Card/CardHeader";

// --- Interface Definitions ---

export interface Meter {
	meter_id: number;
	meter_serial: string;
	company_seal_num: string | null;
	manufacture_date: string | null;
	supply_date: string | null;
}

interface Props {
	meters: {
		data: Meter[];
	};
}

export default function MeterIndex({ meters }: Props) {
	const [items, setItems] = useState(meters);
	console.log(meters);

	function handleShow(id: number) {
		router.get(`/meters/${id}`);
	}

	// --- 2. Add a handler function for the create button ---
	function handleCreate() {
		// Assumes you have a route named 'meters.create'
		router.get(route("meters.create"));
	}

	return (
		<MainLayout>
			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				{/* --- 3. Add the Button as a child of the CardHeader --- */}
				<CardHeader title="Meters" />

				<Button label="Create Meter" onClick={handleCreate} />
				<div className="overflow-x-auto rounded-lg border border-slate-200">
					{items && items.length > 0 ? (
						<table className="min-w-full divide-y divide-slate-200 text-sm">
							<thead className="bg-slate-50 text-slate-700">
								<tr>
									<th scope="col" className="px-4 py-3 text-left font-medium">
										Serial Number
									</th>
									<th scope="col" className="px-4 py-3 text-left font-medium">
										Company Seal Number
									</th>
									<th scope="col" className="px-4 py-3 text-left font-medium">
										Manufacture Date
									</th>
									<th scope="col" className="px-4 py-3 text-left font-medium">
										Supply Date
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200 bg-white">
								{items.map((meter) => (
									<tr
										key={meter.meter_id}
										onClick={() => handleShow(meter.meter_id)}
										className="cursor-pointer hover:bg-slate-50"
									>
										<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
											{meter.meter_serial}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{meter.company_seal_num || "N/A"}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{meter.manufacture_date || "N/A"}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{meter.supply_date || "N/A"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="p-6 text-center text-slate-500">
							<p>No meters found.</p>
						</div>
					)}
				</div>
			</div>
		</MainLayout>
	);
}
