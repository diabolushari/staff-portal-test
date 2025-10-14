import LeftNavBar from '@/components/Navbar/LeftNavBar'
import { navItem } from '@/components/Navbar/navitems'
import TopNavBar from '@/components/Navbar/TopNavBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BreadcrumbItem, PageProps } from '@/types'
import CustomBreadcrumb from '@/ui/BreadCrumb'
import AddButton from '@/ui/button/AddButton'
import { router, usePage } from '@inertiajs/react'
import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'

interface Props {
  children: React.ReactNode
  breadcrumb?: BreadcrumbItem[]
  navItems?: navItem[]
  addBtnUrl?: string
  addBtnText?: string
  addBtnClick?: () => void
  leftBarTitle?: string
}

export default function MainLayout({
  children,
  breadcrumb,
  navItems,
  addBtnUrl,
  addBtnText,
  addBtnClick,
  leftBarTitle,
}: Readonly<Props>) {
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
              title={leftBarTitle ?? 'Navigation'}
              items={navItems}
            />
          </div>

          <main className='flex-1 p-4'>
            <div>
              <div className='flex justify-between p-2'>
                <CustomBreadcrumb list={breadcrumb ?? []} />
                <div>
                  {addBtnUrl && (
                    <AddButton
                      onClick={() => router.get(addBtnUrl)}
                      buttonText={`Add ${addBtnText}`}
                    />
                  )}
                  {addBtnClick && (
                    <AddButton
                      onClick={addBtnClick}
                      buttonText={`Add ${addBtnText}`}
                    />
                  )}
                </div>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
