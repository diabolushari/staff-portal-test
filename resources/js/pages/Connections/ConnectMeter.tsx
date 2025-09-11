import { router } from "@inertiajs/react";
import useCustomForm from "@/hooks/useCustomForm";
import useInertiaPost from "@/hooks/useInertiaPost";
import MainLayout from "@/layouts/main-layout";
import Button from "@/ui/button/Button";
import Card from "@/ui/Card/Card";
import CardHeader from "@/ui/Card/CardHeader";
import CheckBox from "@/ui/form/CheckBox";
import DatePicker from "@/ui/form/DatePicker";
import Input from "@/ui/form/Input";
import SelectList from "@/ui/form/SelectList";

interface ParameterOption {
	id: number;
	parameterValue: string;
}

const toYMD = (iso?: string | null): string => {
	if (!iso) return "";
	const d = new Date(iso);
	return !Number.isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
};

const toISOorNull = (ymd: string) => (ymd ? new Date(ymd).toISOString() : null);
const toNumberOrUndef = (v: unknown) => {
	if (v === null || v === undefined || v === "") return undefined;
	const n = Number(v);
	return Number.isFinite(n) ? n : undefined;
};

export default function ConnectMeter({
	connection_id,
	relation,
	meters,
	useCategory,
	meterStatus,
	changeReason,
}: {
	connection_id: number;
	relation?: any;
	meters: any[];
	useCategory: ParameterOption[];
	meterStatus: ParameterOption[];
	changeReason: ParameterOption[];
}) {
	const isEditMode = !!relation;

	const { formData, setFormValue } = useCustomForm({
		rel_id: isEditMode ? relation.rel_id : undefined,
		connection_id: isEditMode ? relation.connection_id : connection_id,
		meter_id: isEditMode ? relation.meter_id : "",
		meter_use_category: isEditMode
			? (relation.meter_use_category?.id ?? null)
			: null,
		bidirectional_ind: isEditMode ? relation.bidirectional_ind : false,
		meter_billing_mode: isEditMode ? (relation.meter_billing_mode ?? "") : "",
		meter_status_id: isEditMode ? (relation.meter_status?.id ?? null) : null,
		faulty_date: isEditMode ? toYMD(relation.faulty_date) : "",
		rectification_date: isEditMode ? toYMD(relation.rectification_date) : "",
		change_reason: isEditMode ? (relation.change_reason?.id ?? null) : null,
	});

	console.log(relation);
	const { post, loading, errors } = useInertiaPost(
		isEditMode
			? route("meter-connection-rel.update", { id: relation.connection_id })
			: route("meter-connection-rel.store"),
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const payload = {
			...formData,
			meter_id: toNumberOrUndef(formData.meter_id),
			meter_use_category: toNumberOrUndef(formData.meter_use_category),
			meter_status_id: toNumberOrUndef(formData.meter_status_id),
			faulty_date: toISOorNull(formData.faulty_date),
			rectification_date: toISOorNull(formData.rectification_date),
			change_reason: toNumberOrUndef(formData.change_reason),
		};
		post(payload);
	};

	const renderSection = (title: string, children: React.ReactNode) => (
		<div className="rounded-md border border-slate-200 p-4">
			<h3 className="mb-4 text-lg font-medium">{title}</h3>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
				{children}
			</div>
		</div>
	);

	return (
		<MainLayout>
			<div className="p-6">
				<CardHeader
					title={isEditMode ? "Edit Connected Meter" : "Connect Meter"}
					subheading={
						isEditMode
							? "Edit the details of the meter connected to this connection"
							: "Connect a meter to the selected connection"
					}
				/>
				<Card>
					<form onSubmit={handleSubmit} className="space-y-8">
						{renderSection(
							"Meter Connection Details",
							<>
								<SelectList
									label="Meter"
									value={formData.meter_id}
									setValue={setFormValue("meter_id")}
									list={meters.map((meter) => ({
										id: meter.meter_id,
										parameterValue: meter.meter_serial,
									}))}
									dataKey="id"
									displayKey="parameterValue"
									error={errors.meter_id}
									required
								/>

								<SelectList
									label="Meter Use Category"
									value={formData.meter_use_category}
									setValue={setFormValue("meter_use_category")}
									list={useCategory.map((category) => ({
										id: category.id,
										parameterValue: category.parameter_value,
									}))}
									dataKey="id"
									displayKey="parameterValue"
									error={errors.meter_use_category}
									required
								/>

								<Input
									label="Meter Billing Mode"
									value={formData.meter_billing_mode}
									setValue={setFormValue("meter_billing_mode")}
									error={errors.meter_billing_mode}
								/>

								<SelectList
									label="Meter Status"
									value={formData.meter_status_id}
									setValue={setFormValue("meter_status_id")}
									list={meterStatus.map((status) => ({
										id: status.id,
										parameterValue: status.parameter_value,
									}))}
									dataKey="id"
									displayKey="parameterValue"
									error={errors.meter_status_id}
									required
								/>

								<SelectList
									label="Change Reason"
									value={formData.change_reason}
									setValue={setFormValue("change_reason")}
									list={changeReason.map((reason) => ({
										id: reason.id,
										parameterValue: reason.parameter_value,
									}))}
									dataKey="id"
									displayKey="parameterValue"
									error={errors.change_reason}
									required
								/>

								<DatePicker
									label="Faulty Date"
									value={formData.faulty_date}
									setValue={setFormValue("faulty_date")}
									error={errors.faulty_date}
								/>

								<DatePicker
									label="Rectification Date"
									value={formData.rectification_date}
									setValue={setFormValue("rectification_date")}
									error={errors.rectification_date}
								/>

								<div className="flex items-center pt-6 space-x-4">
									<CheckBox
										label="Bidirectional"
										value={formData.bidirectional_ind}
										toggleValue={() =>
											setFormValue("bidirectional_ind")(
												!formData.bidirectional_ind,
											)
										}
										error={errors.bidirectional_ind}
									/>
								</div>
							</>,
						)}

						<div className="flex justify-end gap-3 border-t pt-6">
							<Button
								type="button"
								label="Cancel"
								variant="secondary"
								onClick={() =>
									router.get(route("connections.show", formData.connection_id))
								}
								disabled={loading}
							/>
							<Button
								type="submit"
								label={isEditMode ? "Save Changes" : "Connect Meter"}
								disabled={loading}
							/>
						</div>
					</form>
				</Card>
			</div>
		</MainLayout>
	);
}
