import { HomeIcon, ListIcon, SettingsIcon } from 'lucide-react'

export interface navItem {
  title: string
  href: string
  icon?: React.ReactNode
  children?: navItem[]
}
export const settingsNavItems: navItem[] = [
  {
    title: 'Search Offices',
    href: '/offices',
    icon: <ListIcon className='h-4 w-4' />,
  },

  {
    title: 'Add Office',
    href: '/offices/create',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]
