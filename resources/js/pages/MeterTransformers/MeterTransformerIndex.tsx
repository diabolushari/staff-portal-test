import { router } from "@inertiajs/react";
import { useState } from "react";
import MainLayout from "@/layouts/main-layout";
import Button from "@/ui/button/Button";
import CardHeader from "@/ui/Card/CardHeader";
import { c, M } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";
import { transformerNavItems } from "@/components/Navbar/navitems";
import MeterTransformerList from "@/components/Meter/MeterTransformer/MeterTransformerList";
import DeleteModal from "@/ui/Modal/DeleteModal";
import ListSearch from "@/ui/Search/ListSearch";

// --- Interface Definitions ---
export interface MeterTransformer {
	meter_ctpt_id: number;
	ctpt_serial: string;
	type_name: string; 
	ct_ratio: string;
	pt_ratio: string;
}

interface Props {
	transformers: MeterTransformer[];

}
const breadcrumbs = [
	{ title: "Meter Transformers", href: "/meter-transformers" },
];

export default function MeterTransformerIndex({ transformers }: Props) {
	const [items, setItems] = useState(transformers || []);
	  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTransformer, setSelectedTransformer] = useState<MeterTransformer | null>(null)
console.log("Meter Transformers:", items);
	function handleShow(id: number) {
		router.get(`/meter-transformers/${id}`);
	}

	function handleCreate() {
		router.get(route("meter-transformers.create"));
	}

	 function handleDeleteClick(item: MeterTransformer) {
    setShowDeleteModal(true)
    setSelectedTransformer(item)
  }

	return (
		<MainLayout
			breadcrumb={breadcrumbs}
			  navItems={transformerNavItems}
		>
			<div className="flex h-full flex-1 flex-col gap-6 p-6">
				<CardHeader title="Meter Transformers" />
				<ListSearch
						  title="Meter Transformer Search"
						  url={route("meter-transformers.index")}
						  //setItems={setItems}
						  //search={query}
						/>
				{/* <Button label="Create Meter Transformer" onClick={handleCreate} /> */}
				{items && items.length > 0 ? (
          <MeterTransformerList
            transformers={items}
            onDelete={handleDeleteClick}
          />
        ) : (
          <div className="p-6 text-center text-slate-500">
            <p>No meter transformers found.</p>
          </div>
        )}


				{showDeleteModal && selectedTransformer && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete Transformer ${selectedTransformer.ctpt_serial}`}
            url={`/meter-transformers/${selectedTransformer.meter_ctpt_id}`}
          />
        )}
				{/* <div className="overflow-x-auto rounded-lg border border-slate-200">
					{items && items.length > 0 ? (
						<table className="min-w-full divide-y divide-slate-200 text-sm">
							<thead className="bg-slate-50 text-slate-700">
								<tr>
									<th className="px-4 py-3 text-left font-medium">
										CTPT Serial
									</th>
									<th className="px-4 py-3 text-left font-medium">Type</th>
									<th className="px-4 py-3 text-left font-medium">CT Ratio</th>
									<th className="px-4 py-3 text-left font-medium">PT Ratio</th>
									<th className="px-4 py-3 text-left font-medium">Status</th>
									<th className="px-4 py-3 text-left font-medium">
										Faulty Date
									</th>
									<th className="px-4 py-3 text-left font-medium">
										Rectification Date
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200 bg-white">
								{items.map((mt) => (
									<tr
										key={mt.meter_ctpt_id}
										onClick={() => handleShow(mt.meter_ctpt_id)}
										className="cursor-pointer hover:bg-slate-50"
									>
										<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
											{mt.ctpt_serial}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{mt.type.parameter_value}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{mt.ct_ratio}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{mt.pt_ratio}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{mt.status.parameter_value}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{mt.faulty_date || "N/A"}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{mt.rectification_date || "N/A"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="p-6 text-center text-slate-500">
							<p>No meter transformers found.</p>
						</div>
					)}
				</div> */}
			</div>
		</MainLayout>
	);
}
