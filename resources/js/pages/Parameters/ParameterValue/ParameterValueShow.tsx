import ViewParameterDetail from '@/components/Parameter/ViewParameterDetails';
import AppLayout from '@/layouts/app-layout';

export default function ParameterValueShow({ data }: { data: any }) {
    const allFields = [
        { label: 'Parameter Code', key: 'parameter_code' },
        { label: 'Parameter Value', key: 'parameter_value' },
        { label: 'Attribute 1 Value', key: 'attribute1_value' },
        { label: 'Attribute 2 Value', key: 'attribute2_value' },
        { label: 'Attribute 3 Value', key: 'attribute3_value' },
        { label: 'Attribute 4 Value', key: 'attribute4_value' },
        { label: 'Attribute 5 Value', key: 'attribute5_value' },
        { label: 'Effective Start Date', key: 'effective_start_date' },
        { label: 'Effective End Date', key: 'effective_end_date' },
        { label: 'Sort Priority', key: 'sort_priority' },
        { label: 'Notes', key: 'notes' },
    ];

    const filteredFields = allFields.filter((field) => {
        const isAttributeField = field.key.startsWith('attribute');
        const value = data?.[field.key];
        if (isAttributeField) {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        }
        return true; // always include non-attribute fields
    });

    return (
        <AppLayout>
            <ViewParameterDetail title="Parameter Value Details" data={data} fields={filteredFields} />
        </AppLayout>
    );
}
