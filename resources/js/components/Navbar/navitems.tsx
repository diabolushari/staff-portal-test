import { HomeIcon, ListIcon } from 'lucide-react'
import React from 'react'

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

export const meterTimezoneNavItems: navItem[] = [
  {
    title: 'Search Metering Timezones',
    href: '/metering-timezone',
    icon: <ListIcon className='h-4 w-4' />,
  },

  {
    title: 'Add Metering Timezone',
    href: '/metering-timezone/create',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]
export const meterNavItems: navItem[] = [
  {
    title: 'Search Meters',
    href: '/meters',
    icon: <ListIcon className='h-4 w-4' />,
  },

  {
    title: 'Add Meter',
    href: '/meters/create',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]

export const settingsParties: navItem[] = [
  {
    title: 'Search Parties',
    href: '/parties',
    icon: <ListIcon className='h-4 w-4' />,
  },

  {
    title: 'Add Parties',
    href: '/parties/create',
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
export const transformerNavItems: navItem[] = [
  {
    title: 'Search Meter CTPT',
    href: '/meter-ctpt',
    icon: <ListIcon className='h-4 w-4' />,
  },

  {
    title: 'Add Meter CTPT',
    href: '/meter-ctpt/create',
    icon: <HomeIcon className='h-4 w-4' />,
  },
]

export const transformerrelNavItems: navItem[] = [
  {
    title: 'Search Meter CTPT Relations',
    href: '/meter-ctpt-rel',
    icon: <ListIcon className='h-4 w-4' />,
  },
]

export const meterReadingNavItems: navItem[] = [
  {
    title: 'Search Connections',
    href: '/billing',
    icon: <ListIcon className='h-4 w-4' />,
  },
]
