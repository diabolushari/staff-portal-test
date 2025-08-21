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
      href: '/settings',
      description: 'System configuration and options',
      children: [{ title: 'Offices', href: '/offices', description: 'Manage office locations' }],
    },
    { title: 'Test', href: '/page-ui', description: 'UI testing page' },
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.title}>
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
                        <NavigationMenuLink asChild>
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
