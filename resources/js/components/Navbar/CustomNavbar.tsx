import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Link, usePage } from '@inertiajs/react'
import { Children } from 'react'
// Using local wrapped NavigationMenu (supports viewport prop)

export const NAV_ITEMS = [
  { title: 'Dashboard', href: '/dashboard', description: 'Your main overview' },
  { title: 'Services', href: '/services', description: 'Manage your services' },
  {
    title: 'Consumers',
    href: '/consumers',
    description: 'Customer data and tools',
    children: [
      { title: 'Parties', href: '/parties', description: 'Manage parties' },
      { title: 'Connections', href: '/connections', description: 'Manage connections' },
    ],
  },
  { title: 'Billing', href: '/billing', description: 'Invoices and payments' },
  { title: 'Accounts', href: '/accounts', description: 'User accounts and permissions' },
  {
    title: 'Settings',
    href: '/offices',
    description: '',
    children: [
      { title: 'Offices', href: '/offices', description: 'Manage office locations' },
      {
        title: 'Reference Data Management',
        href: '/parameter-value',
        description: 'Manage reference data',
      },
    ],
  },
]

export function CustomNavbar() {
  const { url } = usePage()

  return (
    <NavigationMenu
      viewport={false}
      className='w-full'
    >
      <NavigationMenuList className='relative border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'>
        {NAV_ITEMS.map((item) => {
          const childActive = (item.children || []).some((c) => url.startsWith(c.href))
          const isActive = childActive || url.startsWith(item.href)
          return (
            <NavigationMenuItem key={item.title}>
              {item.children ? (
                <>
                  <NavigationMenuTrigger data-active={isActive || undefined}>
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className='grid w-[420px] gap-1 p-3'>
                      {item.children.map((child) => {
                        const subActive = url.startsWith(child.href)
                        return (
                          <li key={child.title}>
                            <NavigationMenuLink
                              asChild
                              data-active={subActive || undefined}
                              data-variant='panel'
                            >
                              <Link href={child.href}>
                                <div className='font-medium'>{child.title}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        )
                      })}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                  data-active={isActive || undefined}
                >
                  <Link href={item.href}>{item.title}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
