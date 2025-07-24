import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { props: pageProps } = usePage();
    if (pageProps.auth.user === null) {
        router.visit(route('login'));
    } else {
        return (
            <>
                <ToastContainer />
                <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </AppLayoutTemplate>
            </>
        );
    }
};
