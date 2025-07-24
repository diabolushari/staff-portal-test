import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { ListTreeIcon, Package } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Parameter',
        href: '/parameter-definition',
        icon: ListTreeIcon,
        children: [
            {
                title: 'Domain',
                href: '/parameter-domain',
            },
            {
                title: 'Definition',
                href: '/parameter-definition',
            },
            {
                title: 'Values',
                href: '/parameter-value',
            },
        ],
    },
    {
        title: 'System Modules',
        href: '/system-module',
        icon: Package,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <h1>KSEB MBC</h1>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
