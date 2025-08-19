import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/typography/Heading";

interface Props {
	party: {
		version_id: number;
		party_id: number;
		party_code: number;
		party_legacy_code: string;
		name: string;
		party_type_id: number;
		status_id: number;
		effective_start: string;
		effective_end?: string | null;
		is_current: boolean;
		created_by: number;
		updated_by: number;
		created_at: string;
		updated_at: string;
	};
}

export default function PartiesShow({ party }: Props) {
	console.log(party);
	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();

	const formatDate = (dateString: string | null) => {
		return dateString ? dateString.split("T") : "N/A";
	};

	return (
		<AppLayout>
			<div className="p-6">
				<Heading>Party Details</Heading>
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-2xl font-semibold text-white">
							{getInitials(party.name)}
						</div>
						<div>
							<div className="text-xl font-semibold">{party.name}</div>
							<div className="text-gray-600">Party ID: {party.party_id}</div>
							<div className="text-gray-600">
								Connected: {formatDate(party.effective_start)}
							</div>
						</div>
					</div>
					<button
						onClick={() => router.visit(route("parties.edit", party.party_id))}
						className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
					>
						Edit Profile
					</button>
				</div>
				{/* Connection Summary */}
				<div className="mb-6">
					<div className="mb-2 font-semibold text-gray-700">
						Connection Summary
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="rounded border p-4 text-center">
							<div className="text-sm text-gray-500">Party Code</div>
							<div className="text-xl font-bold">{party.party_code}</div>
						</div>
						<div className="rounded border p-4 text-center">
							<div className="text-sm text-gray-500">Party Type</div>
							<div className="text-lg font-medium">
								{party.party_type_id === 1 ? "Individual" : "Company"}
							</div>
						</div>
						<div className="rounded border p-4 text-center">
							<div className="text-sm text-gray-500">Status</div>
							<div
								className={`font-medium ${
									party.status_id === 1 ? "text-green-600" : "text-red-600"
								}`}
							>
								{party.status_id === 1 ? "Active" : "Inactive"}
							</div>
						</div>
					</div>
				</div>
				{/* More Details */}
				<div className="mb-6">
					<div className="mb-2 font-semibold text-gray-700">More Details</div>
					<table className="w-full rounded border text-sm">
						<tbody>
							<tr className="border-b">
								<td className="p-3 font-medium text-gray-600">Version</td>
								<td className="p-3">{party.version_id}</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-gray-600">Legacy Code</td>
								<td className="p-3">{party.party_legacy_code}</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-gray-600">
									Effective Start
								</td>
								<td className="p-3">{formatDate(party.effective_start)}</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-gray-600">Effective End</td>
								<td className="p-3">
									{party.effective_end
										? party.effective_end.split("T")[0]
										: "Ongoing"}
								</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-gray-600">Is Current</td>
								<td className="p-3">{party.is_current ? "Yes" : "No"}</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-gray-600">Created By</td>
								<td className="p-3">{party.created_by}</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-gray-600">Updated By</td>
								<td className="p-3">{party.updated_by}</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-gray-600">Created At</td>
								<td className="p-3">{formatDate(party.created_at)}</td>
							</tr>
							<tr>
								<td className="p-3 font-medium text-gray-600">Updated At</td>
								<td className="p-3">{formatDate(party.updated_at)}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</AppLayout>
	);
}
