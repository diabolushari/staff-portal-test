import NormalText from '@/typography/NormalText'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '../ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  title: string
  items?: {
    title: string
    href?: string
    icon?: React.ReactNode
    children?: { title: string; href?: string; icon?: React.ReactNode }[]
  }[]
}

export default function LeftNavBar({ title, items = [] }: Props) {
  const [pathname, setPathname] = useState<string>('')

  useEffect(() => {
    setPathname(window.location.pathname) // current URL path
  }, [])

  return (
    <SidebarMenu className='p-4'>
      <NormalText>{title}</NormalText>

      {items.map((item) =>
        item.children && item.children.length > 0 ? (
          <Collapsible
            key={item.title}
            className='group/collapsible'
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <NormalText className='font-normal'>{item.title}</NormalText>
                  <ChevronDown className='ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children.map((child) => {
                    const isActive = pathname === child.href
                    return (
                      <SidebarMenuSubItem key={child.title}>
                        <a
                          href={child.href}
                          className={`block flex flex-row items-center gap-4 rounded px-2 py-1 text-sm ${
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
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a
                href={item.href}
                className={`w-full text-left ${
                  pathname === item.href
                    ? 'bg-[#D7EDFF] text-[#0E73F6]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <NormalText className='font-normal'>{item.title}</NormalText>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      )}
    </SidebarMenu>
  )
}
