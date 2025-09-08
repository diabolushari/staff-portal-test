import { router } from "@inertiajs/react";
import useCustomForm from "@/hooks/useCustomForm";
import useInertiaPost from "@/hooks/useInertiaPost";
import MainLayout from "@/layouts/main-layout";
import Button from "@/ui/button/Button";
import Card from "@/ui/Card/Card";
import CardHeader from "@/ui/Card/CardHeader";
import Input from "@/ui/form/Input";
import SelectList from "@/ui/form/SelectList";
import DatePicker from "@/ui/form/DatePicker";
import CheckBox from "@/ui/form/CheckBox";
import { transformerrelNavItems } from "@/components/Navbar/navitems";
import { useEffect } from "react";

// --- Type Definitions ---
export interface Option {
  id: number;
  parameterValue: string;
}

interface MeterTransformerRelFormProps {
  ctpts: Option[];
  meters: Option[];
  statuses: Option[];
  changeReasons: Option[];
  relation?: any; // for edit mode
}

const breadcrumbs = [
  { title: "Meter Transformer Relations", href: "/meter-rel" },
  {
    title: "Add Relation",
    href: "/meter-rel/create",
  },
];

// --- Helper Functions ---
const toYMD = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return !Number.isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
};

const toISOorNull = (ymd: string) => (ymd ? new Date(ymd).toISOString() : null);

export default function MeterTransformerRelForm({
  ctpts,
  meters,
  statuses,
  changeReasons,
  relation,
}: MeterTransformerRelFormProps) {
  const isEditing = Boolean(relation);

  const { formData, setFormValue } = useCustomForm({
    ctpt_id: relation?.ctpt_id ?? null,
    meter_id: relation?.meter_id ?? null,
    status_id: relation?.status_id ?? null,
    change_reason_id: relation?.change_reason_id ?? null,
    faulty_date: toYMD(relation?.faulty_date) ?? "",
    ctpt_energise_date: toYMD(relation?.ctpt_energise_date) ?? "",
    ctpt_change_date: toYMD(relation?.ctpt_change_date) ?? "",
    effective_start_ts: relation?.effective_start_ts ?? "",
    effective_end_ts: relation?.effective_end_ts ?? "",
    is_active: relation?.is_active ?? true,
  });

  const { post, loading, errors } = useInertiaPost(
    isEditing ? `/meter-rel/${relation.version_id}` : "/meter-rel",
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ctpt_id: formData.ctpt_id,
      meter_id: formData.meter_id,
      status_id: formData.status_id,
      change_reason_id: formData.change_reason_id,
      faulty_date: toISOorNull(formData.faulty_date),
      ctpt_energise_date: toISOorNull(formData.ctpt_energise_date),
      ctpt_change_date: toISOorNull(formData.ctpt_change_date),
      effective_start_ts: formData.effective_start_ts,
      effective_end_ts: formData.effective_end_ts || null,
      is_active: formData.is_active,
    };

    if (isEditing) {
      post({ ...payload, _method: "PUT" });
    } else {
      post(payload);
    }
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
    <MainLayout breadcrumb={breadcrumbs} navItems={transformerrelNavItems}>
      <div className="p-6">
        <CardHeader
          title={isEditing ? "Edit Relation" : "Create Relation"}
          subheading={
            isEditing
              ? "Update relation details"
              : "Add a new meter-transformer relation"
          }
        />
        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderSection(
              "Relation Details",
              <>
                <SelectList
                  label="CT/PT"
                  value={formData.ctpt_id}
                  setValue={setFormValue("ctpt_id")}
                  list={ctpts}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.ctpt_id}
                />
                <SelectList
                  label="Meter"
                  value={formData.meter_id}
                  setValue={setFormValue("meter_id")}
                  list={meters}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.meter_id}
                />
                <SelectList
                  label="Status"
                  value={formData.status_id}
                  setValue={setFormValue("status_id")}
                  list={statuses}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.status_id}
                />
                <SelectList
                  label="Change Reason"
                  value={formData.change_reason_id}
                  setValue={setFormValue("change_reason_id")}
                  list={changeReasons}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.change_reason_id}
                />
              </>,
            )}

            {renderSection(
              "Dates & Status",
              <>
                <DatePicker
                  label="Faulty Date"
                  value={formData.faulty_date}
                  setValue={setFormValue("faulty_date")}
                  error={errors.faulty_date}
                />
                <DatePicker
                  label="CT/PT Energise Date"
                  value={formData.ctpt_energise_date}
                  setValue={setFormValue("ctpt_energise_date")}
                  error={errors.ctpt_energise_date}
                />
                <DatePicker
                  label="CT/PT Change Date"
                  value={formData.ctpt_change_date}
                  setValue={setFormValue("ctpt_change_date")}
                  error={errors.ctpt_change_date}
                />
                <Input
                  label="Effective Start Timestamp"
                  type="datetime-local"
                  value={formData.effective_start_ts}
                  setValue={setFormValue("effective_start_ts")}
                  error={errors.effective_start_ts}
                />
                <Input
                  label="Effective End Timestamp"
                  type="datetime-local"
                  value={formData.effective_end_ts}
                  setValue={setFormValue("effective_end_ts")}
                  error={errors.effective_end_ts}
                />
                <CheckBox
                  label="Is Active"
                  checked={formData.is_active}
                  setChecked={setFormValue("is_active")}
                  error={errors.is_active}
                />
              </>,
            )}

            <div className="flex justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                label="Cancel"
                variant="secondary"
                onClick={() => router.get("/meter-rel")}
                disabled={loading}
              />
              <Button
                type="submit"
                label={isEditing ? "Update Relation" : "Create Relation"}
                disabled={loading}
              />
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
