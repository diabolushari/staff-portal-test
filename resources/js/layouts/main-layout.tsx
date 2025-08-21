import LeftNavBar from '@/components/Navbar/LeftNavBar'
import { navItem } from '@/components/Navbar/navitems'
import TopNavBar from '@/components/Navbar/TopNavBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BreadcrumbItem } from '@/types'
import { CustomBreadcrumb } from '@/ui/BreadCrumb'
import { settingsNavItems } from '@/components/Navbar/navitems'
interface Props {
  children: React.ReactNode
  breadcrumb?: BreadcrumbItem[]
  navItems?: navItem[]
}

export default function MainLayout({ children, breadcrumb, navItems }: Props) {
  return (
    <SidebarProvider>
      <div className='flex h-screen w-full flex-col'>
        <div className=''>
          <TopNavBar />
        </div>

        <div className='flex flex-1'>
          <div className='w-60 border-r'>
            <LeftNavBar
              title='Navigation'
              items={navItems ?? settingsNavItems}
            />
          </div>

          <main className='flex-1 p-4'>
            <div>
              <div className='p-2'>
                <CustomBreadcrumb list={breadcrumb ?? []} />
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
