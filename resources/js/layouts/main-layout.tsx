import LeftNavBar from '@/components/Navbar/LeftNavBar'
import { navItem } from '@/components/Navbar/navitems'
import TopNavBar from '@/components/Navbar/TopNavBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BreadcrumbItem } from '@/types'
import { CustomBreadcrumb } from '@/ui/BreadCrumb'
interface Props {
  children: React.ReactNode
  breadcrumb?: BreadcrumbItem[]
  navItems?: navItem[]
}

export default function MainLayout({ children, breadcrumb, navItems }: Readonly<Props>) {
  return (
    <SidebarProvider>
      <div className='flex h-screen w-full flex-col'>
        <div className=''>
          <TopNavBar />
        </div>

        <div className='flex flex-1'>
          <div className='hidden w-60 border-r lg:block'>
            <LeftNavBar
              title='Navigation'
              items={navItems}
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
