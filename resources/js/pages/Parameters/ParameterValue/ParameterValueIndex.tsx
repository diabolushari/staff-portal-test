import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import CardHeader from '@/ui/Card/CardHeader';
import CustomTable from '@/ui/Table/CustomTable';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Parameter Code', accessor: 'parameter_code' },
    { header: 'Parameter Value', accessor: 'parameter_value' },
    { header: 'Definition Name', accessor: 'definition_name' },

    { header: 'Notes', accessor: 'notes' },
    { header: 'Actions', accessor: 'actions' },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Parameter Values',
        href: '/parameter-value',
    },
];

export default function ParameterValueIndex({ values }: { values: any[] }) {
    const dataWithActions = values.map((item: any) => ({
        ...item,
        actions: {
            editUrl: route('parameter-value.edit', item.id),
            deleteUrl: route('parameter-value.destroy', item.id),
            viewUrl: route('parameter-value.show', item.id),
        },
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <CardHeader title="Parameter Values" subheading="Add a new parameter value." addUrl={route('parameter-value.create')} />

                <div>
                    <CustomTable columns={columns} data={dataWithActions} serialNumber={true} />
                </div>
            </div>
        </AppLayout>
    );
}
