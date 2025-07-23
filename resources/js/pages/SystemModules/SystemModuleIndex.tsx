import { Card } from '@/components/ui/card';
import useCustomForm from '@/hooks/useCustomForm';
import useInertiaPost from '@/hooks/useInertiaPost';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Button from '@/ui/button/Button';
import CardHeader from '@/ui/Card/CardHeader';
import Input from '@/ui/form/Input';
import { Head } from '@inertiajs/react';

export default function SystemModuleIndex({ systemModules }: { systemModules: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'System Modules',
            href: '/system-module',
        },
    ];
    const { formData, setFormValue } = useCustomForm({
        system_module_name: '',
    });
    const { post, errors, loading } = useInertiaPost(route('system-module.store'));
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(formData);
    };
    console.log('datas', systemModules);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Modules" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <CardHeader title="System Modules" addUrl="/system-module/create" />
                <Card>
                    <div className="p-4 lg:w-[50%]">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="System Module Name"
                                        setValue={setFormValue('system_module_name')}
                                        value={formData.system_module_name}
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-5">
                                <Button type="submit" label="Submit" />
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
