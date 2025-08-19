import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { TableCell, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import DeleteButton from "@/ui/button/DeleteButton";
import EditButton from "@/ui/button/EditButton";
import Card from "@/ui/Card/Card";
import CardHeader from "@/ui/Card/CardHeader";
import CustomTable from "@/ui/Table/CustomTable";

interface Props {
	parties: {
		success: boolean;
		data: any[];
		error: any;
		rawResponse: any;
		statusCode: number;
		statusDetails: string;
	};
}

export default function PartiesIndex({ parties }: Props) {
	const handleEditClick = (row: any) => {
		router.get(`/parties/${row.version_id}/edit`);
	};

	const handleDeleteClick = (row: any) => {
		router.delete(`/parties/${row.version_id}`);
	};

	return (
		<AppLayout>
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
				<CardHeader
					title="Parties"
					subheading="Manage parties"
					addUrl={route("parties.create")}
				/>
				<Card>
					<CustomTable
						columns={[
							"S.No",
							"Party ID",
							"Party Code",
							"Legacy Code",
							"Name",
							"Status",
							"Is Current",
							"Actions",
						]}
						caption="List of parties"
					>
						{parties?.data?.map((item: any, index: number) => (
							<TableRow key={item.version_id}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{item.party_id}</TableCell>
								<TableCell>{item.party_code}</TableCell>
								<TableCell>{item.party_legacy_code ?? "-"}</TableCell>
								<TableCell>{item.name ?? "-"}</TableCell>
								<TableCell>
									{item.status_id === 1
										? "Active"
										: item.status_id === 2
											? "Blacklisted"
											: "Unknown"}
								</TableCell>
								<TableCell>{item.is_current ? "✅" : "❌"}</TableCell>
								<TableCell>
									<div className="flex space-x-2">
										<EditButton onClick={() => handleEditClick(item)} />
										<DeleteButton onClick={() => handleDeleteClick(item)} />
										<a
											href={route("parties.show", item.version_id)}
											className="text-blue-500 hover:underline"
										>
											View
										</a>
									</div>
								</TableCell>
							</TableRow>
						))}
					</CustomTable>
				</Card>
			</div>
		</AppLayout>
	);
}
