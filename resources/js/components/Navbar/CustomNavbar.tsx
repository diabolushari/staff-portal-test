import { NavigationMenu } from '@radix-ui/react-navigation-menu'
import { Link } from '@inertiajs/react'
import {
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu'

export function CustomNavbar() {
  const items = [
    { title: 'Dashboard', href: '/dashboard', description: 'Your main overview' },
    { title: 'Services', href: '/services', description: 'Manage your services' },
    { title: 'Consumers', href: '/consumers', description: 'Customer data and tools' },
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

  return (
    <NavigationMenu>
      <NavigationMenuList className='relative z-50 bg-white dark:bg-gray-800'>
        {items.map((item) => (
          <NavigationMenuItem
            key={item.title}
            className='flex gap-4 bg-white px-4 py-2'
          >
            {item.children ? (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid w-[400px] gap-2 p-4'>
                    {/* Optional: render the parent itself first */}
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href={item.href}>
                          <div className='font-medium'>{item.title}</div>
                          <div className='text-muted-foreground text-sm'>{item.description}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {item.children.map((child) => (
                      <li key={child.title}>
                        <NavigationMenuLink
                          asChild
                          className='bg:white hover:bg-gray-100'
                        >
                          <Link href={child.href}>
                            <div className='font-medium'>{child.title}</div>
                            <div className='text-muted-foreground text-sm'>{child.description}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={item.href}>{item.title}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
