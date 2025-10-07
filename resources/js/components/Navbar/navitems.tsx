import { Contact2Icon, HomeIcon, ListIcon, PlusIcon } from 'lucide-react'
import React from 'react'

export interface navItem {
  title: string
  href: string
  icon?: React.ReactNode
  children?: navItem[]
}
export const settingsOffices: navItem[] = [
  {
    title: 'Offices',
    href: '/offices',
    icon: <ListIcon className='h-4 w-4' />,
  },
]

export const meterTimezoneNavItems: navItem[] = [
  {
    title: 'Timezones',
    href: '/metering-timezone',
    icon: <ListIcon className='h-4 w-4' />,
  },
]
export const meterNavItems: navItem[] = [
  {
    title: 'Meters',
    href: '/meters',
    icon: <ListIcon className='h-4 w-4' />,
  },
  {
    title: 'Meter CTPT',
    href: '/meter-ctpt',
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

export const consumerNavItems: navItem[] = [
  { title: 'Parties', href: '/parties', icon: <Contact2Icon className='h-4 w-4' /> },
  {
    title: 'Connections',
    href: '/connections',
    icon: <ListIcon className='h-4 w-4' />,
  },
]

export const meterReadingNavItems: navItem[] = [
  {
    title: 'Meter Readings',
    href: '/meter-reading',
    icon: <ListIcon className='h-4 w-4' />,
  },
]
