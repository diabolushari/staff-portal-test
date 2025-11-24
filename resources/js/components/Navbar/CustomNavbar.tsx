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
// Using local wrapped NavigationMenu (supports viewport prop)

export const NAV_ITEMS = [
  {
    title: 'Consumers',
    href: '/consumers',
    description: 'Customer data and tools',
    children: [
      { title: 'Connections', href: '/connections', description: 'Manage connections' },
      // { title: 'Meters', href: '/meters', description: 'Manage meters' },
      // { title: 'Meter CTPT', href: '/meter-ctpt', description: 'Manage meter CTPT' },
    ],
  },
  {
    title: 'Billing',
    href: '/billing',
    description: 'Invoices and payments',
    children: [
      {
        title: 'Meter Readings',
        href: '/meter-readings',
        description: 'Manage meter readings',
        disabled: true,
      },
      { title: 'Billing', href: '/billing-groups', description: 'Manage billing' },
    ],
  },

  {
    title: 'Admin',
    href: '/offices',
    description: '',
    children: [
      { title: 'Offices', href: '/offices', description: 'Manage office locations' },
      {
        title: 'Meta data Management',
        href: '/parameter-value',
        description: 'Manage meta data',
      },
      {
        title: 'Meters',
        href: '/meters',
        description: 'Manage meters',
      },
      {
        title: 'Metering Time Zones',
        href: '/metering-timezone',
        description: 'Manage metering time zones',
      },
      {
        title: 'Tariff Management',
        href: '/tariff-orders',
        description: 'Manage tariff',
      },
      {
        title: 'Billing',
        href: '/billing-rules',
        description: 'Manage billing',
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
                              <Link href={child.disabled ? '' : child.href}>
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
