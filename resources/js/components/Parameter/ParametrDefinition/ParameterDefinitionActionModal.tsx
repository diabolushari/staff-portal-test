import useCustomForm from '@/hooks/useCustomForm';
import useInertiaPost from '@/hooks/useInertiaPost';
import Button from '@/ui/button/Button';
import CheckBox from '@/ui/form/CheckBox';
import DynamicSelectList from '@/ui/form/DynamicSelectList';
import Input from '@/ui/form/Input';
import Modal from '@/ui/Modal/Modal';

export default function ParameterDefinitionActionModal({ show, onClose, editRow }: { show: boolean; onClose: () => void; editRow: any }) {
    const { formData, setFormValue, toggleBoolean } = useCustomForm({
        parameter_name: editRow?.parameter_name ? editRow?.parameter_name : '',
        attribute1_name: editRow?.attribute1_name ? editRow?.attribute1_name : '',
        attribute2_name: editRow?.attribute2_name ? editRow?.attribute2_name : '',
        attribute3_name: editRow?.attribute3_name ? editRow?.attribute3_name : '',
        attribute4_name: editRow?.attribute4_name ? editRow?.attribute4_name : '',
        attribute5_name: editRow?.attribute5_name ? editRow?.attribute5_name : '',
        is_effective_date_driven: editRow?.is_effective_date_driven ? editRow?.is_effective_date_driven : false,
        domain_id: editRow?.domain_id ? editRow?.domain_id : '',
    });
    const { post, errors } = useInertiaPost(editRow ? route('parameter-definition.update', editRow.id) : route('parameter-definition.store'), {
        onComplete: () => {
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(editRow ? { ...formData, _method: 'PUT' } : formData);
    };
    return (
        <Modal title="Edit Parameter Definition" setShowModal={onClose}>
            <div className="p-4">
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6 md:grid md:grid-cols-2">
                        <div className="flex flex-col">
                            <Input
                                label="Parameter Name"
                                value={formData.parameter_name}
                                setValue={setFormValue('parameter_name')}
                                error={errors?.parameter_name}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <DynamicSelectList
                                url="api/parameter-domains"
                                dataKey="id"
                                displayKey="name"
                                setValue={setFormValue('domain_id')}
                                value={formData.domain_id}
                                label="Parameter Domain"
                                required
                                error={errors?.domain_id}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Input
                                label="Attribute 1 Name"
                                value={formData.attribute1_name}
                                setValue={setFormValue('attribute1_name')}
                                error={errors?.attribute1_name}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Input
                                label="Attribute 2 Name"
                                value={formData.attribute2_name}
                                setValue={setFormValue('attribute2_name')}
                                error={errors?.attribute2_name}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Input
                                label="Attribute 3 Name"
                                value={formData.attribute3_name}
                                setValue={setFormValue('attribute3_name')}
                                error={errors?.attribute3_name}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Input
                                label="Attribute 4 Name"
                                value={formData.attribute4_name}
                                setValue={setFormValue('attribute4_name')}
                                error={errors?.attribute4_name}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Input
                                label="Attribute 5 Name"
                                value={formData.attribute5_name}
                                setValue={setFormValue('attribute5_name')}
                                error={errors?.attribute5_name}
                            />
                        </div>
                        <div className="flex flex-col">
                            <CheckBox
                                label="Is Effective Date Driven"
                                value={formData.is_effective_date_driven}
                                toggleValue={toggleBoolean('is_effective_date_driven')}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between gap-2">
                        <Button type="button" onClick={onClose} variant="outline" label="Cancel" />
                        <Button type="submit" label="Save" />
                    </div>
                </form>
            </div>
        </Modal>
    );
}
