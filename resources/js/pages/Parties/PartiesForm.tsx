import { router } from "@inertiajs/react";
import useCustomForm from "@/hooks/useCustomForm";
import AppLayout from "@/layouts/app-layout";
import Button from "@/ui/button/Button";
import Card from "@/ui/Card/Card";
import CardHeader from "@/ui/Card/CardHeader";
import DatePicker from "@/ui/form/DatePicker";
import Input from "@/ui/form/Input";
import SelectList from "@/ui/form/SelectList";

export default function PartiesForm({ partyTypes, partyStatus }: any) {
	const { formData, setFormValue, toggleBoolean } = useCustomForm({
		party_id: "", // optional int32
		party_code: "", // optional int32
		party_legacy_code: "", // required string
		name: "",
		party_type_id: 1,
		status_id: 1,
		effective_start: "",
		effective_end: "",
		is_current: true,
		created_by: 1, // hidden, hardcoded for now
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Convert to backend-friendly payload
		const payload = {
			...formData,
			party_id: formData.party_id ? Number(formData.party_id) : undefined,
			party_code: formData.party_code ? Number(formData.party_code) : undefined,
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
		};

		router.post("/parties", payload);
		console.log(payload);
	};

	return (
		<AppLayout>
			<div className="p-6">
				<CardHeader title="Party Details" />
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
							/>

							{/* Name */}
							<Input
								label="Name"
								value={formData.name}
								setValue={setFormValue("name")}
								type="text"
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
								/>
								<label htmlFor="is_current">Is Current</label>
							</div>
						</div>

						{/* Submit */}
						<div className="mt-5">
							<Button type="submit" label="Submit" />
						</div>
					</form>
				</Card>
			</div>
		</AppLayout>
	);
}
