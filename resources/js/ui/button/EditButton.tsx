import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { EditIcon } from 'lucide-react';
import React from 'react';

interface Props {
    link?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
}

export default function EditButton({ link, onClick }: Props) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (link != null) {
            router.get(link);
            return;
        }
        if (onClick != null) {
            onClick(e);
        }
    };

    return (
        <Button
            variant="highlight"
            size="icon"
            className="transition-transform hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={handleClick}
        >
            <EditIcon className="h-6 w-6 stroke-[2.5]" />
        </Button>
    );
}
