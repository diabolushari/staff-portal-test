import NormalText from '@/typography/NormalText'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '../ui/sidebar'

interface Props {
  title: string
  selectedItem?: string
  items?: {
    title: string
    href?: string
    icon?: React.ReactNode
    children?: { title: string; href?: string; icon?: React.ReactNode }[]
  }[]
}

export default function LeftNavBar({ title, items = [], selectedItem }: Props) {
  console.log(selectedItem)
  return (
    <SidebarMenu className='p-4'>
      <NormalText>{title}</NormalText>

      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0

        return (
          <SidebarMenuItem key={item.title}>
            {/* MAIN HEADING IF CHILDREN */}
            {hasChildren ? (
              <div className='flex items-center gap-2 py-1'>
                {item.icon}
                <NormalText className='font-semibold'>{item.title}</NormalText>
              </div>
            ) : (
              // LEFT ALIGNED MENU ITEM IF NO CHILDREN
              <SidebarMenuButton asChild>
                <a
                  href={item.href}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left ${
                    selectedItem === item.title
                      ? 'bg-[#D7EDFF] text-blue-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <NormalText className='font-normal'>{item.title}</NormalText>
                </a>
              </SidebarMenuButton>
            )}

            {/* CHILDREN */}
            {hasChildren && (
              <SidebarMenuSub className='mt-1 ml-4'>
                {item.children!.map((child) => {
                  const isActive = selectedItem === child.title

                  return (
                    <SidebarMenuSubItem key={child.title}>
                      <a
                        href={child.href}
                        className={`flex items-center gap-3 rounded px-2 py-1 text-sm ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {child.icon}
                        {child.title}
                      </a>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
