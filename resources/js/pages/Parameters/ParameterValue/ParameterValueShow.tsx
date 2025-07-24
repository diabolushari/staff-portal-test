import ViewParameterDetail from '@/components/Parameter/ViewParameterDetails';
import AppLayout from '@/layouts/app-layout';

export default function ParameterValueShow({ data }: { data: any }) {
    const fields = [
        { label: 'Parameter Code', key: 'parameter_code' },
        { label: 'Parameter Value', key: 'parameter_value' },
        { label: 'Attribute 1 Value', key: 'attribute1_value' },
        { label: 'Attribute 2 Value', key: 'attribute2_value' },
        { label: 'Attribute 3 Value', key: 'attribute3_value' },
        { label: 'Attribute 4 Value', key: 'attribute4_value' },
        { label: 'Attribute 5 Value', key: 'attribute5_value' },
        { label: 'Effective Start Date', key: 'effective_start_date' },
        { label: 'Effective End Date', key: 'effective_end_date' },
        { label: 'Is Active', key: 'is_active' },
        { label: 'Sort Priority', key: 'sort_priority' },
        { label: 'Notes', key: 'notes' },
    ];

    return (
        <AppLayout>
            <ViewParameterDetail title="Parameter Value Details" data={data} fields={fields} />
        </AppLayout>
    );
}
