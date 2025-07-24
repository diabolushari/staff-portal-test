import useCustomForm from '@/hooks/useCustomForm';
import useInertiaPost from '@/hooks/useInertiaPost';
import StrongText from '@/typography/StrongText';
import Button from '@/ui/button/Button';
import DynamicSelectList from '@/ui/form/DynamicSelectList';
import Input from '@/ui/form/Input';
import TextArea from '@/ui/form/TextArea';

export default function ParameterValueCreate({ data }: { data?: any }) {
    const { formData, setFormValue, toggleBoolean } = useCustomForm({
        definition_id: data?.definition_id || '',
        parameter_code: data?.parameter_code || '',
        parameter_value: data?.parameter_value || '',
        attribute1_value: data?.attribute1_value || '',
        attribute2_value: data?.attribute2_value || '',
        attribute3_value: data?.attribute3_value || '',
        attribute4_value: data?.attribute4_value || '',
        attribute5_value: data?.attribute5_value || '',
        effective_start_date: data?.effective_start_date || '',
        effective_end_date: data?.effective_end_date || '',
        sort_priority: data?.sort_priority || '',
        notes: data?.notes || '',
    });

    const { post, errors } = useInertiaPost(data ? route('parameter-value.update', data.id) : route('parameter-value.store'), {
        onComplete: () => {
            window.location.href = route('parameter-value.index');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(data ? { ...formData, _method: 'PUT' } : formData);
    };

    return (
        <div className="mx-auto max-w-5xl py-8">
            <h2 className="mb-4 text-2xl font-semibold">{data ? 'Edit Parameter Value' : 'Create Parameter Value'}</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2 flex flex-col">
                    <DynamicSelectList
                        url="/api/parameter-definitions"
                        dataKey="id"
                        displayKey="parameter_name"
                        label="Definition"
                        setValue={setFormValue('definition_id')}
                        value={formData.definition_id}
                        error={errors?.definition_id}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <Input
                        label="Parameter Code"
                        value={formData.parameter_code}
                        setValue={setFormValue('parameter_code')}
                        error={errors?.parameter_code}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <Input
                        label="Parameter Value"
                        value={formData.parameter_value}
                        setValue={setFormValue('parameter_value')}
                        error={errors?.parameter_value}
                        required
                    />
                </div>
                <div className="col-span-2 flex flex-col">
                    <StrongText>Attribute Values</StrongText>
                </div>
                <div className="flex flex-col">
                    <Input
                        label="Attribute 1 Value"
                        value={formData.attribute1_value}
                        setValue={setFormValue('attribute1_value')}
                        error={errors?.attribute1_value}
                    />
                </div>

                <div className="flex flex-col">
                    <Input
                        label="Attribute 2 Value"
                        value={formData.attribute2_value}
                        setValue={setFormValue('attribute2_value')}
                        error={errors?.attribute2_value}
                    />
                </div>

                <div className="flex flex-col">
                    <Input
                        label="Attribute 3 Value"
                        value={formData.attribute3_value}
                        setValue={setFormValue('attribute3_value')}
                        error={errors?.attribute3_value}
                    />
                </div>

                <div className="flex flex-col">
                    <Input
                        label="Attribute 4 Value"
                        value={formData.attribute4_value}
                        setValue={setFormValue('attribute4_value')}
                        error={errors?.attribute4_value}
                    />
                </div>

                <div className="flex flex-col">
                    <Input
                        label="Attribute 5 Value"
                        value={formData.attribute5_value}
                        setValue={setFormValue('attribute5_value')}
                        error={errors?.attribute5_value}
                    />
                </div>
                <div></div>

                <div className="flex flex-col">
                    <Input
                        label="Effective Start Date"
                        type="date"
                        value={formData.effective_start_date}
                        setValue={setFormValue('effective_start_date')}
                        error={errors?.effective_start_date}
                    />
                </div>

                <div className="flex flex-col">
                    <Input
                        label="Effective End Date"
                        type="date"
                        value={formData.effective_end_date}
                        setValue={setFormValue('effective_end_date')}
                        error={errors?.effective_end_date}
                    />
                </div>

                <div className="flex flex-col">
                    <Input
                        label="Sort Priority"
                        type="number"
                        value={formData.sort_priority}
                        setValue={setFormValue('sort_priority')}
                        error={errors?.sort_priority}
                    />
                </div>

                <div className="flex flex-col">
                    <TextArea label="Notes" value={formData.notes} setValue={setFormValue('notes')} error={errors?.notes} />
                </div>

                <div className="col-span-full mt-4 flex justify-between gap-4">
                    <Button type="button" variant="outline" onClick={() => history.back()} label="Cancel" />
                    <Button type="submit" label="Save" />
                </div>
            </form>
        </div>
    );
}
