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
	meters,
	useCategory,
	meterStatus,
	changeReason,
}: {
	connection_id: number;
	meters: any[];
	useCategory: ParameterOption[];
	meterStatus: ParameterOption[];
	changeReason: ParameterOption[];
}) {
	console.log(useCategory);
	const { formData, setFormValue } = useCustomForm({
		connection_id: connection_id,
		meter_id: "",
		meter_use_category: null,
		bidirectional_ind: false,
		meter_billing_mode: "",
		meter_status_id: null,
		faulty_date: "",
		rectification_date: "",
		change_reason: null,
	});

	const { post, loading, errors } = useInertiaPost(
		route("meter-connection-rel.store"),
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const payload = {
			connection_id: formData.connection_id,
			meter_id: toNumberOrUndef(formData.meter_id),
			meter_use_category: toNumberOrUndef(formData.meter_use_category),
			bidirectional_ind: formData.bidirectional_ind,
			meter_billing_mode: formData.meter_billing_mode,
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
					title="Connect Meter"
					subheading="Connect a meter to the selected connection"
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
									router.get(route("connections.show", connection_id))
								}
								disabled={loading}
							/>
							<Button type="submit" label="Connect Meter" disabled={loading} />
						</div>
					</form>
				</Card>
			</div>
		</MainLayout>
	);
}
