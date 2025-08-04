import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (key: string) => {
        setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isOpen = openMenus[item.title];
                    const hasChildren = !!item.children;
                    // isActive if current page starts with this href or any child's href
                    const isActive =
                        page.url.startsWith(item.href) || (hasChildren && item?.children?.some((child) => page.url.startsWith(child.href)));

                    return (
                        <div key={item.title}>
                            <SidebarMenuItem>
                                {hasChildren ? (
                                    <SidebarMenuButton onClick={() => toggleMenu(item.title)} isActive={isActive} tooltip={{ children: item.title }}>
                                        <div className="flex w-full items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                {item.icon && <item.icon className="mr-2" />}
                                                {item.title}
                                            </span>
                                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </div>
                                    </SidebarMenuButton>
                                ) : (
                                    <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: item.title }}>
                                        <Link href={item.href} prefetch>
                                            <div className="flex items-center gap-2">
                                                {item.icon && <item.icon className="mr-2" />}
                                                {item.title}
                                            </div>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>

                            {/* Nested children */}
                            {hasChildren && isOpen && (
                                <div className="ml-6">
                                    {item?.children?.map((child) => {
                                        const childIsActive = page.url.startsWith(child.href);
                                        return (
                                            <SidebarMenuItem key={child.href}>
                                                <SidebarMenuButton asChild isActive={childIsActive} tooltip={{ children: child.title }}>
                                                    <Link href={child.href} prefetch>
                                                        <span>{child.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
