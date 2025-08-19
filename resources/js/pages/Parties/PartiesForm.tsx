import { router } from "@inertiajs/react";
import useCustomForm from "@/hooks/useCustomForm";
import AppLayout from "@/layouts/app-layout";
import Button from "@/ui/button/Button";
import Card from "@/ui/Card/Card";
import CardHeader from "@/ui/Card/CardHeader";
import DatePicker from "@/ui/form/DatePicker";
import Input from "@/ui/form/Input";
import SelectList from "@/ui/form/SelectList";

interface Party {
	version_id: number;
	party_id: number;
	party_code: number;
	party_legacy_code: string;
	name: string;
	party_type_id: number;
	status_id: number;
	effective_start: string;
	effective_end: string;
	is_current: boolean;
}

interface PartiesFormProps {
	partyTypes: Array<{ id: number; parameterValue: string }>;
	partyStatus: Array<{ id: number; parameterValue: string }>;
	party?: Party;
}

export default function PartiesForm({
	partyTypes,
	partyStatus,
	party,
}: PartiesFormProps) {
	const isEditing = !!party;

	// Initialize form data based on create/edit mode
	const initialFormData =
		isEditing && party
			? {
					version_id: party.version_id,
					party_id: party.party_id?.toString() || "",
					party_code: party.party_code?.toString() || "",
					party_legacy_code: party.party_legacy_code || "",
					name: party.name || "",
					party_type_id: party.party_type_id || 1,
					status_id: party.status_id || 1,
					effective_start: party.effective_start
						? new Date(party.effective_start).toISOString().split("T")[0]
						: "",
					effective_end: party.effective_end
						? new Date(party.effective_end).toISOString().split("T")
						: "",
					is_current: party.is_current ?? true,
					updated_by: 1, // Should be current user ID
				}
			: {
					party_id: "",
					party_code: "",
					party_legacy_code: "",
					name: "",
					party_type_id: 1,
					status_id: 1,
					effective_start: "",
					effective_end: "",
					is_current: true,
					created_by: 1, // Should be current user ID
				};

	const { formData, setFormValue, toggleBoolean } =
		useCustomForm(initialFormData);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isEditing) {
			// Update payload structure
			const updatePayload = {
				version_id: formData.version_id,
				party_id: formData.party_id ? Number(formData.party_id) : undefined,
				party_code: formData.party_code
					? Number(formData.party_code)
					: undefined,
				party_legacy_code: formData.party_legacy_code,
				name: formData.name,
				party_type_id: formData.party_type_id
					? Number(formData.party_type_id)
					: undefined,
				status_id: formData.status_id ? Number(formData.status_id) : undefined,
				effective_start: formData.effective_start
					? new Date(formData.effective_start).toISOString()
					: null,
				effective_end: formData.effective_end
					? new Date(formData.effective_end).toISOString()
					: null,
				is_current: formData.is_current,
				updated_by: formData.updated_by,
				_method: "PUT", // Laravel method spoofing
			};

			router.post(`/parties/${party!.party_id}`, updatePayload);
		} else {
			// Create payload structure
			const createPayload = {
				party_id: formData.party_id ? Number(formData.party_id) : undefined,
				party_code: formData.party_code
					? Number(formData.party_code)
					: undefined,
				party_legacy_code: formData.party_legacy_code,
				name: formData.name,
				party_type_id: formData.party_type_id
					? Number(formData.party_type_id)
					: undefined,
				status_id: formData.status_id ? Number(formData.status_id) : undefined,
				effective_start: formData.effective_start
					? new Date(formData.effective_start).toISOString()
					: null,
				effective_end: formData.effective_end
					? new Date(formData.effective_end).toISOString()
					: null,
				is_current: formData.is_current,
				created_by: formData.created_by,
			};

			router.post("/parties", createPayload);
		}
	};

	return (
		<AppLayout>
			<div className="p-6">
				<CardHeader title={isEditing ? "Edit Party" : "Create New Party"} />
				<Card>
					<form onSubmit={onSubmit}>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{/* Party ID (Optional) */}
							<Input
								label="Party ID"
								value={formData.party_id}
								setValue={setFormValue("party_id")}
								type="number"
							/>

							{/* Party Code */}
							<Input
								label="Party Code"
								value={formData.party_code}
								setValue={setFormValue("party_code")}
								type="number"
							/>

							{/* Legacy Code */}
							<Input
								label="Legacy Code"
								value={formData.party_legacy_code}
								setValue={setFormValue("party_legacy_code")}
								type="text"
								required
							/>

							{/* Name */}
							<Input
								label="Name"
								value={formData.name}
								setValue={setFormValue("name")}
								type="text"
								required
							/>

							{/* Party Type */}
							<SelectList
								label="Party Type"
								value={formData.party_type_id}
								setValue={setFormValue("party_type_id")}
								type="number"
								list={partyTypes}
								dataKey="id"
								displayKey="parameterValue"
							/>

							{/* Status */}
							<SelectList
								label="Status"
								value={formData.status_id}
								setValue={setFormValue("status_id")}
								type="number"
								list={partyStatus}
								dataKey="id"
								displayKey="parameterValue"
							/>

							{/* Effective Dates */}
							<DatePicker
								label="Effective Start Date"
								value={formData.effective_start}
								setValue={setFormValue("effective_start")}
								required
							/>

							<DatePicker
								label="Effective End Date"
								value={formData.effective_end}
								setValue={setFormValue("effective_end")}
							/>

							{/* Is Current */}
							<div className="flex items-center space-x-2">
								<input
									id="is_current"
									type="checkbox"
									checked={formData.is_current}
									onChange={toggleBoolean("is_current")}
									className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
								/>
								<label
									htmlFor="is_current"
									className="text-sm font-medium text-gray-700"
								>
									Is Current
								</label>
							</div>
						</div>

						{/* Submit Button */}
						<div className="mt-6 flex justify-end space-x-3">
							<Button
								type="button"
								label="Cancel"
								variant="secondary"
								onClick={() => router.get("/parties")}
							/>
							<Button
								type="submit"
								label={isEditing ? "Update Party" : "Create Party"}
							/>
						</div>
					</form>
				</Card>
			</div>
		</AppLayout>
	);
}
