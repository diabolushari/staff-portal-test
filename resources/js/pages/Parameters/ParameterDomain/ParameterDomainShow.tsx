import ViewParameterDetails from '@/components/Parameter/ViewParameterDetails'; // adjust path
import AppLayout from '@/layouts/app-layout';
import Card from '@/ui/Card/Card';
import CardHeader from '@/ui/Card/CardHeader';

export default function ParameterDomainShow({ domain }: { domain: any }) {
    const fields = [
        { label: 'Domain Name', key: 'domain_name' },
        { label: 'Description', key: 'description' },
        { label: 'Domain Code', key: 'domain_code' },
        { label: 'Managed By Module', key: 'managed_by_module_name' },
    ];

    return (
        <AppLayout>
            <CardHeader title="Parameter Domain" subheading="Parameter Domain Details" />
            <Card className="p-4">
                <ViewParameterDetails title="Parameter Domain" data={domain} fields={fields} />
            </Card>
        </AppLayout>
    );
}
