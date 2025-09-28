import LeftNavBar from '@/components/Navbar/LeftNavBar'
import { navItem } from '@/components/Navbar/navitems'
import TopNavBar from '@/components/Navbar/TopNavBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BreadcrumbItem, PageProps } from '@/types'
import CustomBreadcrumb from '@/ui/BreadCrumb'
import { usePage } from '@inertiajs/react'
import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'

interface Props {
  children: React.ReactNode
  breadcrumb?: BreadcrumbItem[]
  navItems?: navItem[]
}

export default function MainLayout({ children, breadcrumb, navItems }: Readonly<Props>) {
  const { flash } = usePage<PageProps>().props

  useEffect(() => {
    if (flash?.message) {
      toast.success(flash.message)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  return (
    <SidebarProvider>
      <ToastContainer theme='dark' />
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
