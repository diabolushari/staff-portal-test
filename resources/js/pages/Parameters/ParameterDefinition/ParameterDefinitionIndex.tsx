import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import CardHeader from '@/ui/Card/CardHeader';
import CustomTable from '@/ui/Table/CustomTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Parameter Definition',
        href: '/parameter-definition',
    },
];

export default function ParameterDefinitionIndex({ parameterDefinitions }: { parameterDefinitions: any }) {
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Parameter Name', accessor: 'parameter_name' },
        { header: 'Domain Name', accessor: 'domain_name' },
        { header: 'Attribute 1', accessor: 'attribute1_name' },
        { header: 'Attribute 2', accessor: 'attribute2_name' },
        { header: 'Attribute 3', accessor: 'attribute3_name' },
        { header: 'Attribute 4', accessor: 'attribute4_name' },
        { header: 'Attribute 5', accessor: 'attribute5_name' },
        { header: 'Actions', accessor: 'actions' },
    ];
    console.log(parameterDefinitions);
    const dataWithActions = parameterDefinitions.map((item: any) => ({
        ...item,
        actions: {
            editUrl: route('parameter-definition.edit', item.id),
            deleteUrl: route('parameter-definition.destroy', item.id),
        },
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <CardHeader title="Parameter Definition" subheading="Parameter Definition" addUrl={route('parameter-definition.create')} />
                <CustomTable columns={columns} data={dataWithActions} serialNumber={true} />
            </div>
        </AppLayout>
    );
}
