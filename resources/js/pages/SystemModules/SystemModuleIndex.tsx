import { Card } from '@/components/ui/card';
import useCustomForm from '@/hooks/useCustomForm';
import useInertiaPost from '@/hooks/useInertiaPost';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Button from '@/ui/button/Button';
import Input from '@/ui/form/Input';
import CustomTable from '@/ui/Table/CustomTable';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function SystemModuleIndex({ systemModules }: { systemModules: any }) {
    const [editRow, setEditRow] = useState<any>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'System Modules',
            href: '/system-module',
        },
    ];
    const { formData, setFormValue } = useCustomForm({
        system_module_name: '',
    });
    const { post, errors, loading } = useInertiaPost(editRow ? route('system-module.update', editRow.id) : route('system-module.store'), {
        showErrorToast: true,
        onComplete: () => {
            setEditRow(null);
            setFormValue('system_module_name')('');
        },
    });
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(editRow ? { ...formData, _method: 'PUT' } : formData);
    };
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'System Module Name', accessor: 'name' },
        { header: 'Actions', accessor: 'actions' },
    ];

    const handleEditClick = (row: any) => {
        setEditRow(row);
        setFormValue('system_module_name')(row.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const data = systemModules;
    const dataWithActions = data.map((item: any) => ({
        ...item,
        actions: {
            editOnclick: () => handleEditClick(item),
            deleteUrl: route('system-module.destroy', item.id),
        },
    }));
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Modules" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-2 lg:w-[50%]">
                    <div className="mb-5 flex flex-col gap-1">
                        <h1>System Module</h1>
                        <p>Add a new system module. System modules for temporary use.</p>
                    </div>
                    <Card className="p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label={editRow ? 'Edit System Module Name' : 'Create System Module Name'}
                                        setValue={setFormValue('system_module_name')}
                                        value={formData.system_module_name}
                                        placeholder={editRow ? '' : 'Type your System Module Name'}
                                        error={errors?.system_module_name}
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="mt-12">
                                    {editRow && (
                                        <Button
                                            label="Cancel"
                                            onClick={() => {
                                                setEditRow(null);
                                                setFormValue('system_module_name')('');
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="mt-5">
                                <Button type="submit" label={editRow ? 'Update' : 'Submit'} />
                            </div>
                        </form>
                    </Card>
                </div>
                <CustomTable columns={columns} data={dataWithActions} serialNumber={true} />
            </div>
        </AppLayout>
    );
}
