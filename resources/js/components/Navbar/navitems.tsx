import { HomeIcon, ListIcon, SettingsIcon } from 'lucide-react'

export interface navItem {
  title: string
  href: string
  icon?: React.ReactNode
  children?: navItem[]
}
export const settingsOffices: navItem[] = [
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

export const settingsReferenceData: navItem[] = [
  {
    title: 'System Modules',
    href: '/system-module',
    icon: <ListIcon className='h-4 w-4' />,
  },

  {
    title: 'Parameter Domain',
    href: '/parameter-domain',
    icon: <HomeIcon className='h-4 w-4' />,
  },

  {
    title: 'Parameter Definition',
    href: '/parameter-definition',
    icon: <HomeIcon className='h-4 w-4' />,
  },

  {
    title: 'Parameter Values',
    href: '/parameter-value',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]

export const connectionsNavItems: navItem[] = [
  {
    title: 'Search Connections',
    href: '/connections',
    icon: <ListIcon className='h-4 w-4' />,
  },

  {
    title: 'Add Connection',
    href: '/connections/create',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]
export const partiesNavItems: navItem[] = [
  {
    title: 'Search Parties',
    href: '/parties',
    icon: <ListIcon className='h-4 w-4' />,
  },

  {
    title: 'Add Party',
    href: '/parties/create',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]
