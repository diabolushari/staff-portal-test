import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DeleteButton from '../button/DeleteButton';
import EditButton from '../button/EditButton';
import Modal from '../Modal/Modal';
interface CustomTableProps {
    title?: string;
    subheading?: string;
    data: Array<Record<string, any>>;
    columns: Array<{
        header: string;
        accessor: string;
        render?: (value: any, row: Record<string, any>) => React.ReactNode;
    }>;
    className?: string;
    serialNumber?: boolean;
}

const CustomTable: React.FC<CustomTableProps> = ({ title, subheading, data, columns, className, serialNumber }) => {
    // Default render function for the Actions column
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<any>(null);

    const handleDeleteClick = (row: any) => {
        setRowToDelete(row);
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        try {
            await router.delete(rowToDelete.actions.deleteUrl);
            setShowDeleteModal(false);
            toast.success('Module deleted successfully');
        } catch (error: any) {
            setShowDeleteModal(false);

            // If server returns JSON with message
            const msg = error?.response?.data?.error || error.message || 'Unknown error';

            toast.error('Failed to delete module: ' + msg);
        }
    };

    const defaultActionsRender = (value: any, row: any, onClick: any) => (
        <div className="flex space-x-3">
            {row.actions?.editUrl && <EditButton link={row.actions.editUrl} />}
            {row.actions?.editOnclick && <EditButton onClick={row.actions.editOnclick} />}
            {row.actions?.deleteUrl && <DeleteButton onClick={() => handleDeleteClick(row)} />}
            {row.actions?.viewUrl && (
                <a
                    href={row.actions.viewUrl}
                    className="inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-green-700"
                >
                    View
                </a>
            )}

            {row.actions?.deleteOnclick && <DeleteButton onClick={row.actions.deleteOnclick} />}
            {row.actions?.viewOnclick && (
                <a href={row.actions.viewUrl} onClick={row.actions.viewOnclick}>
                    View
                </a>
            )}
        </div>
    );

    return (
        <div className={cn('w-full rounded-xl border border-border/50 bg-background p-6 shadow-lg', 'transition-all duration-300', className)}>
            {title && <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">{title}</h2>}
            {subheading && <p className="mb-4 text-sm text-muted-foreground italic">{subheading}</p>}
            <div className="relative overflow-hidden rounded-lg bg-card">
                <Table className="border-none">
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-b border-border/30">
                            {serialNumber && <TableHead className="px-4 py-3 font-semibold text-foreground">S.No</TableHead>}
                            {columns.map((column, index) => (
                                <TableHead key={index} className="px-4 py-3 font-semibold text-foreground">
                                    {column.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                className={cn(
                                    'border-b border-border/20',
                                    'transition-all duration-200 hover:bg-muted/10',
                                    'hover:-translate-y-0.5 hover:shadow-inner',
                                )}
                            >
                                {serialNumber && (
                                    <TableCell key={rowIndex} className="px-4 py-3">
                                        {rowIndex + 1}
                                    </TableCell>
                                )}
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} className="px-4 py-3">
                                        {column.accessor === 'actions' && !column.render
                                            ? defaultActionsRender(row[column.accessor], row)
                                            : column.render
                                              ? column.render(row[column.accessor], row)
                                              : row[column.accessor]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                    {(title || subheading) && (
                        <TableCaption className="py-2 text-muted-foreground">
                            {title || subheading} - {data.length} items
                        </TableCaption>
                    )}
                </Table>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal title="Confirm Deletion" setShowModal={setShowDeleteModal}>
                    <div className="px-6 py-4 text-gray-700">
                        Are you sure you want to delete <strong>{rowToDelete?.name}</strong>?
                    </div>
                    <div className="flex justify-end space-x-4 px-6 pt-2">
                        <button className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                        <button className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700" onClick={confirmDelete}>
                            Delete
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// Sample usage component
const SampleTable: React.FC = () => {
    const sampleData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Developer',
            actions: { edit: '/edit/1', delete: '/delete/1', view: '/view/1' },
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'Designer',
            actions: { edit: '/edit/2', delete: '/delete/2' }, // No view action
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'Manager',
            actions: { edit: '/edit/3', view: '/view/3' }, // No delete action
        },
    ];

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', accessor: 'role' },
        { header: 'Actions', accessor: 'actions' }, // No render or optionalButton
    ];

    return (
        <CustomTable
            title="User Directory"
            subheading="List of active team members"
            data={sampleData}
            columns={columns}
            className="mx-auto max-w-5xl"
        />
    );
};

export default CustomTable;
export { SampleTable };
