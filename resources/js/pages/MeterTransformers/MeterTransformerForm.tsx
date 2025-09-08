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
import { transformerNavItems } from "@/components/Navbar/navitems";
import { useEffect, useState } from "react";
import { c } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";

// --- Type Definitions ---
interface ParameterOption {
  id: number;
  parameterValue: string;
}

export interface MeterTransformerFormProps {
  ownershipTypes: ParameterOption[];
  accuracyClasses: ParameterOption[];
  burdens: ParameterOption[];
  makes: ParameterOption[];
  types: ParameterOption[];
  transformer?: any; // for edit mode
}

const breadcrumbs = [
  { title: "Meter Transformers", href: "/meter-transformers" },
  {
    title: "Add Meter Transformer",
    href: "/meter-transformers/create",
  },
];

// --- Helper Functions ---
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

export default function MeterTransformerForm({
  ownershipTypes,
  accuracyClasses,
  burdens,
  makes,
  types,
  transformer,
}: MeterTransformerFormProps) {
  console.log("Transformer prop:", transformer); // Debugging line
  const isEditing = Boolean(transformer);

  const [transformerType, setTransformerType] = useState<string>(transformer?.type_name || '');

  const { formData, setFormValue } = useCustomForm({
    ctpt_serial: transformer?.ctpt_serial ?? "",
    ownership_type_id: transformer?.ownership_type_id ?? null,
    accuracy_class_id: transformer?.accuracy_class_id ?? null,
    burden_id: transformer?.burden_id ?? null,
    make_id: transformer?.make_id ?? null,
    type_id: transformer?.type_id ?? null,
    ct_ratio: transformer?.ct_ratio ?? "",
    pt_ratio: transformer?.pt_ratio ?? "",
  });

  const { post, loading, errors } = useInertiaPost(
    isEditing
      ? `/meter-transformers/${transformer.meter_ctpt_id}`
      : "/meter-transformers",
  );
// get the selected type name (CT or PT)
const selectedType = types.find(t => t.id === formData.type_id)?.parameterValue;

useEffect(() => {
  if (selectedType === "CT") {
    // clear PT ratio if CT is selected
    setFormValue("pt_ratio")("");
  } else if (selectedType === "PT") {
    // clear CT ratio if PT is selected
    setFormValue("ct_ratio")("");
  }
}, [formData.type_id]);

const handletypeChange = (id: string | number) => {
  const numericId = Number(id);
  const selected = types.find(t => t.id == numericId)?.parameterValue || '';
  setTransformerType(selected);
  setFormValue("type_id")(numericId);
  console.log("Selected Type:", selected, "id:", numericId, types);
};


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   


    const payload = {
      ctpt_serial: formData.ctpt_serial,
      ownership_type_id: toNumberOrUndef(formData.ownership_type_id),
      accuracy_class_id: toNumberOrUndef(formData.accuracy_class_id),
      burden_id: toNumberOrUndef(formData.burden_id),
      make_id: toNumberOrUndef(formData.make_id),
      type_id: toNumberOrUndef(formData.type_id),
      ct_ratio: formData.ct_ratio || '',  // CHANGE: Send empty string instead of null
      pt_ratio: formData.pt_ratio || '', 
    };

     console.log("Payload:", payload); 

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
    <MainLayout
    breadcrumb={breadcrumbs}
            navItems={transformerNavItems}
        >
      <div className="p-6">
        <CardHeader
          title={isEditing ? "Edit Transformer" : "Create Transformer"}
          subheading={
            isEditing
              ? "Update transformer details"
              : "Add a new transformer to the system"
          }
        />
        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderSection(
              "Basic Information",
              <>
                <Input
                  label="CT/PT Serial"
                  required
                  value={formData.ctpt_serial}
                  setValue={setFormValue("ctpt_serial")}
                  error={errors.ctpt_serial}
                />
                <SelectList
                  label="Ownership Type"
                  value={formData.ownership_type_id}
                  setValue={setFormValue("ownership_type_id")}
                  list={ownershipTypes}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.ownership_type_id}
                />
                <SelectList
                  label="Make"
                  value={formData.make_id}
                  setValue={setFormValue("make_id")}
                  list={makes}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.make_id}
                />
                <SelectList
                  label="Type"
                  value={formData.type_id}
                  setValue={handletypeChange}
                  list={types}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.type_id}
                />
              </>,
            )}

            {renderSection(
              "Technical Specifications",
              <>
                <SelectList
                  label="Accuracy Class"
                  value={formData.accuracy_class_id}
                  setValue={setFormValue("accuracy_class_id")}
                  list={accuracyClasses}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.accuracy_class_id}
                />
                <SelectList
                  label="Burden"
                  value={formData.burden_id}
                  setValue={setFormValue("burden_id")}
                  list={burdens}
                  dataKey="id"
                  displayKey="parameterValue"
                  error={errors.burden_id}
                />
                {transformerType == "CT" && <Input
                  label="CT Ratio"
                  type="text"
                  value={formData.ct_ratio}
                  setValue={setFormValue("ct_ratio")}
                  error={errors.ct_ratio}
                   disabled={selectedType === "PT"}
                />}
                {transformerType == "PT" && <Input
                  label="PT Ratio"
                  type="text"
                  value={formData.pt_ratio}
                  setValue={setFormValue("pt_ratio")}
                  error={errors.pt_ratio}
                   disabled={selectedType === "CT"}
                />}
                
               
              </>,
            )}

            <div className="flex justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                label="Cancel"
                variant="secondary"
                onClick={() => router.get("/meter-transformers")}
                disabled={loading}
              />
              <Button
                type="submit"
                label={isEditing ? "Update Transformer" : "Create Transformer"}
                disabled={loading}
              />
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
