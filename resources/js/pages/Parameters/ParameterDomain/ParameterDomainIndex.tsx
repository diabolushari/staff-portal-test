import ParameterDomainActionModal from '@/components/Parameter/ParameterDomain/ParameterDomainActionModal';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import CardHeader from '@/ui/Card/CardHeader';
import CustomTable from '@/ui/Table/CustomTable';
import { useState } from 'react';
const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Domain Name', accessor: 'domain_name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Domain Code', accessor: 'domain_code' },
    { header: 'Managed By Module Name', accessor: 'managed_by_module_name' },
    { header: 'Actions', accessor: 'actions' },
];
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Parameter Domains',
        href: '/parameter-domain',
    },
];
export default function ParameterDomainIndex({ domains }: { domains: any }) {
    const [editRow, setEditRow] = useState<any>(null);

    const dataWithActions = domains.map((item: any) => ({
        ...item,
        actions: {
            editOnclick: () => handleEditClick(item),
            deleteUrl: route('parameter-domain.destroy', item.id),
            viewUrl: route('parameter-domain.show', item.id),
        },
    }));

    const handleEditClick = (item: any) => {
        setEditRow(item);
        setShowModal(true);
    };
    const [showModal, setShowModal] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <CardHeader
                    title="Parameter Domains"
                    subheading="Add a new parameter domain."
                    onAddClick={() => {
                        setEditRow(false);
                        setShowModal(true);
                    }}
                />

                <div>
                    <CustomTable columns={columns} data={dataWithActions} serialNumber={true} />
                </div>
            </div>
            {showModal && (
                <ParameterDomainActionModal title="Add Parameter Domain" setShowModal={setShowModal} show={showModal} initialData={editRow} />
            )}
        </AppLayout>
    );
}
