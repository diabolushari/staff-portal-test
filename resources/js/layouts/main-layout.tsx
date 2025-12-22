import LeftNavBar from '@/components/Navbar/LeftNavBar'
import { MainNav } from '@/components/Navbar/navitems'
import TopNavBar from '@/components/Navbar/TopNavBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BreadcrumbItem, PageProps } from '@/types'
import StrongText from '@/typography/StrongText'
import { showError, showInfo, showSuccess } from '@/ui/alerts'
import CustomBreadcrumb from '@/ui/BreadCrumb'
import AddButton from '@/ui/button/AddButton'
import { router, usePage } from '@inertiajs/react'
import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'

interface Props {
  children: React.ReactNode
  breadcrumb?: BreadcrumbItem[]
  navItems?: MainNav
  addBtnUrl?: string
  addBtnText?: string
  addBtnClick?: () => void
  leftBarTitle?: string
  title?: string
  selectedItem?: string
  selectedTopNav?: string
}

export default function MainLayout({
  children,
  breadcrumb,
  navItems,
  addBtnUrl,
  addBtnText,
  addBtnClick,
  title,
  selectedItem,
  selectedTopNav,
}: Readonly<Props>) {
  const { flash } = usePage<PageProps>().props

  useEffect(() => {
    if (flash?.message) {
      showSuccess(flash.message)
    }
    if (flash?.error) {
      showError(flash.error)
    }
    if (flash?.debug) {
      console.log(flash.debug)
      flash.debug.forEach((debug) => {
        showInfo(debug)
      })
    }
  }, [flash])

  return (
    <SidebarProvider>
      <ToastContainer theme='dark' />
      <div className='flex h-screen w-full flex-col'>
        <div className=''>
          <TopNavBar selectedTopNav={selectedTopNav} />
        </div>

        <div className='flex flex-1'>
          <div className='hidden w-60 border-r lg:block'>
            <LeftNavBar
              title={''}
              selectedItem={selectedItem}
              items={navItems}
            />
          </div>

          <main className='flex-1 p-4'>
            <div>
              {title && (
                <div className='px-2 pt-2'>
                  <StrongText className='text-2xl font-semibold'>{title}</StrongText>
                </div>
              )}

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

              <div className='flex flex-col gap-4 overflow-x-auto p-2'>{children}</div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
